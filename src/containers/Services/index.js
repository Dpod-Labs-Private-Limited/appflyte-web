import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ReactSVG } from 'react-svg';
import { useTheme } from '@mui/material/styles';
import { Box, Button, Typography } from '@mui/material';
import { useIntl } from 'react-intl';
import messages from './messages';

import { getServicesByOrganization } from '../../utils/ApiFunctions/ServicesData';
import { useAppContext } from '../../context/AppContext';
import LoadBar from '../../utils/LoadBar';
import { getStyles } from './styles';
import { IconSvg } from '../../utils/globalIcons';
import { setAppflyteEngineState } from '../../Redux/slice/dataSlice';
import getAppflyteEnginesData from '../../utils/ApiFunctions/AppflyteEngines';
import { tostAlert } from '../../utils/AlertToast';

function ServicesList() {
    const theme = useTheme();
    const styles = getStyles(theme);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const intl = useIntl();
    const { selectedOrganization, setSelectedService, dataLoading } = useAppContext();
    const all_engines = useSelector(state => state.all_data.appflyte_engines);

    const [appflyteEngines, setAppflyteEngines] = useState([]);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getAllAppflyteEngines()
    }, [])

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
        } finally {
            setLoading(false)
        }
    }

    const handleServiceSelection = async (item) => {
        setLoading(true)
        try {

            const engine_id = item?.payload?.__auto_id__ ?? null;
            const service_name = item?.payload?.configuration?.engine_name ?? null;

            const organization_id = selectedOrganization?.payload?.__auto_id__ ?? null;
            const response = await getServicesByOrganization(organization_id);
            if (response) {
                const responseData = response ?? [];

                if ((responseData || [])?.length === 0) {
                    navigate(`/organization/${organization_id}/services/add-service`, { state: { engine_type: engine_id, service_name: service_name } })
                }
                else {
                    const selected_service = (responseData || [])?.find(service => service?.payload?.appflyte_engine?.includes(engine_id)) ?? null;
                    if (selected_service) {
                        setSelectedService(selected_service)
                        navigate(`/organization/${organization_id}/workspaces`);
                    } else {
                        navigate(`/organization/${organization_id}/services/add-service`, { state: { engine_type: engine_id, service_name: service_name } })
                    }
                }
            } else {
                tostAlert(intl.formatMessage(messages.invalid), 'warning');
            }

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const checkServiceName = {
        "extraction_agent": 'EXTRACT',
        "analytics_tool": 'ANALYST',
        "appflyte_agent": 'APPFLYTE'
    };

    return (
        <Box sx={styles.mainContainer}>
            <Box sx={styles.cardContainer}>
                {(dataLoading || loading) && <LoadBar />}

                <Box marginTop={'30px'}>
                    <Typography sx={{ fontSize: '24px', fontWeight: 600 }}>
                        Welcome to Ameya AI Cloud
                    </Typography>
                    <Typography sx={{ fontSize: '14px', fontWeight: 400, marginTop: '10px' }}>
                        Select an AI engine to get started
                    </Typography>

                    <Box
                        sx={{
                            marginTop: '50px',
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: '15px',
                            alignItems: 'stretch'
                        }}
                    >
                        {(appflyteEngines || [])?.length > 0 ? (
                            appflyteEngines.map((item, index) => (
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
                                                {checkServiceName[item?.payload?.name || 'Unknown']}
                                            </Typography>
                                        </Button>
                                    </Box>

                                    <Box
                                        sx={{
                                            padding: '20px 15px',
                                            bgcolor: '#FFFFFF',
                                            borderRadius: '5px',
                                            border: '2px solid #DEDEDE',
                                            width: '300px',
                                            flexGrow: 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            '&:hover': { border: '2px solid #0B51C5' }
                                        }}
                                        onClick={() => handleServiceSelection(item)}
                                    >
                                        <ReactSVG
                                            src={{
                                                analytics_tool: IconSvg.analysisIcon,
                                                extraction_agent: IconSvg.extarctionIcon,
                                                appflyte_agent: IconSvg.aiQmsIcon
                                            }[item?.payload?.name] || IconSvg.filesIcon}
                                            beforeInjection={(svg) => {
                                                svg.setAttribute('style', 'width:48px; height:48px; display:block;');
                                            }}
                                        />

                                        <Box marginTop="20px" textAlign="start" sx={{ flexGrow: 1 }}>
                                            <Typography sx={styles.cardHeadingText}>{item?.payload?.label}</Typography>
                                            <Typography sx={{ ...styles.cardDescriptionText, marginTop: '10px' }}>
                                                {item?.payload?.description}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            ))
                        ) : (
                            (appflyteEngines || [])?.length === 0 && !dataLoading && !loading && (
                                <Box sx={styles.noRecord}>
                                    <Typography sx={styles.noRecordsText}>No Service Available</Typography>
                                </Box>
                            )
                        )}
                    </Box>

                </Box>
            </Box>
        </Box >
    )
}

export default ServicesList;