import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    service_added: false,
    workspace_added: false,
    project_added: false,
    agent_api_token_added: false,
    has_admin_access: false,
    analytics_app_added: false,
    analytics_data_source_added: false,
    analytics_data_set_added: false,
    extraction_integration_added: false,
    extraction_trigger_added: false
};

const newDataSlice = createSlice({
    name: 'new_data',
    initialState,
    reducers: {
        setServiceAdded(state, action) {
            state.service_added = action.payload;
        },
        setWorkspaceAdded(state, action) {
            state.workspace_added = action.payload;
        },
        setProjectAdded(state, action) {
            state.project_added = action.payload;
        },
        setAgentApiTokenAdded(state, action) {
            state.agent_api_token_added = action.payload;
        },
        setHasAdminAccess(state, action) {
            state.has_admin_access = action.payload;
        },
        setExtractionIntegrationAdded(state, action) {
            state.extraction_integration_added = action.payload;
        },
        setExtractionTriggerAdded(state, action) {
            state.extraction_trigger_added = action.payload;
        },
        setAnalyticsAppsAdded(state, action) {
            state.analytics_app_added = action.payload;
        },
        setAnalyticsDataSourcesAdded(state, action) {
            state.analytics_data_source_added = action.payload;
        },
        setAnalyticsDataSetAdded(state, action) {
            state.analytics_data_set_added = action.payload;
        }
    }
});

export const {
    setServiceAdded,
    setWorkspaceAdded,
    setProjectAdded,
    setAgentApiTokenAdded,
    setHasAdminAccess,
    setExtractionIntegrationAdded,
    setExtractionTriggerAdded,
    setAnalyticsAppsAdded,
    setAnalyticsDataSourcesAdded,
    setAnalyticsDataSetAdded
} = newDataSlice.actions;

export default newDataSlice.reducer;