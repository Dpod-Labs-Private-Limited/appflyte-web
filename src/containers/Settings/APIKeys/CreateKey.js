import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import messages from './messages';

import { useTheme } from '@mui/material/styles';
import {
    Box, Breadcrumbs, Button, FormControl, FormControlLabel, FormLabel,
    Link, Radio, RadioGroup, Stack, Typography
} from '@mui/material'
import { NavigateNextRounded } from '@mui/icons-material';

import { breadCrumbsStyles } from '../../../styles/breadCrumbs';
import { buttonStyles } from '../../../styles/buttonStyles';
import { getStyles } from './styles';

import OwnPermissions from './OwnPermissions';
// import ServiceAccountPermission from './ServiceAccountPermission';
import { fetchUserId, getUserName } from '../../../utils/GetAccountDetails';

import getAppflyteEventTypesData from '../../../utils/ApiFunctions/AppflyteEventTypes';
import getAppflyteFunctionsData from '../../../utils/ApiFunctions/AppflyteFunctions';
import getAppflyteEnginesData from '../../../utils/ApiFunctions/AppflyteEngines';

import { setAppflyteEngineState, setAppflyteFunctionState, setAppflyteEventTypesState, setUserRoleState } from "../../../Redux/slice/dataSlice";
import { setAgentApiTokenAdded } from "../../../Redux/slice/newDataSlice";
import LoadBar from '../../../utils/LoadBar';
import AgentApiToken from '../../../Api/Services/AppflyteBackend/AgentApiToken';
import { tostAlert } from '../../../utils/AlertToast';
import { apiErrorHandler } from '../../../utils/ApiErrorHandler';
import { getUserRoleId } from '../../../utils/AgentApiToken/TokenUtilityService';
import getUserRoles from '../../../utils/ApiFunctions/UserRoles';
import { useAppContext } from '../../../context/AppContext';

