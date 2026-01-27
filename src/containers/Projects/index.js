import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { useTheme } from '@mui/material/styles';
import { Box, Button, Typography, Link, Stack, Breadcrumbs, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { MoreVert, NavigateNextRounded } from '@mui/icons-material';

import { getStyles } from './styles';
import { getMainStyles } from '../../styles/styles';
import { breadCrumbsStyles } from '../../styles/breadCrumbs';

import { setProjectAccessState, setProjectsState, setRoleAssignmentState, setRoleInstanceState, setSpacesState, setWorkspaceAccessState } from "../../Redux/slice/dataSlice";
import { setProjectAdded, setWorkspaceAdded } from '../../Redux/slice/newDataSlice';

import LoadBar from '../../utils/LoadBar';
import getSpaceData from '../../utils/ApiFunctions/SpaceData';
import { handleSidebarConfig } from '../../utils/SidebarConfig';
import getProjectData from '../../utils/ApiFunctions/ProjectData';
import { ReactSVG } from 'react-svg';
import { IconSvg } from '../../utils/globalIcons';
// import { AppflyteProjectPermissions } from '../../utils/ApiFunctions/AppflytePermissionsData';
import { getAllRoleAssignmentData, getAllRoleInstanceData } from '../../utils/ApiFunctions/AccessControlData';
import { useAppContext } from '../../context/AppContext';
import { getUserItemId } from '../../utils/GetAccountDetails';

function ViewProjects() {

    const theme = useTheme();
    const mainStyles = getMainStyles(theme);
    const styles = getStyles(theme);

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { selectedOrganization, setSelectedProject, setSelectedWorkspace,
        selectedWorkspace, setPermissionStatus, isOrganizationOwner, authData } = useAppContext();
    const [currentspace, setCurrentSpace] = useState(null)

    const all_projects = useSelector(state => state.all_data.projects)
    const all_spaces = useSelector(state => state.all_data.spaces)
    const project_added = useSelector(state => state.data_added.project_added)
    const workspace_added = useSelector(state => state.data_added.workspace_added)
    const all_role_assignments = useSelector(state => state.all_data.role_assignments);
    const all_role_instances = useSelector(state => state.all_data.role_instances);

    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(false);
    const [settingsMenu, setSettingsMenu] = useState(null);
    const [activeProjectId, setActiveProjectId] = useState(null);
    const selected_project_settings = {
        'workspace_id': '',
        'workspace_name': '',
        'project_id': '',
        'project_name': '',
        'project_description': '',
        'project_view': false,
        'project_update_key': ''
    }
    const [selectedProjectData, setSelectedProjectData] = useState(selected_project_settings);
    const validTypes = ["ext_user_singin", "ext_existing_user", "ext_user_signup"];

    useEffect(() => {
        getAllData()
        //eslint-disable-next-line
    }, [navigate])

    const getAllData = async () => {
        setLoading(true)
        try {
            const [spaceResponse, projectResponse, roleInstanceResponse, roleAssignmentResponse] = await Promise.all([
                getSpaceDetails(),
                getProjectDetails(),
                getRoleInstanceDetails(),
                getRoleAssignmentDetails()
            ])
            if (spaceResponse && projectResponse && roleInstanceResponse && roleAssignmentResponse) {
                // const appflyte_projects = await AppflyteProjectPermissions(projectResponse, roleInstanceResponse, roleAssignmentResponse, isOrganizationOwner);
                // const filtered_projects = appflyte_projects?.filter(project => project?.payload?.workspace?.includes(spaceResponse))
                const filtered_projects = projectResponse?.filter(project => project?.payload?.workspace?.includes(spaceResponse))
                setCurrentSpace(spaceResponse)
                setProjects(filtered_projects)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const getSpaceDetails = async () => {
        let response
        if (all_spaces?.length > 0 && workspace_added === false) {
            response = all_spaces
        } else {
            const organization_id = selectedOrganization?.payload?.__auto_id__ ?? null;
            response = await getSpaceData(organization_id)
            dispatch(setSpacesState(response))
            dispatch(setWorkspaceAdded(false))
        }
        const space_id = selectedWorkspace?.payload?.__auto_id__ ?? null;
        const filterd_space_id = response?.find(space => space?.payload?.__auto_id__ === space_id)?.payload?.__auto_id__ ?? null;
        return filterd_space_id
    }

    const getProjectDetails = async () => {
        try {
            if (all_projects?.length > 0 && project_added === false) {
                return all_projects
            }
            const organization_id = selectedOrganization?.payload?.__auto_id__ ?? null;
            const response = await getProjectData(organization_id)
            dispatch(setProjectsState(response))
            dispatch(setProjectAdded(false))
            return response
        } catch (error) {
            console.error(error);
            return []
        }
    }

    const getRoleAssignmentDetails = async () => {
        try {
            if (all_role_assignments?.length > 0) {
                return all_role_assignments
            }
            const user_id = await getUserItemId();
            const response = await getAllRoleAssignmentData(user_id)
            dispatch(setRoleAssignmentState(response))
            return response
        } catch (error) {
            console.error(error);
            return []
        }
    }

    const getRoleInstanceDetails = async () => {
        try {
            if (all_role_instances?.length > 0) {
                return all_role_instances
            }
            const organization_id = selectedOrganization?.payload?.__auto_id__ ?? null;
            const response = await getAllRoleInstanceData(organization_id)
            dispatch(setRoleInstanceState(response))
            return response
        } catch (error) {
            console.error(error);
            return []
        }
    }

    const handleProjectCreation = async () => {
        const organization_id = selectedOrganization?.payload?.__auto_id__ ?? null
        navigate(`/organization/${organization_id}/workspace/${currentspace}/projects/add-project`)
    }

    const handleProjectSelection = async (item) => {
        setSelectedProject(item)
        await handleSidebarConfig(item, navigate, authData)
    }

    const handleSpaceNavigation = () => {
        setSelectedWorkspace(null)
        const organization_id = selectedOrganization?.payload?.__auto_id__ ?? null;
        navigate(`/organization/${organization_id}/workspaces`)
    }

    const handleProjectSettingsSelection = (event, project) => {
        setSelectedProjectData({
            ...selectedProjectData,
            workspace_id: selectedWorkspace?.payload?.__auto_id__,
            workspace_name: selectedWorkspace?.payload?.name,
            project_id: project?.payload?.__auto_id__,
            project_name: project?.payload?.name,
            project_description: project?.payload?.description,
            project_update_key: project?.update_key,
            project_view: true
        })
        setSettingsMenu(event.currentTarget);
        setActiveProjectId(project?.__auto_id__);
    }

    const handleProjectSettings = async () => {
        const organization_id = selectedOrganization?.payload?.__auto_id__ ?? null
        navigate(`/organization/${organization_id}/workspace/${currentspace}/projects/edit-project`, {
            state: {
                selected_project_id: selectedProjectData.project_id,
                selected_project_name: selectedProjectData.project_name,
                selected_project_description: selectedProjectData.project_description,
                selected_project_update_key: selectedProjectData.project_update_key
            }
        })
    }

    const handlePermissionSettings = async () => {
        dispatch(setWorkspaceAccessState({}))
        setPermissionStatus(true)
        dispatch(setProjectAccessState(selectedProjectData))
        setSelectedProject(null)
        navigate('/user/settings')
    }

    const breadcrumbs = [
        <Link underline="hover" key="1" color="inherit"
            onClick={handleSpaceNavigation}
            sx={breadCrumbsStyles.linkHeader}>
            <Typography sx={styles.linkText}>All Spaces</Typography>
        </Link>,
        <Typography key="1" sx={styles.mainHeadingText}>
            {selectedWorkspace?.payload?.name}
        </Typography>,
    ];

    return (
        <div style={styles.mainContainer}>
            <Box sx={styles.cardContainer}>
                {loading && (<LoadBar />)}
                <Box padding={'20px'}>

                    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>

                        <Stack spacing={2} sx={{ marginLeft: '0' }}>
                            <Breadcrumbs
                                separator={<NavigateNextRounded fontSize="small" />}
                                aria-label="breadcrumb"
                            >
                                {breadcrumbs}
                            </Breadcrumbs>
                        </Stack>

                        {(isOrganizationOwner && !validTypes.includes(authData?.request_type)) && <Button
                            sx={styles.addBtn}
                            onClick={() => handleProjectCreation()}
                        >
                            <Typography sx={styles.btnText}>New Project</Typography>
                        </Button>
                        }
                    </Box>


                    <Box sx={styles.projectCardContainer}>
                        {(projects || []) && projects?.length > 0 &&
                            projects?.map((project, index) => (
                                <Button
                                    variant='text'
                                    disableRipple
                                    key={index}
                                    sx={styles.projectCard}
                                    onClick={() => handleProjectSelection(project)}
                                >
                                    <Box sx={{ padding: '10px', flexGrow: 1 }}>

                                        <Box sx={{
                                            padding: '10px 20px 10px 20px',
                                            color: theme.palette.text.primary,
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        }}>
                                            <Tooltip
                                                title={project?.payload?.name || ''}
                                                arrow
                                                placement="top"
                                                disableHoverListener={!project?.payload?.name || project?.payload?.name?.length <= 30}
                                            >
                                                <Typography sx={styles.projectHeadingText}>{project?.payload?.name}</Typography>
                                            </Tooltip>
                                            <IconButton
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    handleProjectSettingsSelection(event, project);
                                                }}
                                                sx={{
                                                    borderRadius: 1,
                                                    backgroundColor: activeProjectId === project?.payload?.__auto_id__ ? 'rgba(0,0,0,0.08)' : 'transparent',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(0,0,0,0.12)',
                                                    },
                                                }}
                                            >
                                                <MoreVert />
                                            </IconButton>
                                        </Box>

                                        <Box sx={{
                                            padding: '0px 20px 10px 20px',
                                            color: theme.palette.text.primary,
                                        }}>
                                            <Tooltip
                                                title={project?.payload?.description || ''}
                                                arrow
                                                placement="bottom"
                                                disableHoverListener={!project?.payload?.description || project?.payload?.description?.length <= 100}
                                            >
                                                <Typography sx={styles.projectDescriptionText}>
                                                    {project?.payload?.description}
                                                </Typography>
                                            </Tooltip>
                                        </Box>

                                    </Box>
                                </Button>
                            ))
                        }
                    </Box>

                    {(projects.length === 0 && !loading) && (
                        <Box sx={{ ...mainStyles.noRecord, marginTop: '100px' }}>
                            <Typography sx={styles.noRecordsText}>No Records To Display</Typography>
                        </Box>
                    )}

                    <Menu
                        anchorEl={settingsMenu}
                        open={settingsMenu}
                        onClose={() => { setSettingsMenu(null); setActiveProjectId(null) }}
                        anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'center', horizontal: 'left' }}
                        sx={{ ml: 1 }}
                    >
                        <MenuItem
                            sx={{ display: 'flex', alignItems: 'center' }}
                            onClick={handleProjectSettings}
                        >
                            <ReactSVG
                                src={IconSvg.editIcon}
                                beforeInjection={(svg) => {
                                    svg.setAttribute('style', 'width:14px; height:14px; display:block;');
                                    svg.setAttribute('stroke', '#000000');
                                }}
                            />
                            <Typography sx={{ marginLeft: '10px', fontSize: '14px', fontWeight: '400' }}>Project Settings</Typography>
                        </MenuItem>
                        <MenuItem
                            sx={{ display: 'flex', alignItems: 'center' }}
                            onClick={() => handlePermissionSettings()}
                        >
                            <ReactSVG
                                src={IconSvg.usersettingsIcon}
                                beforeInjection={(svg) => {
                                    svg.setAttribute('style', 'width:14px; height:14px; display:block;');
                                    svg.setAttribute('stroke', '#000000');
                                }}
                            />
                            <Typography sx={{ marginLeft: '10px', fontSize: '14px', fontWeight: '400' }}>Permissions</Typography>
                        </MenuItem>
                    </Menu>


                </Box>
            </Box>
        </div>
    )
}

export default ViewProjects;