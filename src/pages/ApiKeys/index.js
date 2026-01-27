import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ReactSVG } from "react-svg";
import { useIntl } from 'react-intl';
import messages from './messages';

import { useTheme } from '@mui/material/styles';
import { Box, Button, Typography, Modal, Tooltip, FormLabel, FormControl, Breadcrumbs, Link, Stack } from '@mui/material';
import { getMainStyles } from '../../styles/styles';
import { getStyles } from './styles';
import { buttonStyles } from '../../styles/buttonStyles';
import { IconSvg } from '../../utils/globalIcons';

import getAgentAPiTokenData from '../../utils/ApiFunctions/AgentAPiTokenData';
import { setAgentApiTokenState, setUserRoleState } from "../../Redux/slice/dataSlice";
import { setAgentApiTokenAdded } from "../../Redux/slice/newDataSlice";
import LoadBar from '../../utils/LoadBar';
import AgentApiToken from '../../Api/Services/AppflyteBackend/AgentApiToken';
import { tostAlert } from '../../utils/AlertToast';
import { ContentCopy, ContentCopyOutlined, NavigateNextRounded } from '@mui/icons-material';
import GeneralTable from '../../components/GeneralTable';
import moment from 'moment';
import { useAppContext } from '../../context/AppContext';
import getUserRoles from '../../utils/ApiFunctions/UserRoles';
import { getUserRoleId } from '../../utils/AgentApiToken/TokenUtilityService';
import OwnPermissions from '../../containers/Settings/APIKeys/OwnPermissions';
import { breadCrumbsStyles } from '../../styles/breadCrumbs';
import { fetchUserId, getUserName } from '../../utils/GetAccountDetails';
import { apiErrorHandler } from '../../utils/ApiErrorHandler';

