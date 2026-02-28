# API Usage & Project Management System Design

## Overview
This document outlines the architecture for a multi-tier subscription system with monthly API call recharges, persistent project limits, and real-time balance tracking.

---

## Core Architecture

### Services & Collections

```
stripe_service (Recharge Handler)
├── Per organization
├── Monthly subscription management
└── Payment processing

cost_consumer (Usage Deduction)
├── Per organization
├── Track API calls used
├── Track projects used
└── Deduct from balance_holder

authorization (Pre-execution Gate)
├── Per API call
├── Check balance against required cost
└── Block if insufficient

balance_holder (Usage Tracking)
├── Per organization
├── api_used: integer
├── api_limit: integer
├── projects_used: integer
├── projects_limit: integer
└── recharge_expires_at: timestamp

packs (Tier Configuration)
├── free: {api: 50000, projects: 1}
├── pro: {api: 250000, projects: 5}
└── promax: {api: 500000, projects: 7}

frontend (UI Warnings)
├── Balance exhaustion warning (70%+)
├── Near-limit warning (90%+)
└── Upgrade prompts
```

---

## Subscription Plans & Limits

### Plan Details

| Plan | API Calls | Projects | Monthly Reset | Project Persistence |
|------|-----------|----------|----------------|-------------------|
| Free | 50,000 | 1 | ✓ Yes | Lifetime (1 max) |
| Pro | 250,000 | 5 | ✓ Yes | Lifetime (5 max) |
| ProMax | 500,000 | 7 | ✓ Yes | Lifetime (7 max) |

**Key Difference:**
- **API Calls:** Reset monthly on subscription renewal
- **Projects:** NEVER reset — permanent across plan changes

---

## State Management Strategy

### 1. Balance Holder Schema

```javascript
// collections.balance_holder

{
  _id: ObjectId,
  organization_id: String,           // Unique org identifier
  plan: String,                      // "free" | "pro" | "promax"
  
  // API Call Tracking
  api_used: Number,                  // 0 to api_limit
  api_limit: Number,                 // 50000, 250000, 500000
  api_reset_date: Date,              // When monthly reset occurs
  
  // Project Tracking (NEVER RESETS)
  projects_active: [
    {
      id: String,
      name: String,
      created_at: Date,
      usage_bytes: Number
    }
  ],
  projects_used: Number,             // Total active projects
  projects_limit: Number,            // 1, 5, or 7
  
  // Metadata
  last_updated: Date,
  stripe_subscription_id: String,    // Link to Stripe
  created_at: Date
}
```

### 2. Packs Schema

```javascript
// collections.packs

[
  {
    _id: ObjectId,
    plan_name: "free",
    api_calls: 50000,
    projects: 1,
    cost: 0,
    currency: "USD",
    billing_period: "monthly",
    features: ["1 project", "50k API calls/month"]
  },
  {
    _id: ObjectId,
    plan_name: "pro",
    api_calls: 250000,
    projects: 5,
    cost: 29,
    currency: "USD",
    billing_period: "monthly",
    features: ["5 projects", "250k API calls/month"]
  },
  {
    _id: ObjectId,
    plan_name: "promax",
    api_calls: 500000,
    projects: 7,
    cost: 99,
    currency: "USD",
    billing_period: "monthly",
    features: ["7 projects", "500k API calls/month"]
  }
]
```

---

## Implementation Patterns

### Pattern 1: User Signup (New User)

```javascript
async function onNewUserSignup(userId, organizationId) {
  const freePackInfo = await packs.findOne({ plan_name: "free" });
  
  // Create balance_holder for organization
  await balance_holder.insertOne({
    organization_id: organizationId,
    plan: "free",
    api_used: 0,
    api_limit: freePackInfo.api_calls,      // 50,000
    api_reset_date: addMonthsToNow(1),
    projects_active: [],
    projects_used: 0,
    projects_limit: freePackInfo.projects,   // 1
    created_at: new Date(),
    last_updated: new Date()
  });
  
  // User now has: 0/50000 API calls, 0/1 projects
}
```

---

### Pattern 2: API Call Authorization (Pre-execution Check)

