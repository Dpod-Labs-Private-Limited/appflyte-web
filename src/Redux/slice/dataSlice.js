import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    organizations: [],
    services: [],
    offered_plans: [],
    user_roles: [],
    spaces: [],
    appflyte_engines: [],
    appflyte_functions: [],
    appflyte_event_types: [],
    projects: [],
    agent_api_tokens: [],
    role_instances: [],
    role_assignments: [],
    workspace_access_details: {},
    project_access_details: {},
    stripe_transactions: [],
    cost_usages: []
};

const dataSlice = createSlice({
    name: 'all_data',
    initialState,
    reducers: {

        setOrganizationsState(state, action) {
            state.organizations = action.payload;
        },
        setOfferedPlansState(state, action) {
            state.offered_plans = action.payload;
        },
        setServicesState(state, action) {
            state.services = action.payload;
        },
        setUserRoleState(state, action) {
            state.user_roles = action.payload;
        },
        setSpacesState(state, action) {
            state.spaces = action.payload;
        },
        setAppflyteEngineState(state, action) {
            state.appflyte_engines = action.payload;
        },
        setAppflyteFunctionState(state, action) {
            state.appflyte_functions = action.payload;
        },
        setAppflyteEventTypesState(state, action) {
            state.appflyte_event_types = action.payload;
        },
        setProjectsState(state, action) {
            state.projects = action.payload;
        },
        setAgentApiTokenState(state, action) {
            state.agent_api_tokens = action.payload;
        },
        setRoleAssignmentState(state, action) {
            state.role_assignments = action.payload;
        },
        setRoleInstanceState(state, action) {
            state.role_instances = action.payload;
        },
        setWorkspaceAccessState(state, action) {
            state.workspace_access_details = action.payload;
        },
        setProjectAccessState(state, action) {
            state.project_access_details = action.payload;
        },
        setStripeTransactionsState(state, action) {
            state.stripe_transactions = action.payload;
        },
        setCostUsageState(state, action) {
            state.cost_usages = action.payload;
        },
    },
});

export const {
    setOrganizationsState,
    setOfferedPlansState,
    setServicesState,
    setUserRoleState,
    setSpacesState,
    setAppflyteEngineState,
    setAppflyteFunctionState,
    setAppflyteEventTypesState,
    setProjectsState,
    setAgentApiTokenState,
    setRoleInstanceState,
    setRoleAssignmentState,
    setWorkspaceAccessState,
    setProjectAccessState,
    setStripeTransactionsState,
    setCostUsageState
} = dataSlice.actions;

export default dataSlice.reducer;