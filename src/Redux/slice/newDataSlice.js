import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    service_added: false,
    workspace_added: false,
    project_added: false,
    agent_api_token_added: false,
    has_admin_access: false
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
        }
    }
});

export const { setServiceAdded, setWorkspaceAdded, setProjectAdded,
    setAgentApiTokenAdded, setHasAdminAccess } = newDataSlice.actions;

export default newDataSlice.reducer;