```javascript
async function authorizeAPICall(organizationId, costInCredits = 100) {
  const balance = await balance_holder.findOne({
    organization_id: organizationId
  });
  
  if (!balance) {
    throw new Error("Organization not found");
  }
  
  // Check if monthly reset is needed
  if (new Date() > balance.api_reset_date) {
    // Reset API calls, extend reset date by 1 month
    await balance_holder.updateOne(
      { organization_id: organizationId },
      {
        $set: {
          api_used: 0,
          api_reset_date: addMonthsToNow(1),
          last_updated: new Date()
        }
      }
    );
    balance.api_used = 0;
  }
  
  const remaining = balance.api_limit - balance.api_used;
  
  if (remaining < costInCredits) {
    throw new Error("Insufficient API call balance");
  }
  
  return { authorized: true, remainingAfter: remaining - costInCredits };
}
```

---

### Pattern 3: Deduct API Call Usage (After Execution)

```javascript
async function deductAPIUsage(organizationId, costInCredits = 100) {
  const result = await balance_holder.findOneAndUpdate(
    { organization_id: organizationId },
    {
      $inc: { api_used: costInCredits },
      $set: { last_updated: new Date() }
    },
    { returnDocument: "after" }
  );
  
  if (!result.value) {
    throw new Error("Balance holder not found");
  }
  
  // Check for threshold warnings
  const usage_percentage = (result.value.api_used / result.value.api_limit) * 100;
  
  return {
    api_used: result.value.api_used,
    api_limit: result.value.api_limit,
    remaining: result.value.api_limit - result.value.api_used,
    usage_percentage: usage_percentage,
    status: determineBalanceStatus(usage_percentage)
  };
}

function determineBalanceStatus(percentage) {
  if (percentage >= 100) return "exhausted";
  if (percentage >= 90) return "critical";    // Show upgrade prompt
  if (percentage >= 70) return "warning";     // Show warning banner
  return "normal";
}
```

---

### Pattern 4: Create New Project (Check Limit)

```javascript
async function createProject(organizationId, projectName) {
  const balance = await balance_holder.findOne({
    organization_id: organizationId
  });
  
  if (balance.projects_used >= balance.projects_limit) {
    throw new Error(
      `Project limit reached. Current: ${balance.projects_used}/${balance.projects_limit}. ` +
      `Upgrade to add more projects.`
    );
  }
  
  const newProject = {
    id: generateProjectId(),
    name: projectName,
    created_at: new Date(),
    usage_bytes: 0
  };
  
  await balance_holder.updateOne(
    { organization_id: organizationId },
    {
      $push: { projects_active: newProject },
      $inc: { projects_used: 1 },
      $set: { last_updated: new Date() }
    }
  );
  
  return newProject;
}
```

---

### Pattern 5: Upgrade Plan (Handle Project Limits)

```javascript
async function upgradePlan(organizationId, newPlanName) {
  const newPack = await packs.findOne({ plan_name: newPlanName });
  
  if (!newPack) {
    throw new Error("Invalid plan name");
  }
  
  const balance = await balance_holder.findOne({
    organization_id: organizationId
  });
  
  // Check if user has more projects than new plan allows
  if (balance.projects_used > newPack.projects) {
    throw new Error(
      `Cannot downgrade to ${newPlanName}. ` +
      `You have ${balance.projects_used} projects but the ${newPlanName} plan only allows ${newPack.projects}. ` +
      `Delete ${balance.projects_used - newPack.projects} project(s) first.`
    );
  }
  
  // Update balance_holder with new plan
  await balance_holder.updateOne(
    { organization_id: organizationId },
    {
      $set: {
        plan: newPlanName,
        api_limit: newPack.api_calls,
        projects_limit: newPack.projects,
        api_reset_date: addMonthsToNow(1),
        last_updated: new Date()
      }
    }
  );
  
  // Trigger Stripe subscription update (see Stripe integration)
  await stripe_service.upgradeSubscription(organizationId, newPlanName);
  
  return {
    plan: newPlanName,
    api_limit: newPack.api_calls,
    projects_limit: newPack.projects
  };
}
```

---

### Pattern 6: Monthly Reset (Scheduled Job)

