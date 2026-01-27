import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Tooltip, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useIntl } from 'react-intl';
import messages from './messages';

import { getStyles } from './styles';
import { getMainStyles } from '../../styles/styles';

import { setAppflyteEngineState, setOrganizationsState, setProjectsState, setSpacesState } from '../../Redux/slice/dataSlice';
import { getOrganizationData } from '../../utils/ApiFunctions/OrganizationsData';
import LoadBar from '../../utils/LoadBar';
import { tostAlert } from '../../utils/AlertToast';
import { useAppContext } from '../../context/AppContext';
import { fetchOrganizationId, fetchOwnerByOrganization } from '../../utils/GetAccountDetails';
import getAppflyteEnginesData from '../../utils/ApiFunctions/AppflyteEngines';
import { getServicesByOrganization } from '../../utils/ApiFunctions/ServicesData';

function Organizations() {

    const theme = useTheme();
    const styles = getStyles(theme);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const intl = useIntl();
    const mainStyles = getMainStyles(theme);
    const { setSelectedOrganization, setSelectedService, setSelectedWorkspace, setSelectedProject, authData } = useAppContext();
    const all_organizations = useSelector(state => state.all_data.organizations);
    const all_engines = useSelector(state => state.all_data.appflyte_engines);

    const [loading, setLoading] = useState(true);
    const [organizationData, setOrganizationData] = useState([]);
    const [appflyteEngines, setAppflyteEngines] = useState([]);

    useEffect(() => {
        getAllData()
        //eslint-disable-next-line
    }, [])

    const getAllData = async () => {
        try {
            await Promise.all([getAllOrganization(), getAllAppflyteEngines()])
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const getAllOrganization = async () => {
        try {
            let org_data = []
            if (!all_organizations?.length) {
                const response = await getOrganizationData();
                const user_organization = fetchOrganizationId();
                const valid_organizations = response?.filter(item => user_organization?.includes(item?.payload?.__auto_id__)) ?? [];
                dispatch(setOrganizationsState(valid_organizations));
                org_data = valid_organizations;
            } else {
                org_data = all_organizations
            }
            setOrganizationData(org_data)
        } catch (error) {
            console.log(error)
        }
    }

    const getAllAppflyteEngines = async () => {
        try {
            if (!all_engines?.length) {
                const data = await getAppflyteEnginesData();
                dispatch(setAppflyteEngineState(data));
                setAppflyteEngines(data)
                return data;
            }
            setAppflyteEngines(all_engines)
            return all_engines;
        } catch (error) {
            console.error("Failed to fetch Engines", error);
            return [];
        }
    }

    const handleOrganizationSelection = async (organization) => {
        setLoading(true)
        try {

            if (!organization) {
                return tostAlert(intl.formatMessage(messages.invalid), "warning");
            }

            const organization_id = organization?.payload?.__auto_id__ ?? null;
            if (!organization_id) {
                return tostAlert(intl.formatMessage(messages.invalid), "warning");
            }

            const requestType = authData?.request_type ?? null;
            const userAuthType = authData?.user_auth_type ?? null;
            const creditBundleId = authData?.credit_bundle_id ?? null;

            const isExternalUser = requestType === "ext_existing_user" || requestType === "ext_user_singin";
            const is_owner = await fetchOwnerByOrganization(organization_id)

            const resetStateAndNavigateToServices = (path = "services") => {
                dispatch(setSpacesState([]));
                dispatch(setProjectsState([]));
                setSelectedService(null);
                setSelectedWorkspace(null);
                setSelectedProject(null);
                setSelectedOrganization({ ...organization });

                if (userAuthType === "external_ameya_stripe" && creditBundleId && is_owner) {
                    navigate("/user/billing")
                    return
                }
                navigate(`/organization/${organization_id}/${path}`);
            };

            if (!isExternalUser) {
                return resetStateAndNavigateToServices("services");
            }

            const filtered_engine = (appflyteEngines || []).find((e) => e?.payload?.configuration?.engine_name === "extraction_agent") ?? null;

            if (!filtered_engine) {
                return resetStateAndNavigateToServices("services");
            }

            const engine_id = filtered_engine?.payload?.__auto_id__ ?? null;
            const service_name = filtered_engine?.payload?.configuration?.engine_name ?? null;

            const response = await getServicesByOrganization(organization_id);
            if (!response) {
                return tostAlert(intl.formatMessage(messages.invalid), "warning");
            }

            const services = response ?? [];

            if (!services.length) {
                return navigate(`/organization/${organization_id}/services/add-service`, {
                    state: { engine_type: engine_id, service_name },
                });
            }

            const selected_service = services.find((s) => s?.payload?.appflyte_engine?.includes(engine_id)) ?? null;

            if (selected_service) {
                dispatch(setSpacesState([]));
                dispatch(setProjectsState([]));
                setSelectedOrganization({ ...organization });
                setSelectedWorkspace(null);
                setSelectedProject(null);
                setSelectedService(selected_service);
                return navigate(`/organization/${organization_id}/workspaces`);
            }

            return navigate(`/organization/${organization_id}/services/add-service`, {
                state: { engine_type: engine_id, service_name },
            });

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    };


    return (
        <Box style={styles.mainContainer}>
            <Box sx={{ ...styles.cardContainer }}>
                {loading && <LoadBar />}

                <Box padding={'20px'}>
                    <Typography sx={styles.mainHeadingText}>All Organizations</Typography>

                    <Box sx={styles.orgCardContainer}>
                        {(organizationData || [])?.length > 0 &&
                            organizationData?.map((org, index) => (
                                <Button
                                    variant='text'
                                    disableRipple
                                    key={index}
                                    sx={styles.orgCard}
                                    disabled={loading}
                                    onClick={() => handleOrganizationSelection(org)}
                                >
                                    <Box sx={{ padding: '10px', flexGrow: 1 }}>

                                        <Box sx={{
                                            padding: '10px 20px 10px 20px',
                                            color: theme.palette.text.primary,
                                        }}>
                                            <Tooltip
                                                title={org?.payload?.name || ''}
                                                arrow
                                                placement="top"
                                                disableHoverListener={!org?.payload?.name || org?.payload?.name?.length <= 30}
                                            >
                                                <Typography sx={styles.orgHeadingText}>{org?.payload?.name}</Typography>
                                            </Tooltip>
                                        </Box>

                                        <Box sx={{
                                            padding: '0px 20px 10px 20px',
                                            color: theme.palette.text.primary,
                                        }}>
                                            <Tooltip
                                                title={org?.payload?.description || ''}
                                                arrow
                                                placement="bottom"
                                                disableHoverListener={!org?.payload?.description || org?.payload?.description?.length <= 100}
                                            >
                                                <Typography sx={styles.orgDescriptionText}>
                                                    {org?.payload?.description}
                                                </Typography>
                                            </Tooltip>
                                        </Box>
                                    </Box>
                                </Button>
                            ))
                        }
                    </Box>

                    {((organizationData || [])?.length === 0 && !loading) && (
                        <Box sx={{ ...mainStyles.noRecord, marginTop: '100px' }}>
                            <Typography sx={styles.noRecordsText}>{intl.formatMessage(messages.no_record)}</Typography>
                        </Box>
                    )}

                </Box>
            </Box>
        </Box >
    )
}

export default Organizations;