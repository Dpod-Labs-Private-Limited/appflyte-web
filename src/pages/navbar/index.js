import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { useTheme } from '@mui/material/styles';
import { Box, Typography, MenuItem, Select, Menu, Chip, Avatar, Button, Popover, IconButton, Tooltip } from '@mui/material';
import "./styles.css"
import { ArrowDropDown } from '@mui/icons-material';

import {
    setSpacesState, setProjectsState, setWorkspaceAccessState, setProjectAccessState,
    setAgentApiTokenState, setCostUsageState, setRoleInstanceState, setStripeTransactionsState,
} from "../../Redux/slice/dataSlice";
import { setProjectAdded, setWorkspaceAdded } from '../../Redux/slice/newDataSlice';
import { handleSidebarConfig } from "../../utils/SidebarConfig";

import appflyte_logo from "../../images/appflyte_logo.svg"
import { fontStyles } from '../../styles/fontStyles';
import { fetchOwnerByOrganization, getUserInitials, getUserName } from '../../utils/GetAccountDetails';
import { useAppContext } from '../../context/AppContext';
import { IconSvg } from '../../utils/globalIcons';
import { ReactSVG } from 'react-svg';
import { getStyles } from './styles';

function Navbar() {
    const theme = useTheme();
    const styles = getStyles(theme)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { setSelectedOrganization, setSelectedService, setSelectedWorkspace, setSelectedProject, setPermissionStatus, setBillingStatus,
        selectedOrganization, selectedService, selectedWorkspace, selectedProject, setIsOrganizationOwner, setAuthData } = useAppContext();

    const all_organizations = useSelector(state => state.all_data.organizations);
    const all_services = useSelector(state => state.all_data.services);
    const all_spaces = useSelector(state => state.all_data.spaces);
    const all_projects = useSelector(state => state.all_data.projects);

    const [organizationMenu, setOrganizationMenu] = useState("");
    const [spacesmenu, setSpacesMenu] = useState("");
    const [projectsmenu, setProjectsMenu] = useState("");
    const [logoutmenu, setLogoutMenu] = useState(null);

    const [spaceData, setSpaceData] = useState([])
    const [projectData, setProjectData] = useState([])

    useEffect(() => {
        fetchOwner()
        //eslint-disable-next-line
    }, [selectedOrganization])

    const fetchOwner = async () => {
        const organization_id = selectedOrganization?.payload?.__auto_id__ ?? null;
        const is_owner = await fetchOwnerByOrganization(organization_id)
        setIsOrganizationOwner(is_owner)
    }

    useEffect(() => {
        const service_id = selectedService?.payload?.__auto_id__ ?? null;
        const workspace_id = selectedWorkspace?.payload?.__auto_id__ ?? null;

        let filtered_workspaces = (all_spaces || [])?.filter(item => item?.payload?.service?.includes(service_id)) ?? [];
        if (selectedWorkspace && !filtered_workspaces.some(ws => ws.payload.__auto_id__ === selectedWorkspace.payload.__auto_id__)) {
            filtered_workspaces = [...filtered_workspaces, selectedWorkspace];
        }
        setSpaceData(filtered_workspaces);

        let filtered_projects = (all_projects || [])?.filter(item => item?.payload?.service?.includes(service_id) && item?.payload?.workspace?.includes(workspace_id)) ?? [];

        if (selectedProject && !filtered_projects.some(pj => pj.payload.__auto_id__ === selectedProject.payload.__auto_id__)) {
            filtered_projects = [...filtered_projects, selectedProject];
        }
        setProjectData(filtered_projects);

    }, [selectedService, selectedWorkspace, selectedProject, all_spaces, all_projects]);

    useEffect(() => {
        dispatch(setAgentApiTokenState([]))
        //eslint-disable-next-line
    }, [selectedProject, selectedWorkspace])

    useEffect(() => {
        dispatch(setStripeTransactionsState([]))
        dispatch(setRoleInstanceState([]))
        dispatch(setCostUsageState([]))
        //eslint-disable-next-line
    }, [selectedOrganization])

    const handleClick = (event) => {
        setLogoutMenu(event.currentTarget)
    }

    const handleClose = () => {
        setLogoutMenu(null)
    }

    const handleLogout = () => {
        localStorage.clear()
        sessionStorage.clear()
        window.location.href = "/login";
    };

    const handleOrganizationChange = async (organization_selected, organization_data) => {
        if (organization_selected === "*") {
            setSelectedOrganization(null)
            setSelectedWorkspace(null)
            setSelectedProject(null)
            setOrganizationMenu(null)
            navigate("/organizations")
            return
        }
        const selected_organization = organization_data?.length > 0 ? organization_data?.find(organization => organization?.payload?.name === organization_selected) : null;
        if (selected_organization) {

            setOrganizationMenu(organization_selected);
            setSpacesMenu("")
            setProjectsMenu("")

            setSelectedWorkspace(null)
            setSelectedProject(null)

            dispatch(setSpacesState([]))
            dispatch(setProjectsState([]))
            dispatch(setWorkspaceAdded(true))
            dispatch(setProjectAdded(true))
            setSelectedOrganization(selected_organization)

            const organization_id = selected_organization?.payload?.__auto_id__ ?? null;
            const selected_service = all_services.find((s) => s?.payload?.organization_id?.includes(organization_id)) ?? null;
            setSelectedService(selected_service)
            navigate(`/organization/${organization_id}/workspaces`)
        }
        return
    }

    const handleSpaceChange = async (space_selected, space_data) => {
        const organization_id = selectedOrganization?.payload?.__auto_id__ ?? null;
        if (space_selected === "*") {
            setSelectedWorkspace(null)
            setSelectedProject(null)
            setSpacesMenu("")
            navigate(`/organization/${organization_id}/workspaces`)
            return
        }
        const selectedSpace = space_data?.length > 0 ? space_data?.filter(space => space?.payload?.name === space_selected)?.[0] : null;
        if (selectedSpace) {
            setSpacesMenu(space_selected);
            setSelectedWorkspace(selectedSpace)
            setSelectedProject(null)
            navigate(`/organization/${organization_id}/workspace/${selectedSpace?.payload?.__auto_id__}/projects`)
        }
        return
    }

    const handleProjectChange = async (project_selected, project_data) => {
        const organization_id = selectedOrganization?.payload?.__auto_id__ ?? null;
        if (project_selected === "*") {
            setSelectedProject(null)
            setProjectsMenu("");
            navigate(`/organization/${organization_id}/workspace/${selectedWorkspace?.payload?.__auto_id__}/projects`)
            return
        }
        const selectedProject = project_data?.length > 0 ? project_data?.filter(project => project?.payload?.name === project_selected)?.[0] : null;
        if (selectedProject) {
            setProjectsMenu(project_selected);
            setSelectedProject(selectedProject)
            handleSidebarConfig(selectedWorkspace, selectedProject, navigate)
        }
        return
    }

    const handleHomeNavigation = () => {
        dispatch(setWorkspaceAccessState({}))
        dispatch(setProjectAccessState({}))
        setSelectedOrganization(null)
        setSelectedService(null)
        setSelectedWorkspace(null)
        setSelectedProject(null)
        setAuthData(null)
        setPermissionStatus(false)
        setBillingStatus(false)
        navigate("/")
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <nav style={styles.navbar}>
                <Box sx={styles.navLeftContent}>
                    <Box>
                        <Link
                            to="/"
                            onClick={() => handleHomeNavigation()}
                        >
                            <img src={appflyte_logo} alt="appflyte logo" style={{ ...styles.navbarBrand }} />
                        </Link>
                    </Box>

                    {(selectedOrganization !== null && (all_organizations || [])?.length > 1) &&
                        (<Box sx={{ marginLeft: '10px', display: 'flex', alignItems: 'center' }}>
                            <Select
                                size='small'
                                sx={{
                                    border: 'none',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        border: 'none',
                                    },
                                }}
                                value={organizationMenu || selectedOrganization?.payload?.name}
                                onChange={(e) => handleOrganizationChange(e.target.value, all_organizations)}
                            >
                                <MenuItem value="*">
                                    <Typography variant='body1'>All Organizations</Typography>
                                </MenuItem>
                                {all_organizations.map((item, index) => {
                                    const name = item?.payload?.name;
                                    return (
                                        <MenuItem key={index} value={name}>
                                            <Tooltip title={name} arrow placement="right">
                                                <Typography
                                                    variant="body1"
                                                    sx={{ maxWidth: 160, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                                >
                                                    {name}
                                                </Typography>
                                            </Tooltip>
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </Box>)
                    }

                    {(selectedOrganization !== null && selectedWorkspace !== null && (spaceData || [])?.length > 0) &&
                        (<Box sx={{ marginLeft: '10px', display: 'flex', alignItems: 'center' }}>
                            <Select
                                size='small'
                                sx={{
                                    border: 'none',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        border: 'none',
                                    },
                                }}
                                value={spacesmenu || selectedWorkspace?.payload?.name}
                                onChange={(e) => handleSpaceChange(e.target.value, spaceData)}
                            >
                                <MenuItem value="*">
                                    <Typography variant='body1'>All Spaces</Typography>
                                </MenuItem>
                                {spaceData.map((item, index) => {
                                    const name = item?.payload?.name;
                                    return (
                                        <MenuItem key={index} value={name}>
                                            <Tooltip title={name} arrow placement="right">
                                                <Typography
                                                    variant="body1"
                                                    sx={{ maxWidth: 160, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                                >
                                                    {name}
                                                </Typography>
                                            </Tooltip>
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </Box>)
                    }

                    {(selectedOrganization !== null && selectedWorkspace !== null && selectedProject !== null && (projectData || [])?.length > 0) &&
                        (<Box sx={{ marginLeft: '5px', display: 'flex', alignItems: 'center' }}>
                            <Select
                                size='small'
                                sx={{
                                    border: 'none',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        border: 'none',
                                    },
                                }}
                                value={projectsmenu || selectedProject?.payload?.name}
                                onChange={(e) => handleProjectChange(e.target.value, projectData)}
                            >
                                <MenuItem value="*">
                                    <Typography variant='body1'>All Projects</Typography>
                                </MenuItem>
                                {projectData.map((item, index) => {
                                    const name = item?.payload?.name;
                                    return (
                                        <MenuItem key={index} value={name}>
                                            <Tooltip title={name} arrow placement="right">
                                                <Typography
                                                    variant="body1"
                                                    sx={{ maxWidth: 160, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                                >
                                                    {name}
                                                </Typography>
                                            </Tooltip>
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </Box>)
                    }
                </Box>

                <Box sx={styles.navRightContent}>
                    <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', alignSelf: 'center' }}>

                        <Box marginLeft={'5px'}>
                            <Chip
                                avatar={
                                    <Avatar sx={{ bgcolor: '#000000', height: '32px', width: '32px' }}>
                                        <Typography
                                            sx={{ ...fontStyles.smallText, color: '#ffffff', padding: '2px' }}
                                            onClick={handleClick}
                                        >
                                            {getUserInitials()}
                                        </Typography>
                                    </Avatar>
                                }
                                label={<div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography sx={fontStyles.mediumText}>
                                        {getUserName()}
                                    </Typography>
                                    <ArrowDropDown
                                        sx={{ cursor: 'pointer', ml: 1 }}
                                        onClick={handleClick}
                                    />
                                </div>}
                                sx={{
                                    padding: '8px 7px',
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: '20px',
                                }}
                            />

                            <Box>
                                <Menu
                                    anchorEl={logoutmenu}
                                    open={logoutmenu}
                                    onClose={handleClose}
                                    sx={{ mt: 3 }}
                                >
                                    <MenuItem
                                        onClick={() => handleLogout()}
                                        sx={{ ...fontStyles.smallText, dispaly: 'flex', alignItems: 'center', gap: '10px' }}
                                    >
                                        <ReactSVG
                                            src={IconSvg.logoutIcon}
                                            beforeInjection={(svg) => {
                                                svg.setAttribute('style', 'width:18px; height:18px; display:block;');
                                                svg.setAttribute('stroke', '#000000');
                                            }}
                                        />
                                        <Typography sx={{ fontSize: '14px', fontWeight: '400' }}>Logout&nbsp;</Typography>
                                    </MenuItem>
                                </Menu>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </nav>

        </Box>
    )
}

export default Navbar