```javascript
// This runs once per day via cron/scheduler
async function monthlyResetJob() {
  const now = new Date();
  
  // Find all organizations with reset date in the past
  const toReset = await balance_holder.find({
    api_reset_date: { $lte: now }
  });
  
  for (const balance of toReset) {
    await balance_holder.updateOne(
      { _id: balance._id },
      {
        $set: {
          api_used: 0,                          // Reset API calls
          api_reset_date: addMonthsToNow(1),    // Extend reset date
          last_updated: new Date()
          // projects_active: NOT TOUCHED        // Keep all projects
          // projects_used: NOT TOUCHED          // Keep count
        }
      }
    );
    
    console.log(`Reset API for org ${balance.organization_id}`);
  }
}
```

---

## Frontend Implementation

### 1. Balance Status Display

```javascript
async function getBalanceStatus(organizationId) {
  const balance = await balance_holder.findOne({
    organization_id: organizationId
  });
  
  const api_percentage = (balance.api_used / balance.api_limit) * 100;
  const projects_percentage = (balance.projects_used / balance.projects_limit) * 100;
  
  return {
    api: {
      used: balance.api_used,
      limit: balance.api_limit,
      remaining: balance.api_limit - balance.api_used,
      percentage: api_percentage,
      status: api_percentage >= 90 ? "critical" : api_percentage >= 70 ? "warning" : "ok"
    },
    projects: {
      used: balance.projects_used,
      limit: balance.projects_limit,
      remaining: balance.projects_limit - balance.projects_used,
      status: balance.projects_used >= balance.projects_limit ? "full" : "ok"
    },
    resets_at: balance.api_reset_date,
    current_plan: balance.plan
  };
}
```

### 2. Warning Banners

```javascript
// Component logic
function BalanceWarning({ balance }) {
  if (balance.api.percentage >= 100) {
    return (
      <Banner type="error" title="API Balance Exhausted">
        You've used all your API calls for this month. 
        Upgrade your plan to continue.
      </Banner>
    );
  }
  
  if (balance.api.percentage >= 90) {
    return (
      <Banner type="critical" title="API Balance Critical">
        {balance.api.remaining} API calls remaining.
        Consider upgrading to avoid interruptions.
      </Banner>
    );
  }
  
  if (balance.api.percentage >= 70) {
    return (
      <Banner type="warning" title="API Balance Warning">
        {balance.api.remaining} API calls remaining this month.
      </Banner>
    );
  }
  
  if (balance.projects.status === "full") {
    return (
      <Banner type="info" title="Project Limit Reached">
        You've reached your project limit ({balance.projects.limit}). 
        Upgrade to create more projects.
      </Banner>
    );
  }
  
  return null;
}
```

---

## Stripe Integration (stripe_service)

### 1. Create Subscription

```javascript
async function createSubscription(organizationId, planName) {
  const pack = await packs.findOne({ plan_name: planName });
  
  // Assume user has stripe_customer_id in database
  const subscription = await stripe.subscriptions.create({
    customer: userStripeCustomerId,
    items: [{ price: pack.stripe_price_id }],
    metadata: { organization_id: organizationId, plan_name: planName }
  });
  
  // Update balance_holder with Stripe subscription ID
  await balance_holder.updateOne(
    { organization_id: organizationId },
    {
      $set: {
        stripe_subscription_id: subscription.id,
        plan: planName,
        api_limit: pack.api_calls,
        projects_limit: pack.projects
      }
    }
  );
  
  return subscription;
}
```

### 2. Handle Stripe Webhooks

```javascript
async function handleStripeWebhook(event) {
  switch (event.type) {
    case "customer.subscription.updated":
      const updatedSub = event.data.object;
      const organizationId = updatedSub.metadata.organization_id;
      const newPlanName = updatedSub.metadata.plan_name;
      
      // Already handled in upgradePlan(), but log for safety
      console.log(`Subscription updated: ${organizationId} -> ${newPlanName}`);
      break;
      
    case "customer.subscription.deleted":
      const deletedSub = event.data.object;
      // Handle plan cancellation (revert to free or suspend)
      break;
      
    case "invoice.payment_succeeded":
      // Log successful payment
      break;
  }
}
```

---

## Cost Calculation

### Per-API-Call Model

