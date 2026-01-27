import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { Box, Button, Typography } from '@mui/material';
import { ReactSVG } from 'react-svg';

import { useAppContext } from '../../context/AppContext';
import { setOrganizationsState, setProjectsState, setRoleAssignmentState, setRoleInstanceState, setServicesState, setSpacesState } from '../../Redux/slice/dataSlice';
import { fetchOrganizationId, getUserItemId, getUserName } from '../../utils/GetAccountDetails';
import { getOrganizationData } from '../../utils/ApiFunctions/OrganizationsData';
import { getServicesByOrganization } from '../../utils/ApiFunctions/ServicesData';
import getSpaceData from '../../utils/ApiFunctions/SpaceData';
import getProjectData from '../../utils/ApiFunctions/ProjectData';
import { getAllRoleAssignmentData, getAllRoleInstanceData } from '../../utils/ApiFunctions/AccessControlData';
import AmeyaAuthApi from '../../Api/Services/AppflyteAuth/UserSetupService';
import { IconSvg } from '../../utils/globalIcons';
import LoadBar from '../../utils/LoadBar';
import { getStyles } from './styles';
import setupStepsData from './setup_steps.json';

const POLL_INTERVAL = 5000;
const REQUIRED_SETUP_FIELDS = ['organization_id', 'service_id', 'workspace_id', 'project_id'];

const STATUS_ICONS = {
    extraction_init_status: {
        init: IconSvg.initStatusIcon,
        loading: IconSvg.statusLoadingIcon,
        complete: IconSvg.check2Icon,
    },
    extraction_space_project_status: {
        init: IconSvg.initStatusIcon,
        loading: IconSvg.statusLoadingIcon,
        complete: IconSvg.check2Icon,
    },
    extraction_doctype_schema_status: {
        init: IconSvg.initStatusIcon,
        loading: IconSvg.statusLoadingIcon,
        complete: IconSvg.check2Icon,
    },
    analytics_init_status: {
        init: IconSvg.initStatusIcon,
        loading: IconSvg.statusLoadingIcon,
        complete: IconSvg.check2Icon,
    },
    analytics_data_source_status: {
        init: IconSvg.initStatusIcon,
        loading: IconSvg.statusLoadingIcon,
        complete: IconSvg.check2Icon,
    },
    analytics_dataset_app_status: {
        init: IconSvg.initStatusIcon,
        loading: IconSvg.statusLoadingIcon,
        complete: IconSvg.check2Icon,
    },
};

const mapTaskStatus = (status) => {
    if (status === 'pending' || status === 'in_progress') return 'loading';
    if (status === 'completed') return 'complete';
    if (status === 'failed' || status === 'cancelled') return 'error';
    return 'init';
};

const findItemById = (array, id) => array?.find(item => item?.payload?.__auto_id__ === id) ?? null;

