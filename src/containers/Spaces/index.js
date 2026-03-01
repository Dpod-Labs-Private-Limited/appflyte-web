import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { getStyles } from './styles';

import { Box, Button, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import { getMainStyles } from '../../styles/styles';
import {
    setProjectAccessState, setRoleAssignmentState,
    setRoleInstanceState, setSpacesState, setWorkspaceAccessState
} from "../../Redux/slice/dataSlice";

import LoadBar from '../../utils/LoadBar';
import getSpaceData from '../../utils/ApiFunctions/SpaceData';
import { setWorkspaceAdded } from '../../Redux/slice/newDataSlice';
import { MoreVert } from '@mui/icons-material';
import { ReactSVG } from 'react-svg';
import { IconSvg } from '../../utils/globalIcons';
import { getAllRoleAssignmentData, getAllRoleInstanceData } from '../../utils/ApiFunctions/AccessControlData';
import { getUserItemId } from '../../utils/GetAccountDetails';
import { useAppContext } from '../../context/AppContext';
// import { AppflyteWorkspacePermissions } from '../../utils/ApiFunctions/AppflytePermissionsData';

function Spaces() {
    const theme = useTheme();
    const styles = getStyles(theme);
    const mainStyles = getMainStyles(theme);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { selectedOrganization, selectedService, setSelectedWorkspace,
        setSelectedProject, setPermissionStatus, isOrganizationOwner, authData } = useAppContext();

    const all_spaces = useSelector(state => state.all_data.spaces);
    const workspace_added = useSelector(state => state.data_added.workspace_added);
    const all_role_assignments = useSelector(state => state.all_data.role_assignments);
    const all_role_instances = useSelector(state => state.all_data.role_instances);

    const [spaces, setSpaces] = useState([]);
    const [spaceLoading, setSpaceLoading] = useState(false);
    const [settingsMenu, setSettingsMenu] = useState(null);
    const [activeSpaceId, setActiveSpaceId] = useState(null);
    const selected_space_settings = {
        'workspace_id': '',
        'workspace_name': '',
        'workspace_description': '',
        'workspace_update_key': '',
        'workspace_view': false
    }
    const [selectedSpaceData, setSelectedSpaceData] = useState(selected_space_settings);
    const validTypes = ["ext_user_singin", "ext_existing_user", "ext_user_signup"];

    useEffect(() => {
        getAllData()
        //eslint-disable-next-line
    }, [navigate, selectedService])

    const getAllData = async () => {
        setSpaceLoading(true)
        try {
            // const [spaceResponse, roleInstanceResponse, roleAssignmentResponse] = await Promise.all([
            //     getSpaceDetails(),
            //     getRoleInstanceDetails(),
            //     getRoleAssignmentDetails()
            // ])
            // if (spaceResponse && roleInstanceResponse && roleAssignmentResponse) {
            //     // const appflyte_workspaces = await AppflyteWorkspacePermissions(spaceResponse, roleInstanceResponse, roleAssignmentResponse, isOrganizationOwner);
            //     setSpaces(spaceResponse)
            // }

            const spaceResponse = await getSpaceDetails()
            if (spaceResponse) {
                setSpaces(spaceResponse)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setSpaceLoading(false)
        }
    }

    const getSpaceDetails = async () => {
        try {
            let space_data = []
            if (all_spaces?.length > 0 && workspace_added === false) {
                space_data = all_spaces
            } else {
                const organization_id = selectedOrganization?.payload?.__auto_id__ ?? null;
                const response = await getSpaceData(organization_id);
                dispatch(setSpacesState(response))
                dispatch(setWorkspaceAdded(false))
                space_data = response
            }
            const service_id = selectedService?.payload?.__auto_id__ ?? null;
            const filtred_workspaces = (space_data || [])?.length > 0 ? space_data?.filter(item => (item?.payload?.service || [])?.includes(service_id)) : [];
            return filtred_workspaces;
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

    const handleSpaceSelection = async (item) => {
        setSelectedWorkspace(item)
        const current_space_id = item?.payload?.__auto_id__ ?? null;
        const organization_id = selectedOrganization?.payload?.__auto_id__ ?? null;
        navigate(`/organization/${organization_id}/workspace/${current_space_id}/projects`)
    }

    const handleSpaceCreation = async () => {
        const organization_id = selectedOrganization?.payload?.__auto_id__ ?? null;
        navigate(`/organization/${organization_id}/workspaces/add-space`)
    }

    const handleSpaceSettingsSelection = (event, space) => {
        setSelectedSpaceData({
            ...selectedSpaceData,
            workspace_id: space?.payload?.__auto_id__,
            workspace_name: space?.payload?.name,
            workspace_description: space?.payload?.description,
            workspace_update_key: space?.update_key,
            workspace_view: true
        })
        setSettingsMenu(event.currentTarget);
        setActiveSpaceId(space?.payload?.__auto_id__);
    }

    const handleSpaceSettings = async () => {
        const organization_id = selectedOrganization?.payload?.__auto_id__ ?? null
        navigate(`/organization/${organization_id}/workspaces/edit-space`, {
            state: {
                selected_space_id: selectedSpaceData.workspace_id,
                selected_space_name: selectedSpaceData.workspace_name,
                selected_space_description: selectedSpaceData.workspace_description,
                selected_space_update_key: selectedSpaceData.workspace_update_key
            }
        })
    }

    const handlePermissionSettings = async () => {
        dispatch(setProjectAccessState({}))
        setPermissionStatus(true)
        dispatch(setWorkspaceAccessState(selectedSpaceData))
        setSelectedWorkspace(null)
        setSelectedProject(null)
        navigate('/user/settings')
    }

    return (
        <div style={styles.mainContainer}>
            <Box sx={{ ...styles.cardContainer }}>
                {spaceLoading && <LoadBar />}
                <Box padding={'20px'}>

                    {(isOrganizationOwner && !validTypes.includes(authData?.request_type)) && <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                        <Typography sx={styles.mainHeadingText}>All Spaces</Typography>
                        <Button
                            sx={styles.addBtn}
                            onClick={() => handleSpaceCreation()}
                        >
                            <Typography sx={styles.btnText}>New Space</Typography>
                        </Button>
                    </Box>
                    }

                    <Box sx={styles.spaceCardContainer}>
                        {(spaces || []) && spaces?.length > 0 &&
                            spaces?.map((space, index) => (
                                <Button
                                    variant='text'
                                    disableRipple
                                    key={index}
                                    sx={styles.spaceCard}
                                    onClick={() => handleSpaceSelection(space)}
                                >
                                    <Box sx={{ padding: '10px', flexGrow: 1 }}>

                                        <Box sx={{
                                            padding: '10px 20px 10px 20px',
                                            color: theme.palette.text.primary,
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        }}>
                                            <Tooltip
                                                title={space?.payload?.name || ''}
                                                arrow
                                                placement="top"
                                                disableHoverListener={!space?.payload?.name || space?.payload?.name?.length <= 30}
                                            >
                                                <Typography sx={styles.spaceHeadingText}>{space?.payload?.name}</Typography>
                                            </Tooltip>
                                            <IconButton
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    handleSpaceSettingsSelection(event, space)
                                                }}
                                                sx={{
                                                    borderRadius: 1,
                                                    backgroundColor: activeSpaceId === space?.payload?.__auto_id__ ? 'rgba(0,0,0,0.08)' : 'transparent',
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
                                                title={space?.payload?.description || ''}
                                                arrow
                                                placement="bottom"
                                                disableHoverListener={!space?.payload?.description || space?.payload?.description?.length <= 100}
                                            >
                                                <Typography sx={styles.spaceDescriptionText}>
                                                    {space?.payload?.description}
                                                </Typography>
                                            </Tooltip>
                                        </Box>

                                    </Box>
                                </Button>
                            ))
                        }
                    </Box>

                    {(spaces?.length === 0 && !spaceLoading) && (
                        <Box sx={{ ...mainStyles.noRecord, marginTop: '100px' }}>
                            <Typography sx={styles.noRecordsText}>No Records To Display</Typography>
                        </Box>
                    )}

                    <Menu
                        anchorEl={settingsMenu}
                        open={Boolean(settingsMenu)}
                        onClose={() => { setSettingsMenu(null); setActiveSpaceId(null) }}
                        anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'center', horizontal: 'left' }}
                        sx={{ ml: 1 }}
                    >
                        <MenuItem
                            sx={{ display: 'flex', alignItems: 'center' }}
                            onClick={handleSpaceSettings}
                        >
                            <ReactSVG
                                src={IconSvg.editIcon}
                                beforeInjection={(svg) => {
                                    svg.setAttribute('style', 'width:14px; height:14px; display:block;');
                                    svg.setAttribute('stroke', '#000000');
                                }}
                            />
                            <Typography sx={{ marginLeft: '10px', fontSize: '14px', fontWeight: '400' }}>Space Settings</Typography>
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

export default Spaces;