import React, { useEffect, useState } from 'react';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { ArrowForward, ContentCopy, ContentCopyOutlined } from '@mui/icons-material';
import LoadingOverlay from 'react-loading-overlay';
import topbar from 'topbar';
import { useOutletContext } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { v4 as uuid } from 'uuid';
import { ReactSVG } from 'react-svg';
import { IconSvg } from '../../utils/globalIcons';

import getStyles from './styles';
import AppflyteAppsApi from '../../Api/Services/AppflyteBackend/AppflyteApps';
import { getAppflyteAppData } from '../../utils/service';
import { useAppContext } from '../../context/AppContext';
import messages from './messages';
import { getUserName } from '../../utils/GetAccountDetails';

function Apps() {
    const styles = getStyles();
    const { tostAlert } = useOutletContext();

    const { selectedOrganization, selectedWorkspace, selectedProject } = useAppContext();

    const [allApps, setAllApps] = useState([
        { id: 'bug_tracker', name: 'Bug Tracker', description: 'Bug Tracker', status: false }
        // { id: 'impilos', name: 'Impilos', description: 'Impilos', status: false }
    ]);
    const [loading, setLoading] = useState(false);
    const [copiedData, setCopiedData] = useState(null);

    useEffect(() => {
        loading ? topbar.show() : topbar.hide();
    }, [loading]);

    const fetchData = async () => {
        if (!selectedProject?.payload?.__auto_id__) return;

        setLoading(true);
        try {
            const projectId = selectedProject.payload.__auto_id__;
            const response = await getAppflyteAppData(projectId);
            const appMap = new Map(response.map(item => [item?.payload?.app_type, item?.payload]));

            setAllApps(prevApps =>
                prevApps.map(app => {
                    const matchedApp = appMap.get(app.id);
                    if (!matchedApp) {
                        return {
                            ...app,
                            status: false
                        };
                    }
                    return {
                        ...app,
                        status: true,
                        app_slug: matchedApp.app_slug,
                        app_state: matchedApp.app_state
                    };
                })
            );
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedProject]);

    const handleAppSetup = async (app) => {
        if (app.status || loading) return;

        setLoading(true);
        try {
            const organizationId = selectedOrganization?.payload?.__auto_id__ ?? null;
            const workspaceId = selectedWorkspace?.payload?.__auto_id__ ?? null;
            const projectId = selectedProject?.payload?.__auto_id__ ?? null;
            const projectName = selectedProject?.payload?.name ?? null;
            const createdBy = getUserName();

            const reqObj = {
                app_id: uuid(),
                app_name: app.name,
                app_description: app.description,
                app_type: app.id,
                app_slug: projectId,
                organization_id: organizationId,
                workspace_id: workspaceId,
                project_id: projectId,
                created_by: createdBy
            };

            const response = await AppflyteAppsApi.createApp(JSON.stringify(reqObj));
            if (response.status === 200) {
                tostAlert(<FormattedMessage {...messages.successfullySubscribed} />, 'success');
                fetchData();
            }
        } catch (error) {
            console.error(error);
            tostAlert(<FormattedMessage {...messages.subscribeFail} />, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDataCopy = (itemId, data) => {
        if (itemId) {
            const base_url = "http://localhost:3001"
            // const app_base_url = process.env.REACT_APP_BUGTRACKER_BASE_URL || "http://localhost:3001"
            const bug_tracker_url = `${base_url}/${data}`
            navigator.clipboard.writeText(bug_tracker_url).then(() => {
                setCopiedData(itemId);
                setTimeout(() => setCopiedData(null), 2000);
            });
        }
    };

    const appStatus = {
        in_progress: "Processing",
        success: "Success",
        failed: "Failed"
    };

    return (
        <Box sx={styles.mainContainer}>
            <Box sx={styles.cardContainer}>
                <LoadingOverlay
                    active={loading}
                    horizontal
                    styles={{
                        wrapper: {
                            height: '100%',
                            width: '100%',
                        },
                        overlay: base => ({
                            ...base,
                            background: 'rgba(0, 0, 0, 0.2)',
                            zIndex: 1600,
                            position: 'fixed'
                        }),
                    }}
                >
                    <Box sx={styles.viewCardContainer}>
                        {allApps.map(app => {
                            const showCopy = app.status && app.app_state === 'success' && !loading;
                            return (
                                <Button
                                    key={app.id}
                                    variant="text"
                                    disableRipple
                                    sx={styles.card}
                                    onClick={() => {
                                        if (!app.status && !loading) {
                                            handleAppSetup(app)
                                        }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        {showCopy && (
                                            <Box
                                                onClick={() => handleDataCopy(app.id, app.app_slug)}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    cursor: 'pointer',
                                                    color: copiedData === app.id ? '#0B51C5' : 'inherit',
                                                }}
                                            >
                                                {copiedData === app.id ? (
                                                    <ContentCopy fontSize="14px" />
                                                ) : (
                                                    <ContentCopyOutlined fontSize="14px" />
                                                )}
                                            </Box>
                                        )}
                                        <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
                                            {app.name}
                                        </Typography>
                                    </Box>

                                    {(!app.status && !loading) ?
                                        (<Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography
                                                sx={{
                                                    color: '#0B51C5',
                                                    '&:hover': { textDecoration: 'underline' }
                                                }}
                                            >
                                                Subscribe App
                                            </Typography>
                                            <IconButton>
                                                <ArrowForward
                                                    sx={{ color: '#0B51C5', height: 18, width: 18 }}
                                                />
                                            </IconButton>
                                        </Box>) :
                                        (<Box>
                                            {app.app_state !== "success" &&
                                                (<Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <ReactSVG
                                                        src={{
                                                            Processing: IconSvg.trainingIcon,
                                                            Failed: IconSvg.errorIcon
                                                        }[appStatus[app?.app_state] || app?.app_state]}
                                                        beforeInjection={(svg) => {
                                                            svg.setAttribute('style', 'width:18px; height:18px; display:block;');
                                                        }}
                                                    />
                                                    <Typography
                                                        sx={{
                                                            color: app.app_state === 'failed' ? '#C30E2E' : '#FBBC04',
                                                        }}
                                                    >
                                                        {appStatus[app?.app_state]}
                                                    </Typography>
                                                </Box>)}
                                        </Box>)
                                    }
                                </Button>)
                        })}
                    </Box>
                </LoadingOverlay>
            </Box>
        </Box>
    );
}

export default Apps;
