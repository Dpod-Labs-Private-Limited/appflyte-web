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
    relam_settings: [],
    ameya_guide: null,
    extraction_files: [],
    extraction_tasks: [],
    extraction_main_document_types: [],
    extraction_document_types: [],
    extraction_integrations: [],
    extraction_triggers: [],
    extraction_default_schemas: [],
    role_instances: [],
    role_assignments: [],
    workspace_access_details: {},
    project_access_details: {},
    analytics_data_sources: [],
    analytics_data_sets: [],
    analytics_apps: [],
    analytics_files: [],
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
        setRelamSettingState(state, action) {
            state.relam_settings = action.payload;
        },
        setAmeyaGuideState(state, action) {
            state.ameya_guide = action.payload;
        },
        setExtractionFilesState(state, action) {
            state.extraction_files = action.payload;
        },
        setExtractionMainDocumentTypesState(state, action) {
            state.extraction_main_document_types = action.payload;
        },
        setExtractionDocumentTypesState(state, action) {
            state.extraction_document_types = action.payload;
        },
        setExtractionIntegrationsState(state, action) {
            state.extraction_integrations = action.payload;
        },
        setExtractionTriggersState(state, action) {
            state.extraction_triggers = action.payload;
        },
        setExtractionDefaultSchemasState(state, action) {
            state.extraction_default_schemas = action.payload;
        },
        setExtractionTasksState(state, action) {
            state.extraction_tasks = action.payload;
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
        setAnalyticsDataSourcesState(state, action) {
            state.analytics_data_sources = action.payload;
        },
        setAnalyticsDataSetsState(state, action) {
            state.analytics_data_sets = action.payload;
        },
        setAnalyticsAppsState(state, action) {
            state.analytics_apps = action.payload;
        },
        setAnalyticsFilesState(state, action) {
            state.analytics_files = action.payload;
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
    setRelamSettingState,
    setExtractionFilesState,
    setExtractionTasksState,
    setExtractionMainDocumentTypesState,
    setExtractionDocumentTypesState,
    setExtractionIntegrationsState,
    setExtractionTriggersState,
    setExtractionDefaultSchemasState,
    setExtractionTemplatesState,
    setRoleInstanceState,
    setRoleAssignmentState,
    setWorkspaceAccessState,
    setProjectAccessState,
    setAnalyticsDataSourcesState,
    setAnalyticsDataSetsState,
    setAnalyticsAppsState,
    setAmeyaGuideState,
    setAnalyticsFilesState,
    setStripeTransactionsState,
    setCostUsageState
} = dataSlice.actions;

export default dataSlice.reducer;