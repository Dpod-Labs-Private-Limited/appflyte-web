import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { getStyles } from './styles';
import { Box, Switch, Typography } from '@mui/material';
import LoadBar from '../../../utils/LoadBar';
import { useAppContext } from '../../../context/AppContext';
import { getUserName } from '../../../utils/GetAccountDetails';
import moment from 'moment';
import AmeyaSettingsApi from '../../../Api/Services/AppflyteBackend/AmeyaSettings';
import getAmeyaSettingsDataByOrg from '../../../utils/ApiFunctions/AmeyaSettingsDataByOrg';
import { tostAlert } from '../../../utils/AlertToast';
import AmeyaService from '../../../Api/Services/AppflyteBackend/ExtrcationAnlyitcsAPi';

function ExtractionAnalytics() {
    const theme = useTheme();
    const styles = getStyles(theme);

    const [datasetEnabled, setDatasetEnabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const { selectedOrganization, selectedWorkspace, selectedProject } = useAppContext();

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const response = await getAmeyaSettingsDataByOrg(selectedOrganization?.payload?.__auto_id__);
            if (response?.length > 0) {
                const responseData = response?.at(-1) ?? {};
                const data_payload = responseData?.payload ?? {};
                const extraction_analytics_config = data_payload?.extraction_analytics_config ?? [];
                const project_id = selectedProject?.payload?.__auto_id__ ?? null;
                const filtered_response = (extraction_analytics_config || [])?.filter(item => item?.project_id === project_id) ?? [];
                const lastItem = filtered_response?.at(-1) || null;
                if (lastItem) {
                    const extraction_analytics_status = lastItem?.extraction_analytics_status ?? false;
                    setDatasetEnabled(extraction_analytics_status)
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (status) => {
        setLoading(true);
        try {
            setDatasetEnabled(status);

            const organization_id = selectedOrganization?.payload?.__auto_id__;
            const organization_name = selectedOrganization?.payload?.name;
            const workspace_id = selectedWorkspace?.payload?.__auto_id__;
            const project_id = selectedProject?.payload?.__auto_id__;
            const project_name = selectedProject?.payload?.name;

            if (!datasetEnabled && status === true) {
                const reqObj = {
                    'project_id': project_id,
                    'organization_id': organization_id,
                    'organization_name': organization_name
                }
                await AmeyaService.triggerAnalytics(reqObj)
            }
            const response = await getAmeyaSettingsDataByOrg(selectedOrganization?.payload?.__auto_id__);

            if ((response || [])?.length > 0) {
                const responseData = response?.at(-1) ?? {};
                const item_id = responseData?.payload?.__auto_id__;
                const update_key = responseData?.update_key;
                const extraction_analytics_config = responseData?.payload?.extraction_analytics_config ?? [];
                const existing_config = [...extraction_analytics_config];

                const existingIndex = existing_config.findIndex((item) => item?.project_id === project_id);

                if (existingIndex !== -1) {
                    existing_config[existingIndex] = {
                        ...existing_config[existingIndex],
                        project_name,
                        extraction_analytics_status: status
                    };
                } else {
                    existing_config.push({
                        project_id,
                        project_name,
                        extraction_analytics_status: status
                    });
                }

                const dataObject = {
                    id: item_id,
                    fields: [
                        { path: '$.extraction_analytics_config', value: existing_config }
                    ]
                };

                const update_response = await AmeyaSettingsApi.updateSettings(dataObject, item_id, update_key);
                if (update_response.status === 200) {
                    if (status === true) {
                        tostAlert("Extraction Analytics Enabled", "success")
                    } else {
                        tostAlert("Extraction Analytics Disabled", "success")
                    }
                }
            } else {
                const userName = await getUserName();
                const settingsObject = {
                    collection_item: {
                        extraction_analytics_config: [{
                            project_id: project_id,
                            project_name: project_name,
                            extraction_analytics_status: status
                        }],
                        workspace_id: workspace_id,
                        project_id: project_id,
                        organization_id: organization_id,
                        created_by: userName,
                        created_on: moment().format("DD-MM-YYYY HH:mm:ss"),
                    }
                };
                const create_res = await AmeyaSettingsApi.addSettings(settingsObject);
                if (create_res.status === 200) {
                    if (status === true) {
                        tostAlert("Extraction Analytics Enabled", "success")
                    } else {
                        tostAlert("Extraction Analytics Disabled", "success")
                    }
                }
            }

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={styles.mainContainer}>
            <Box sx={styles.cardContainer}>
                {loading && <LoadBar />}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Typography sx={{ fontSize: '14px', fontWeight: '400' }}>
                        Analytics Dataset Status
                    </Typography>
                    <Switch
                        disabled={loading}
                        checked={datasetEnabled}
                        onChange={(e) => handleToggle(e.target.checked)}
                    />
                </Box>
            </Box>
        </Box>
    );
}

export default ExtractionAnalytics;