function CreateKey() {
    const theme = useTheme();
    const styles = getStyles(theme);
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const intl = useIntl();
    // const [currentOwner, setCurrentOwner] = useState("you");
    const { selectedOrganization, selectedService, selectedWorkspace, selectedProject } = useAppContext();

    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(false);
    const [userRole, setUserRole] = useState(null)
    const [appflyteEventTypes, setAppflyteEventTypes] = useState([])
    const [appflyteFunctions, setAppflyteFunctions] = useState([])
    const [appflyteEngines, setAppflyteEngines] = useState([])

    const [tokenName, setTokenName] = useState('');
    const [permissionType, setPermissionType] = useState('all')
    const [tokenPermissions, setTokenPermissions] = useState([]);
    const [tokenExpireTime, setTokenExpireTime] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    //  States        
    const user_roles = useSelector(state => state.all_data.user_roles);
    const appflyte_engines = useSelector(state => state.all_data.appflyte_engines);
    const appflyte_functions = useSelector(state => state.all_data.appflyte_functions);
    const appflyte_event_types = useSelector(state => state.all_data.appflyte_event_types);

    useEffect(() => {
        getAllData()
        //eslint-disable-next-line
    }, [])

    useEffect(() => {
        const errors = { ...formErrors };
        if (formErrors?.tokenName && tokenName.trim()) { delete errors?.tokenName }
        if (formErrors?.tokenExpireTime && tokenExpireTime) { delete errors?.tokenExpireTime }
        if (JSON.stringify(errors) !== JSON.stringify(formErrors)) { setFormErrors(errors) }
    }, [tokenName, tokenExpireTime, formErrors]);

    const getAllUserRoles = async () => {
        if (user_roles?.length > 0) {
            return user_roles
        }
        const response = await getUserRoles()
        dispatch(setUserRoleState(response))
        return response
    }

    const getAllEventTypes = async () => {
        if (appflyte_event_types?.length > 0) {
            return appflyte_event_types
        }
        const response = await getAppflyteEventTypesData()
        dispatch(setAppflyteEventTypesState(response))
        return response
    }

    const getAllFunctions = async () => {
        if (appflyte_functions?.length > 0) {
            return appflyte_functions
        }
        const response = await getAppflyteFunctionsData()
        dispatch(setAppflyteFunctionState(response))
        return response
    }

    const getAllEngines = async () => {
        if (appflyte_engines?.length > 0) {
            return appflyte_engines
        }
        const response = await getAppflyteEnginesData()
        dispatch(setAppflyteEngineState(response))
        return response
    }

    const getAllData = async () => {
        setLoading(true)
        try {
            const [userRoleResponse, eventTypesResponse, functionsResponse, engineResponse] = await Promise.all([
                getAllUserRoles(),
                getAllEventTypes(),
                getAllFunctions(),
                getAllEngines()
            ])

            if (userRoleResponse && eventTypesResponse && functionsResponse && engineResponse) {
                setAppflyteEventTypes(eventTypesResponse)
                setAppflyteFunctions(functionsResponse)
                setAppflyteEngines(engineResponse)
                const userRoleId = await getUserRoleId(userRoleResponse, 'Admin')
                setUserRole(userRoleId)
            }
        } catch (error) {
            console.log(error)
        } finally {
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
                    service_id: selectedService?.payload?.__auto_id__,
                    workspace_id: selectedWorkspace?.payload?.__auto_id__,
                    project_id: selectedProject?.payload?.__auto_id__,
                    user_id: userId,
                    user_role: userRole,
                    engine_type: selectedProject?.payload?.configuration?.engine_name,
                    name: tokenName,
                    owned_by: userName,
                    permissions: permissionType,
                    exp: tokenExpireTime,
                    resource_type_data: tokenPermissions,
                    token_type: "admin_generate_token"
                }
                const response = await AgentApiToken.createAgentApiToken(JSON.stringify(reqObj))
                if (response.status === 200) {
                    dispatch(setAgentApiTokenAdded(true))
                    tostAlert(intl.formatMessage(messages.add_success), 'success');
                    navigate('/settings/api_keys')
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
            onClick={() => navigate('/settings/api_keys')}
            sx={breadCrumbsStyles.linkHeader}>
            <Typography sx={styles.linkText}>API Keys</Typography>
        </Link>,
        <Typography key="1" sx={styles.mainHeadingText}>New Key</Typography>,
    ];

    return (
        <Box sx={styles.mainContainer}>
            <Box sx={styles.cardContainer}>
                {(loading || dataLoading) && (<LoadBar />)}
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

                {/* <Typography sx={{ ...styles.paraText, marginTop: '10px' }}>Select who can access AI Agent</Typography> */}

                {/*   <Box marginTop={"10px"}>
                    <FormControl>
                        <FormLabel style={{ color: "black" }}>
                            <Typography sx={{ ...styles.mainHeadingText, marginTop: '10px' }}>
                                Ownership
                            </Typography>
                        </FormLabel>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            value={currentOwner}
                            onChange={(e) => setCurrentOwner(e.target.value)}
                            style={{ display: 'flex', flexDirection: 'row' }}
                        >
                            <FormControlLabel value="you" control={<Radio color='#3f51b5' />} label="You" />
                        <FormControlLabel value="service_account" control={<Radio color='#3f51b5' />} label="Service Account" /> 
                        </RadioGroup>
                    </FormControl>
                </Box>*/}

                <Box marginTop={'20px'}>
                    {/* {currentOwner === "you" && */}
                    <OwnPermissions
                        setDataLoading={setDataLoading}
                        loading={loading}
                        dataLoading={dataLoading}
                        setTokenName={setTokenName}
                        setPermissionType={setPermissionType}
                        setTokenPermissions={setTokenPermissions}
                        setTokenExpireTime={setTokenExpireTime}
                        tokenName={tokenName}
                        appflyteEventTypes={appflyteEventTypes}
                        appflyteFunctions={appflyteFunctions}
                        appflyteEngines={appflyteEngines}
                        formErrors={formErrors}
                    />
                    {/* } */}

                    {/* {currentOwner === "service_account" &&
                        <ServiceAccountPermission
                            setDataLoading={setDataLoading}
                            loading={loading}
                            dataLoading={dataLoading}
                            setTokenName={setTokenName}
                            setPermissionType={setPermissionType}
                            setTokenPermissions={setTokenPermissions}
                            setTokenExpireTime={setTokenExpireTime}
                            tokenName={tokenName}
                            appflyteEventTypes={appflyteEventTypes}
                            appflyteFunctions={appflyteFunctions}
                            appflyteEngines={appflyteEngines}
                            formErrors={formErrors}
                        />} */}
                </Box>
            </Box>
        </Box>
    )
}

export default CreateKey;