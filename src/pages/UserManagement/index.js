import React, { useEffect, useState } from 'react';
import { AppflytePermissions } from "dpod-access-control";
import { Box } from '@mui/material';
import { getStyles } from './styles';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { useAppContext } from '../../context/AppContext';
import { getUserItemId } from '../../utils/GetAccountDetails';

function UserManagement() {
    const theme = useTheme();
    const styles = getStyles(theme);
    const workspace_access_details = useSelector(state => state.all_data.workspace_access_details);
    const project_access_details = useSelector(state => state.all_data.project_access_details);
    const { selectedOrganization } = useAppContext();
    const [appflyte_user_id, setAppflyteUserId] = useState(null);

    const [workspaceView, setWorkspaceView] = useState({ 'workspace_id': '', 'workspace_name': '', 'workspace_view': false })
    const [projectView, setProjectView] = useState({ 'project_id': '', 'project_name': '', 'project_view': false })
    const organizationId = selectedOrganization?.payload?.__auto_id__ || null

    const app_name = process.env.REACT_APP_NAME
    const schema_id = process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID
    const appflyte_backend_url = process.env.REACT_APP_APPFLYTE_BACKEND_URL
    const appflyte_authentication_url = process.env.REACT_APP_OAUTH_SERVER_URL
    const invite_web_app_url = process.env.REACT_APP_INVITE_WEB_APP_URL

    const appflyte_account_id = process.env.REACT_APP_APPFLYTE_ACCOUNT_ID
    const appflyte_subscriber_id = process.env.REACT_APP_APPFLYTE_SUBSCRIBER_ID
    const appflyte_subscription_id = process.env.REACT_APP_APPFLYTE_SUBSCRIPTION_ID

    useEffect(() => {
        const loadUserId = async () => {
            const id = await getUserItemId();
            setAppflyteUserId(id);
        };

        loadUserId();
    }, []);

    useEffect(() => {
        if (workspace_access_details?.workspace_view) {
            setWorkspaceView({
                ...workspaceView,
                workspace_id: workspace_access_details?.workspace_id,
                workspace_name: workspace_access_details?.workspace_name,
                workspace_view: workspace_access_details?.workspace_view ?? false
            })
        }
        if (project_access_details?.project_view) {
            setWorkspaceView({
                ...workspaceView,
                workspace_id: project_access_details?.workspace_id,
                workspace_name: project_access_details?.workspace_name,
            })
            setProjectView({
                ...workspaceView,
                project_id: project_access_details?.project_id,
                project_name: project_access_details?.project_name,
                project_view: project_access_details?.project_view ?? false
            })
        }
    }, [workspace_access_details, project_access_details])

    return (
        <div style={styles.mainContainer}>
            <Box sx={{ ...styles.cardContainer }}>
                {(organizationId && appflyte_user_id) && <AppflytePermissions
                    app_name={app_name}
                    schema_id={schema_id}
                    appflyte_backend_url={appflyte_backend_url}
                    appflyte_authentication_url={appflyte_authentication_url}
                    invite_web_app_url={invite_web_app_url}

                    appflyte_account_id={appflyte_account_id}
                    appflyte_subscriber_id={appflyte_subscriber_id}
                    appflyte_subscription_id={appflyte_subscription_id}
                    appflyte_organization_id={organizationId}
                    appflyte_user_id={appflyte_user_id}

                    workspace_view={workspaceView.workspace_view}
                    workspace_id={workspaceView.workspace_id}
                    workspace_name={workspaceView.workspace_name}

                    project_view={projectView.project_view}
                    project_id={projectView.project_id}
                    project_name={projectView.project_name}
                />}
            </Box>
        </div>
    )
}

export default UserManagement;