function ApiKeys() {
    const theme = useTheme();
    const styles = getStyles(theme);
    const intl = useIntl();
    const mainStyles = getMainStyles(theme);
    const { selectedOrganization } = useAppContext();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false)
    const [dataLoading, setDataLoading] = useState(false);
    const [allTokens, setAllTokens] = useState([]);
    const [copiedTokenId, setCopiedTokenId] = useState(null);
    const [mode, setMode] = useState('view')
    const [userRole, setUserRole] = useState(null)
    const [tokenPermissions, setTokenPermissions] = useState([]);
    const [permissionType, setPermissionType] = useState('all')

    const [tokenName, setTokenName] = useState('');
    const [tokenExpireTime, setTokenExpireTime] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    const appflyteEventTypes = []
    const appflyteFunctions = []
    const appflyteEngines = []


    // Handling delete
    const deleteDetails = { item_id: '', modalstatus: false };
    const [deleteData, setDeleteData] = useState(deleteDetails);

    const all_agent_api_tokens = useSelector(state => state.all_data.agent_api_tokens)
    const agent_api_token_added = useSelector(state => state.data_added.agent_api_token_added)
    const user_roles = useSelector(state => state.all_data.user_roles);

    useEffect(() => {
        getAllData()
        // eslint-disable-next-line
    }, [agent_api_token_added])

    const getAllData = async () => {
        setLoading(true)
        try {
            const [userRoleResponse] = await Promise.all([
                getAllUserRoles(),
                getAllTokensDetails()
            ])

            if (userRoleResponse) {
                const userRoleId = await getUserRoleId(userRoleResponse, 'Admin')
                setUserRole(userRoleId)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const getAllUserRoles = async () => {
        if (user_roles?.length > 0) {
            return user_roles
        }
        const response = await getUserRoles()
        dispatch(setUserRoleState(response))
        return response
    }

    const getAllTokensDetails = async () => {
        setLoading(true)
        let all_tokens = []
        try {
            if (all_agent_api_tokens?.length > 0 && agent_api_token_added === false) {
                all_tokens = all_agent_api_tokens
            } else {
                const response = await getAgentAPiTokenData();
                all_tokens = response
                dispatch(setAgentApiTokenState(response))
                dispatch(setAgentApiTokenAdded(false))
            }
            const filtered_tokens = (all_tokens || []).filter(token => token?.payload?.organization_id === selectedOrganization?.payload?.__auto_id__ && token?.payload?.token_type === "agent_api_org_token") ?? [];
            setAllTokens(filtered_tokens)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }


    const columns = [
        {
            id: 'payload.name',
            label: 'Name',
            sortable: true,
            renderCell: (row) => (
                <Box display={'flex'} alignItems={'center'}>
                    <Tooltip
                        title={copiedTokenId === row.payload.__auto_id__ ? 'Copied!' : ''}
                        arrow
                    >
                        <Box
                            marginRight={'8px'}
                            onClick={() => handleTokenCopy(row.payload.__auto_id__)}
                            sx={{
                                cursor: 'pointer',
                                color: copiedTokenId === row.payload.__auto_id__ ? '#0B51C5' : 'inherit',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            {copiedTokenId === row.payload.__auto_id__ ? (
                                <ContentCopy fontSize="14px" />
                            ) : (
                                <ContentCopyOutlined fontSize="14px" />
                            )}
                        </Box>
                    </Tooltip>
                    {row?.payload?.name}
                </Box>
            ),
        },
        {
            id: 'payload.created_on',
            label: 'Created On',
            sortable: true,
            renderCell: (row) => moment(row?.payload?.created_on)?.format('DD-MMM-YYYY hh:mm A')

        },
        {
            id: 'payload.last_used',
            label: 'Last Used',
            sortable: true,
            renderCell: (row) => moment(row?.payload?.last_used)?.format('DD-MMM-YYYY hh:mm A')

        },
        {

            id: 'payload.owned_by',
            label: 'Owned By',
            sortable: true,
            renderCell: (row) => (
                <Tooltip
                    title={
                        <Box p={1}>
                            <Typography sx={{ ...styles.paraText }}>{row?.payload?.owned_by}</Typography>
                        </Box>
                    }
                    arrow
                >
                    <Box
                        component="span"
                        sx={{
                            display: 'block',
                            maxWidth: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {row?.payload?.owned_by}
                    </Box>
                </Tooltip>
            )
        },
        {
            id: 'payload.permissions',
            label: 'Permissions',
            sortable: true,
            renderCell: (row) => "*"
        },
        {
            id: '',
            label: '',
            sortable: false,
            renderCell: (row) => (
                <Box display={'flex'} alignItems={'center'}>
                    <span
                        style={{ marginLeft: '20px' }}
                        className='delete_icon'
                        onClick={() => handleDeleteAlertModalOpen(row?.payload?.__auto_id__)}
                    >
                        <ReactSVG src={IconSvg.deleteIcon} className='delete_icon' />
                    </span>
                </Box>
            ),
        },
    ];

    const handleNewKey = () => {
        setMode('create')
    }

    const handleTokenCopy = (itemId, itemName) => {
        if (itemId) {
            navigator.clipboard.writeText(itemId).then(() => {
                setCopiedTokenId(itemId);
                setTimeout(() => setCopiedTokenId(null), 2000);
            });
        }
    };

    const handleDeleteAlertModalOpen = (item_id) => {
        setDeleteData({ ...deleteData, modalstatus: true, item_id: item_id });
    }

    const handleDeleteAlertModalClose = () => {
        setDeleteData(deleteDetails);
    }

    const handleTokenDelete = async () => {
        setLoading(true)
        try {
            setDeleteData({ ...deleteData, modalstatus: false })
            const response = await AgentApiToken.deleteToken(deleteData.item_id)
            if (response.status === 200) {
                tostAlert(intl.formatMessage(messages.delete_success), 'success');
                dispatch(setAgentApiTokenAdded(true))
                return
            }
            tostAlert(intl.formatMessage(messages.delete_error), 'error');
        } catch (error) {
            console.log(error)
        } finally {
            setDeleteData(deleteDetails);
            setLoading(false)
        }
    }

    const handleCreateNewKey = async () => {
        setLoading(true)
        try {
            const errors = {};
            if (!tokenName.trim()) { errors.tokenName = 'Token name is required' }
            if (!tokenExpireTime) { errors.tokenExpireTime = 'Token Expiry Date is required' }
            if (Object.keys(errors).length === 0) {
                const userName = await getUserName();
                const userId = await fetchUserId();
                const reqObj = {
                    organization_id: selectedOrganization?.payload?.__auto_id__,
                    user_id: userId,
                    user_role: userRole,
                    name: tokenName,
                    owned_by: userName,
                    exp: tokenExpireTime
                }
                const response = await AgentApiToken.createAgentApiOrgToken(JSON.stringify(reqObj))
                if (response.status === 200) {
                    dispatch(setAgentApiTokenAdded(true))
                    tostAlert(intl.formatMessage(messages.add_success), 'success');
                    setMode('view')
                    return
                }
                tostAlert(intl.formatMessage(messages.add_error), 'error')
            }
            else {
                setFormErrors(errors);
            }
        } catch (error) {
            apiErrorHandler(error)
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const breadcrumbs = [
        <Link underline="hover" key="1" color="inherit"
            onClick={() => setMode('view')}
            sx={breadCrumbsStyles.linkHeader}>
            <Typography sx={styles.linkText}>API Keys</Typography>
        </Link>,
        <Typography key="1" sx={styles.mainHeadingText}>New Key</Typography>,
    ];

    return (
        <Box sx={styles.mainContainer}>
            <Box sx={styles.cardContainer}>
                {loading && <LoadBar />}


                <Box padding={'20px'}>

                    {mode === "view" ? (<Box>
                        <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                            <Typography sx={styles.mainHeadingText}>Organization API Keys</Typography>

                            <Box display={'flex'} alignItems={'center'}>
                                <Button
                                    sx={{ ...buttonStyles.primaryBtn, width: '180px' }}
                                    onClick={() => handleNewKey()}
                                >
                                    <Typography sx={styles.btnText}>CREATE NEW KEY</Typography>
                                </Button>
                            </Box>

                        </Box>

                        <Typography sx={{ ...styles.paraText, marginTop: '10px' }}>
                            This API key is tied to your user and can make requests against this project.
                        </Typography>

                        <Box marginTop={'10px'} paddingBottom={'20px'}>
                            <GeneralTable
                                data={allTokens}
                                columns={columns}
                                loading={loading}
                            />
                        </Box>
                    </Box>)
                        :
                        (<Box>

                            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>

                                <Stack spacing={2} sx={{ marginLeft: '0' }}>
                                    <Breadcrumbs
                                        separator={<NavigateNextRounded fontSize="small" />}
                                        aria-label="breadcrumb"
                                    >
                                        {breadcrumbs}
                                    </Breadcrumbs>
                                </Stack>

                                <Box display={'flex'} alignItems={'center'}>
                                    <Button
                                        sx={{ ...buttonStyles.primaryBtn, width: '100px' }}
                                        disabled={loading || dataLoading}
                                        onClick={() => handleCreateNewKey()}
                                    >
                                        <Typography sx={styles.btnText}>SAVE</Typography>
                                    </Button>
                                    <Button
                                        sx={{ ...buttonStyles.secondaryBtn, width: '100px', marginLeft: '10px' }}
                                        onClick={() => navigate('/settings/api_keys')}
                                    >
                                        <Typography sx={styles.btnText}>CANCEL</Typography>
                                    </Button>
                                </Box>
                            </Box>

                            <Box sx={{ marginTop: '30px' }}>

                                <OwnPermissions
                                    setDataLoading={setDataLoading}
                                    loading={loading}
                                    dataLoading={dataLoading}
                                    setTokenName={setTokenName}
                                    setTokenExpireTime={setTokenExpireTime}
                                    tokenName={tokenName}
                                    appflyteEventTypes={appflyteEventTypes}
                                    appflyteFunctions={appflyteFunctions}
                                    appflyteEngines={appflyteEngines}
                                    setTokenPermissions={setTokenPermissions}
                                    setPermissionType={setPermissionType}
                                    formErrors={formErrors}
                                />
                            </Box>
                        </Box>)
                    }



                    <Modal open={deleteData.modalstatus} onClose={handleDeleteAlertModalClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                        <Box sx={mainStyles.modalcontainer}>
                            <Box sx={mainStyles.mainWarning}>Are you sure you want to delete this token?</Box>
                            <Box sx={mainStyles.subWarning}>Any applications or scripts using this token will no longer be able to access
                                the Ameya API. You cannot undo this action.
                            </Box>
                            <Box style={mainStyles.confirmButtonGroup}>
                                <Button onClick={handleDeleteAlertModalClose} sx={{ ...mainStyles.cancelDelete, textTransform: 'none' }}>
                                    <Typography sx={styles.btnText}>Cancel</Typography>
                                </Button>
                                <Button onClick={() => { handleTokenDelete() }} sx={{ ...mainStyles.confirmDelete, textTransform: 'none', width: '250px' }}>
                                    <Typography sx={styles.btnText}> I understand, delete this token</Typography>
                                </Button>
                            </Box>
                        </Box>
                    </Modal>
                </Box>
            </Box>
        </Box>
    )
}

export default ApiKeys