Each API call has a base cost in "credits":
- Simple query: 100 credits
- Complex query: 500 credits
- Batch operation: 1000 credits

At authorization time, check if `remaining_credits >= required_credits`.

---

## Key Decision Points

### 1. When to Check Balance?

**Authorization Service** (Pre-execution):
- Check before processing ANY API request
- Prevents partial execution and rollback complexity
- Return status to prevent wasted computation

**Cost Consumer** (Post-execution):
- Deduct costs only after successful execution
- Prevents free failed attempts
- Log actual usage for auditing

### 2. Monthly Reset Behavior

**API Calls:** Reset automatically on `api_reset_date`
- Checked during authorization
- If reset date passed, reset in-place then authorize
- No need to track "next reset" separately

**Projects:** NEVER reset
- Permanent across all plan changes
- Only destroyed when user deletes them
- Allows users to keep work across downgrades

### 3. Downgrade Handling

If user tries to downgrade from Pro (5 projects) to Free (1 project) with 3 projects:
- **Block downgrade** until projects reduced to 1
- **Do NOT auto-delete** projects (data loss)
- **Require explicit deletion** before allowing downgrade

If user downgrades legitimately, existing projects remain accessible:
```javascript
// User on Pro with 5 projects, downgrades to Free
// Result: Projects 1-5 still exist, but can't create new ones
// Can only use 1 project at a time until upgrade
```

---

## Database Indexing

```javascript
// Essential indexes for performance

// balance_holder collection
db.balance_holder.createIndex({ organization_id: 1 }, { unique: true });
db.balance_holder.createIndex({ api_reset_date: 1 });
db.balance_holder.createIndex({ stripe_subscription_id: 1 });

// packs collection
db.packs.createIndex({ plan_name: 1 }, { unique: true });
```

---

## API Response Examples

### Get Balance Status

```json
{
  "api": {
    "used": 35000,
    "limit": 50000,
    "remaining": 15000,
    "percentage": 70,
    "status": "warning"
  },
  "projects": {
    "used": 1,
    "limit": 1,
    "remaining": 0,
    "status": "ok"
  },
  "plan": "free",
  "resets_at": "2025-03-27T00:00:00Z"
}
```

### Authorize API Call (Success)

```json
{
  "authorized": true,
  "remaining_after": 14900,
  "status": "warning",
  "message": "Authorization successful. 14,900 calls remaining."
}
```

### Authorize API Call (Failure)

```json
{
  "authorized": false,
  "remaining": 0,
  "status": "exhausted",
  "message": "Insufficient API call balance. Upgrade your plan.",
  "next_reset": "2025-03-27T00:00:00Z"
}
```

### Create Project (Failure)

```json
{
  "success": false,
  "error": "Project limit reached",
  "message": "Current: 1/1 projects. Upgrade to add more projects.",
  "current_plan": "free",
  "suggested_upgrade": "pro"
}
```

---

## Anomaly Handling

### What if user cheats by running queries without authorization?

**Prevention:** Make authorization **blocking and mandatory**
- Every API endpoint must call `authorizeAPICall()` before proceeding
- Cost is deducted in `cost_consumer` regardless
- Audit logs track all calls

### What if reset date is set in the past?

**Fix in authorization:**
```javascript
if (now > balance.api_reset_date && !resetting) {
  // Automatically reset
  await resetBalance(organizationId);
  // Then retry authorization with fresh balance
}
```

### What if user deletes a project mid-month?

**Update balance_holder:**
```javascript
async function deleteProject(organizationId, projectId) {
  await balance_holder.updateOne(
    { organization_id: organizationId },
    {
      $pull: { projects_active: { id: projectId } },
      $inc: { projects_used: -1 },
      $set: { last_updated: new Date() }
    }
  );
}
```

---

## Summary of Implementation Flow

1. **User Signs Up** → Create balance_holder with free plan
2. **API Call Initiated** → authorization checks balance
3. **API Executes** → cost_consumer deducts usage
4. **Frontend Loads** → Shows balance + warnings
5. **Month Ends** → Scheduled job resets api_used
6. **User Upgrades** → Updates api_limit, projects_limit (projects preserved)
7. **User Deletes Project** → Decrements projects_used

All operations are atomic to prevent race conditions.
