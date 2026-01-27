import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';

import { useAppContext } from '../../context/AppContext';
import { getOrganizationData } from '../../utils/ApiFunctions/OrganizationsData';
import { getServicesByOrganization } from '../../utils/ApiFunctions/ServicesData';
import getSpaceData from '../../utils/ApiFunctions/SpaceData';
import getProjectData from '../../utils/ApiFunctions/ProjectData';
import { fetchOrganizationId, getUserItemId } from '../../utils/GetAccountDetails';
import { getAllRoleAssignmentData, getAllRoleInstanceData } from '../../utils/ApiFunctions/AccessControlData';
import { setOrganizationsState, setProjectsState, setRoleAssignmentState, setRoleInstanceState, setServicesState, setSpacesState } from '../../Redux/slice/dataSlice';
import { getStyles } from './styles';
import { Box, Typography } from '@mui/material';
import LoadBar from '../../utils/LoadBar';
import { useIntl } from 'react-intl';
import messages from './messages';

function ExternalSignup() {

    const navigate = useNavigate()
    const theme = useTheme();
    const styles = getStyles(theme);
    const intl = useIntl();

    const { authData, setSelectedOrganization, setSelectedService, setSelectedWorkspace, setSelectedProject } = useAppContext();

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false)

    const all_services = useSelector(state => state.all_data.services);
    const all_spaces = useSelector(state => state.all_data.spaces);
    const all_projects = useSelector(state => state.all_data.projects)
    const all_role_instances = useSelector(state => state.all_data.all_role_instances);
    const all_role_assignments = useSelector(state => state.all_data.all_role_assignments);
    const service_added = useSelector(state => state.data_added.service_added)

    useEffect(() => {
        if (!authData) return;

        const { organization_id, service_id, workspace_id, project_id, file_id, document_type, request_type } = authData;
        const requiredValues = [organization_id, service_id, workspace_id, project_id, file_id, document_type];

        const isMissingRequired = requiredValues.some(v => !v);
        const isValidRequest = request_type === "ext_user_signup";

        if (isMissingRequired || !isValidRequest) {
            navigate("/home");
            return;
        }
        fetchAllData(organization_id);
    }, [authData]);

    const fetchAllData = async (organization_id) => {
        setLoading(true)
        try {

            dispatch(setSpacesState([]))
            dispatch(setProjectsState([]))
            setSelectedOrganization(null);
            setSelectedService(null)
            setSelectedWorkspace(null)
            setSelectedProject(null)

            const [orgResponse, serviceResponse, workspaceResponse, projectResponse,
                roleAssignResponse, roleInstanceResponse] = await Promise.all([
                    fetchOrganizationData(),
                    getAllServiceData(organization_id),
                    getAllWorkspaceData(organization_id),
                    getAllProjectData(organization_id),
                    getRoleAssignmentDetails(),
                    getRoleInstanceDetails(organization_id)
                ])
                
            const filtered_organzation = (orgResponse || [])?.find(item => item?.payload?.__auto_id__ === authData?.organization_id) ?? null;
            const filtered_service = (serviceResponse || [])?.find(item => item?.payload?.__auto_id__ === authData?.service_id) ?? null;
            const filtered_workspace = (workspaceResponse || [])?.find(item => item?.payload?.__auto_id__ === authData?.workspace_id) ?? null;
            const filtered_project = (projectResponse || [])?.find(item => item?.payload?.__auto_id__ === authData?.project_id) ?? null;

            setSelectedOrganization({ ...filtered_organzation });
            setSelectedService(filtered_service)
            setSelectedWorkspace(filtered_workspace)
            setSelectedProject(filtered_project)
            navigate("/document-types")

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const fetchOrganizationData = async () => {
        try {
            const user_organization = fetchOrganizationId();
            if ((user_organization || user_organization)?.length > 0) {
                const response = await getOrganizationData();
                const valid_organizations = response?.filter(item => user_organization?.includes(item?.payload?.__auto_id__)) ?? [];
                dispatch(setOrganizationsState(valid_organizations));
                return valid_organizations;
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getAllServiceData = async (organization_id) => {
        try {
            if (!all_services?.length || service_added === true) {
                const response = await getServicesByOrganization(organization_id);
                dispatch(setServicesState(response))
                return response
            }
        } catch (error) {
            console.error("Failed to fetch Services", error);
            return error;
        }
    }

    const getAllWorkspaceData = async (organization_id) => {
        try {
            if (!all_spaces?.length) {
                const response = await getSpaceData(organization_id);
                dispatch(setSpacesState(response))
                return response
            }
        } catch (error) {
            console.error("Failed to fetch Services", error);
            return error;
        }
    }

    const getAllProjectData = async (organization_id) => {
        try {
            if (!all_projects?.length) {
                const response = await getProjectData(organization_id);
                dispatch(setProjectsState(response))
                return response
            }
        } catch (error) {
            console.error("Failed to fetch Services", error);
            return error;
        }
    }

    const getRoleAssignmentDetails = async () => {
        try {
            if (!all_role_assignments?.length) {
                const user_id = await getUserItemId();
                const response = await getAllRoleAssignmentData(user_id)
                dispatch(setRoleAssignmentState(response))
                return response
            }
        } catch (error) {
            console.error("Failed to fetch Services", error);
            return error;
        }
    }

    const getRoleInstanceDetails = async (organization_id) => {
        try {
            if (!all_role_instances?.length) {
                const response = await getAllRoleInstanceData(organization_id)
                dispatch(setRoleInstanceState(response))
                return response
            }
        } catch (error) {
            console.error("Failed to fetch Services", error);
            return error;
        }
    }

    const message = loading ? intl.formatMessage(messages.loading)
        :
        (<>
            <Typography sx={{ ...styles.infoText, color: '#999' }}>
                {intl.formatMessage(messages.error)}
            </Typography>
        </>)

    return (
        <Box style={styles.mainContainer}>
            {loading && <LoadBar />}
            <Box sx={{ ...styles.cardContainer }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography sx={styles.infoText}>
                        {message}
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default ExternalSignup;