function UserSetup() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const theme = useTheme();
    const location = useLocation();
    const styles = getStyles(theme);

    const { authData, setSelectedOrganization, setSelectedService, setSelectedWorkspace,
        setSelectedProject, updateAuthData, initialAuthData } = useAppContext();

    const all_services = useSelector(state => state.all_data.services);
    const all_spaces = useSelector(state => state.all_data.spaces);
    const all_projects = useSelector(state => state.all_data.projects);
    const all_role_instances = useSelector(state => state.all_data.all_role_instances);
    const all_role_assignments = useSelector(state => state.all_data.all_role_assignments);
    const service_added = useSelector(state => state.data_added.service_added);

    const [loading, setLoading] = useState(false);
    const [pollLoading, setPollLoading] = useState(false);
    const [setupLoading, setSetupLoading] = useState(false);
    const [loadStatus, setLoadStatus] = useState(false);
    const [statusSessionId, setSessionId] = useState(null);
    const [setupDetails, setSetupDetails] = useState({ organization_id: null, service_id: null, workspace_id: null, project_id: null });
    const [setupFinalStatus, setSetupFinalStatus] = useState(null);
    const [serviceData, setServiceData] = useState(setupStepsData);

    const pollingTimeoutRef = useRef(null);
    const isPollingRef = useRef(false);
    const hasInitializedRef = useRef(false);

    useEffect(() => {
        return () => {
            if (pollingTimeoutRef.current) {
                clearTimeout(pollingTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (hasInitializedRef.current) return;

        if (location.state?.from !== 'login') {
            updateAuthData(initialAuthData);
            navigate('/home', { replace: true });
            return;
        }

        if (!authData) return;

        const { organization_id, document_type, file_id, request_type } = authData;
        const requiredValues = [organization_id, document_type, file_id];
        const isMissingRequired = requiredValues.some(v => !v);

        if (isMissingRequired || request_type !== 'ext_user_signup') {
            navigate('/home');
            return;
        }

        hasInitializedRef.current = true;
        handleExternalUserSetup(organization_id, document_type);
    }, [location.state?.from, authData?.request_type]);

    useEffect(() => {
        if (!statusSessionId || isPollingRef.current) return;

        isPollingRef.current = true;
        setPollLoading(true);
        pollSetupStatus();

        return () => {
            isPollingRef.current = false;
            if (pollingTimeoutRef.current) {
                clearTimeout(pollingTimeoutRef.current);
            }
        };
    }, [statusSessionId]);

    useEffect(() => {
        if (setupFinalStatus === null) return;

        const hasAllDetails = REQUIRED_SETUP_FIELDS.every(
            field => setupDetails[field]
        );

        if (setupFinalStatus === 'completed' && hasAllDetails) {
            handleUserServiceSelection();
        } else if (setupFinalStatus === 'failed') {
            console.error('Setup failed');
            navigate('/home');
        }
    }, [setupFinalStatus]);

    const handleExternalUserSetup = async (org_id, document_type) => {
        setLoading(true);
        try {

            dispatch(setSpacesState([]));
            dispatch(setProjectsState([]));
            setSelectedOrganization(null);
            setSelectedService(null);
            setSelectedWorkspace(null);
            setSelectedProject(null);

            const [user_id, user_name] = await Promise.all([
                getUserItemId(),
                Promise.resolve(getUserName())
            ]);

            const response = await AmeyaAuthApi.user_setup(user_id, user_name, document_type, org_id);
            if (response.status === 200) {
                const responseData = response.data ?? {};
                setSessionId(responseData.session_id ?? null);
                setSetupDetails({
                    organization_id: responseData.organization_id ?? null,
                    service_id: responseData.service_id ?? null,
                    workspace_id: responseData.workspace_id ?? null,
                    project_id: responseData.project_id ?? null,
                });
            } else {
                throw new Error(`Setup failed with status ${response.status}`);
            }
        } catch (error) {
            console.error('External user setup error:', error);
            navigate('/home');
        } finally {
            setLoading(false);
        }
    };

    const fetchSetupStatus = useCallback(async () => {
        if (!statusSessionId) return null;

        setSetupLoading(true);
        try {
            const response = await AmeyaAuthApi.user_setup_status(statusSessionId);
            const responseData = response?.data;

            if (response.status !== 200 || !responseData?.session) {
                return null;
            }

            const setup_status = responseData.session.status;
            const setup_tasks = responseData.session.tasks ?? {};
            const tasksArray = Object.values(setup_tasks);

            setServiceData(prev =>
                prev.map(service => {
                    let canProceed = true;
                    return {
                        ...service,
                        status_data: service.status_data.map(stat => {
                            const task = tasksArray.find(t => t?.task_type === stat.type);

                            if (!task || !canProceed) {
                                return { ...stat, status: 'init' };
                            }

                            const mappedStatus = mapTaskStatus(task.status);
                            if (mappedStatus !== 'complete') {
                                canProceed = false;
                            }

                            return { ...stat, status: mappedStatus };
                        }),
                    };
                })
            );

            return setup_status;
        } catch (error) {
            console.error('Failed to fetch setup status:', error);
            return null;
        } finally {
            setSetupLoading(false);
        }
    }, [statusSessionId]);

    const pollSetupStatus = useCallback(async () => {
        const status = await fetchSetupStatus();

        if (status === 'completed' || status === 'failed') {
            console.log('Polling stopped:', status);
            AmeyaAuthApi.user_session_delete(statusSessionId);
            setPollLoading(false);
            setSetupFinalStatus(status);
            isPollingRef.current = false;
            return;
        }
        pollingTimeoutRef.current = setTimeout(pollSetupStatus, POLL_INTERVAL);
    }, [fetchSetupStatus]);

    // Fetch organization data
    const fetchOrganizationData = useCallback(async () => {
        try {
            const user_organization = fetchOrganizationId();
            if (!user_organization?.length) {
                return [];
            }

            const response = await getOrganizationData();
            const valid_organizations =
                response?.filter(item =>
                    user_organization.includes(item?.payload?.__auto_id__)
                ) ?? [];

            dispatch(setOrganizationsState(valid_organizations));
            return valid_organizations;
        } catch (error) {
            console.error('Failed to fetch organizations:', error);
            return [];
        }
    }, [dispatch]);

    // Fetch service data
    const getAllServiceData = useCallback(async () => {
        try {
            if (all_services?.length && !service_added) {
                return all_services;
            }

            const response = await getServicesByOrganization(
                setupDetails.organization_id
            );
            dispatch(setServicesState(response));
            return response;
        } catch (error) {
            console.error('Failed to fetch services:', error);
            return [];
        }
    }, [all_services, service_added, setupDetails.organization_id, dispatch]);

    // Fetch workspace data
    const getAllWorkspaceData = useCallback(async () => {
        try {
            if (all_spaces?.length) {
                return all_spaces;
            }

            const response = await getSpaceData(setupDetails.organization_id);
            dispatch(setSpacesState(response));
            return response;
        } catch (error) {
            console.error('Failed to fetch workspaces:', error);
            return [];
        }
    }, [all_spaces, setupDetails.organization_id, dispatch]);

    // Fetch project data
    const getAllProjectData = useCallback(async () => {
        try {
            if (all_projects?.length) {
                return all_projects;
            }

            const response = await getProjectData(setupDetails.organization_id);
            dispatch(setProjectsState(response));
            return response;
        } catch (error) {
            console.error('Failed to fetch projects:', error);
            return [];
        }
    }, [all_projects, setupDetails.organization_id, dispatch]);

    // Fetch role assignment data
    const getRoleAssignmentDetails = useCallback(async () => {
        try {
            if (all_role_assignments?.length) {
                return all_role_assignments;
            }

            const user_id = await getUserItemId();
            const response = await getAllRoleAssignmentData(user_id);
            dispatch(setRoleAssignmentState(response));
            return response;
        } catch (error) {
            console.error('Failed to fetch role assignments:', error);
            return [];
        }
    }, [all_role_assignments, dispatch]);

    // Fetch role instance data
    const getRoleInstanceDetails = useCallback(async () => {
        try {
            if (all_role_instances?.length) {
                return all_role_instances;
            }

            const response = await getAllRoleInstanceData(
                setupDetails.organization_id
            );
            dispatch(setRoleInstanceState(response));
            return response;
        } catch (error) {
            console.error('Failed to fetch role instances:', error);
            return [];
        }
    }, [all_role_instances, setupDetails.organization_id, dispatch]);

    //  user service selection after setup completes
    const handleUserServiceSelection = async () => {
        setLoadStatus(true);
        try {
            // Fetch main data in parallel
            const [orgResponse, serviceResponse, workspaceResponse, projectResponse] =
                await Promise.all([
                    fetchOrganizationData(),
                    getAllServiceData(),
                    getAllWorkspaceData(),
                    getAllProjectData(),
                ]);

            Promise.all([getRoleAssignmentDetails(), getRoleInstanceDetails()]);

            const filtered_organization = findItemById(orgResponse, setupDetails.organization_id);
            const filtered_service = findItemById(serviceResponse, setupDetails.service_id);
            const filtered_workspace = findItemById(workspaceResponse, setupDetails.workspace_id);
            const filtered_project = findItemById(projectResponse, setupDetails.project_id);

            setSelectedOrganization(filtered_organization);
            setSelectedService(filtered_service);
            setSelectedWorkspace(filtered_workspace);
            setSelectedProject(filtered_project);

        } catch (error) {
            console.error('Failed to load user service selection:', error);
        } finally {
            setLoadStatus(false);
        }
    };

    const handleNavigate = useCallback(() => {
        const hasAllDetails = REQUIRED_SETUP_FIELDS.every(
            field => setupDetails[field]
        );
        navigate(hasAllDetails ? '/document-types' : '/home');
    }, [setupDetails, navigate]);

    const isLoadingState = loading || pollLoading || setupLoading || loadStatus;
    const setupSuccessStatus = !isLoadingState && setupFinalStatus === 'completed';

    return (
        <Box sx={styles.mainContainer}>
            {isLoadingState && <LoadBar />}

            <Box sx={{ ...styles.setupCardContainer }}>

                <Box marginTop={'10px'}>
                    <Typography sx={{ fontSize: '24px', fontWeight: 600 }}>
                        Welcome to Ameya AI Cloud
                    </Typography>
                    <Typography sx={{ fontSize: '14px', fontWeight: 400, marginTop: '10px' }}>
                        Setting the stage... We're provisioning your workspace and services
                    </Typography>


                    <Box
                        sx={{
                            marginTop: '30px',
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: '15px',
                            alignItems: 'stretch'
                        }}
                    >
                        {serviceData.map((item, index) => (
                            <Box key={index}
                                sx={{
                                    position: 'relative', display: 'flex', flexDirection: 'column',
                                    cursor: 'pointer',
                                }}>
                                <Box
                                    component="span"
                                    sx={{
                                        position: 'absolute',
                                        top: '-12px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        backgroundColor: '#fff',
                                        padding: '0',
                                        zIndex: 1
                                    }}
                                >
                                    <Button sx={styles.serviceBtn}>
                                        <Typography sx={{ fontSize: '10px', fontWeight: '600' }}>
                                            {item.service_label}
                                        </Typography>
                                    </Button>
                                </Box>
                                <Box
                                    sx={{
                                        padding: '20px 15px',
                                        bgcolor: '#FFFFFF',
                                        borderRadius: '5px',
                                        border: '2px solid #DEDEDE',
                                        width: '330px',
                                        flexGrow: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        '&:hover': { border: '2px solid #0B51C5' }
                                    }}
                                >

                                    <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', marginTop: "15px" }}>
                                        <ReactSVG
                                            src={{
                                                analytics_tool: IconSvg.analysisIcon,
                                                extraction_agent: IconSvg.extarctionIcon
                                            }[item.service_type] || IconSvg.filesIcon}
                                            beforeInjection={(svg) => {
                                                svg.setAttribute('style', 'width:48px; height:48px; display:block;');
                                            }}
                                        />
                                        <Typography sx={{ fontSize: '16px', fontWeight: '600', marginTop: '20px' }}>
                                            {item.service_name}
                                        </Typography>
                                    </Box>

                                    <Box marginTop={'15px'}>

                                        {item.status_data.map((stats, stats_index) => (
                                            <Box key={stats_index} sx={{ display: 'flex', gap: '20px', alignItems: 'center', margin: '5px 0px' }}>
                                                <ReactSVG
                                                    src={
                                                        STATUS_ICONS?.[stats.type]?.[stats.status] ||
                                                        IconSvg.filesIcon
                                                    }
                                                    beforeInjection={(svg) => {
                                                        svg.setAttribute('style', 'width:24px; height:24px; display:block;');
                                                    }}
                                                />

                                                <Typography sx={{ fontSize: '14px', fontWeight: '400' }}>
                                                    {stats.label}
                                                </Typography>
                                            </Box>
                                        ))}

                                    </Box>

                                </Box>
                            </Box>))
                        }
                    </Box>

                    {setupSuccessStatus && (
                        <>
                            <Typography sx={{ fontSize: '14px', fontWeight: 700, marginTop: '20px' }} >
                                Thanks for your patience. Your intelligence ecosystem is ready.
                            </Typography>
                            <Button sx={styles.navigateButton} onClick={handleNavigate}>
                                Go to Ameya Extract console
                            </Button>
                        </>
                    )}

                </Box>
            </Box>
        </Box >
    );
}

export default UserSetup;