import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

import { useAppContext } from '../../context/AppContext';
import { fetchOrganizationId, fetchOwnerByOrganization, getUserItemId } from '../../utils/GetAccountDetails';
import { getOrganizationData } from '../../utils/ApiFunctions/OrganizationsData';
import {
    setAppflyteEngineState, setOrganizationsState, setProjectsState, setRoleAssignmentState,
    setRoleInstanceState, setServicesState, setSpacesState
} from '../../Redux/slice/dataSlice';
import { getServicesByOrganization } from '../../utils/ApiFunctions/ServicesData';
import getSpaceData from '../../utils/ApiFunctions/SpaceData';
import getProjectData from '../../utils/ApiFunctions/ProjectData';
import { getAllRoleAssignmentData, getAllRoleInstanceData } from '../../utils/ApiFunctions/AccessControlData';
import { getStyles } from './styles';
import { setServiceAdded } from '../../Redux/slice/newDataSlice';

import { useIntl } from 'react-intl';
import messages from './messages';
import LoadBar from '../../utils/LoadBar';
import getAppflyteEnginesData from '../../utils/ApiFunctions/AppflyteEngines';

function MainHome() {

    const theme = useTheme();
    const styles = getStyles(theme);
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const intl = useIntl();
    const { isAuthenticated } = useOutletContext();
    const { selectedOrganization, setDataLoading, setSelectedOrganization, setSelectedService, authData } = useAppContext();
    const [loading, setLoading] = useState(true)
    const [errorType, setErrorType] = useState("organization")

    const all_organizations = useSelector(state => state.all_data.organizations);
    const all_services = useSelector(state => state.all_data.services);
    const all_spaces = useSelector(state => state.all_data.spaces);
    const all_projects = useSelector(state => state.all_data.projects)
    const all_role_instances = useSelector(state => state.all_data.all_role_instances);
    const all_role_assignments = useSelector(state => state.all_data.all_role_assignments);
    const service_added = useSelector(state => state.data_added.service_added)
    const all_engines = useSelector(state => state.all_data.appflyte_engines);

    useEffect(() => {
        if (isAuthenticated) {
            getUserDeatils()
        }
        //eslint-disable-next-line
    }, [isAuthenticated])

    useEffect(() => {
        if (isAuthenticated && selectedOrganization) {
            fetchAllData()
        }
        //eslint-disable-next-line
    }, [isAuthenticated, selectedOrganization, service_added])

    const getUserDeatils = async () => {
        try {
            const user_organization = fetchOrganizationId();
            if ((user_organization || user_organization)?.length > 0) {

                const userAuthType = authData?.user_auth_type ?? null;
                const creditBundleId = authData?.credit_bundle_id ?? null;

                const [organizations_data, appflyteEngines] = await Promise.all([
                    getAllOrganization(),
                    getAllAppflyteEngines()
                ])

                if (organizations_data && (organizations_data)?.length) {
                    if ((organizations_data || [])?.length === 1) {

                        const selected_org = (organizations_data || [])?.at(-1)
                        setSelectedOrganization({ ...selected_org })

                        const organization_id = selected_org?.payload?.__auto_id__ ?? null;
                        // const is_owner = await fetchOwnerByOrganization(organization_id)

                        // if (userAuthType === "external_ameya_stripe" && creditBundleId && is_owner) {
                        //     navigate("/user/billing")
                        //     return
                        // }

                        const filtered_engine = (appflyteEngines || []).find((e) => e?.payload?.configuration?.engine_name === "appflyte_agent") ?? null;
                        if (!filtered_engine) {
                            setErrorType('service')
                            return
                        }

                        const engine_id = filtered_engine?.payload?.__auto_id__ ?? null;
                        const service_name = filtered_engine?.payload?.configuration?.engine_name ?? null;
                        const response = await getServicesByOrganization(organization_id);
                        const services = response ?? [];


                        if (!response || !services.length) {
                            navigate(`/organization/${organization_id}/services/add-service`, {
                                state: {
                                    engine_type: engine_id,
                                    service_name: service_name
                                }
                            })
                            return
                        }

                        const selected_service = services.find((s) => s?.payload?.appflyte_engine?.includes(engine_id)) ?? null;
                        if (selected_service) {
                            setSelectedService(selected_service);
                            return navigate(`/organization/${organization_id}/workspaces`);
                        }

                        navigate(`/organization/${organization_id}/services/add-service`, {
                            state: {
                                engine_type: engine_id,
                                service_name: service_name
                            }
                        })

                    }
                    else if ((organizations_data || [])?.length > 1) {
                        setSelectedOrganization(null)
                        navigate('/organizations');
                    }
                }
                return
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const getAllOrganization = async () => {
        try {
            if (!all_organizations?.length) {
                const response = await getOrganizationData();
                const user_organization = fetchOrganizationId();
                const valid_organizations = response?.filter(item => user_organization?.includes(item?.payload?.__auto_id__)) ?? [];
                dispatch(setOrganizationsState(valid_organizations));
                return valid_organizations
            }
            return all_organizations;
        } catch (error) {
            console.error("Failed to fetch organizations", error);
            return error;
        }
    }

    const getAllAppflyteEngines = async () => {
        try {
            if (!all_engines?.length) {
                const data = await getAppflyteEnginesData();
                dispatch(setAppflyteEngineState(data));
                return data;
            }
            return all_engines;
        } catch (error) {
            console.error("Failed to fetch Engines", error);
            return [];
        }
    }

    const fetchAllData = async () => {
        setDataLoading(true)
        try {
            const organization_id = selectedOrganization?.payload?.__auto_id__ ?? null;
            await Promise.allSettled([
                getAllServiceData(organization_id),
                getAllWorkspaceData(organization_id),
                getAllProjectData(organization_id)
                // getRoleAssignmentDetails(),
                // getRoleInstanceDetails(organization_id)
            ])

        } catch (error) {
            console.log(error)
        } finally {
            setDataLoading(false)
        }
    }

    const getAllServiceData = async (organization_id) => {
        try {
            if (!all_services?.length || service_added === true) {
                const response = await getServicesByOrganization(organization_id);
                dispatch(setServicesState(response))
                dispatch(setServiceAdded(false))
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

    const isLoading = loading;
    const message = isLoading ? intl.formatMessage(messages.loading)
        :
        (<>
            <Typography sx={{ ...styles.infoText, color: '#999' }}>
                {intl.formatMessage(errorType === "organization" ? messages.error : messages.service_error)}
            </Typography>
        </>)

    return (
        <Box style={styles.mainContainer}>
            {isLoading && <LoadBar />}
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

export default MainHome;