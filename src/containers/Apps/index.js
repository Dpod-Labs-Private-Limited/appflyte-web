import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, CircularProgress, IconButton, Typography } from '@mui/material';
import { ArrowForward, ContentCopy, ContentCopyOutlined, Launch } from '@mui/icons-material';
import LoadingOverlay from 'react-loading-overlay';
import topbar from 'topbar';
import { useOutletContext } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { v4 as uuid } from 'uuid';
import { ReactSVG } from 'react-svg';
import { IconSvg } from '../../utils/globalIcons';
import { doc, onSnapshot } from "firebase/firestore";

import getStyles from './styles';
import AppflyteAppsApi from '../../Api/Services/AppflyteBackend/AppflyteApps';
import { getAppflyteAppData } from '../../utils/service';
import { useAppContext } from '../../context/AppContext';
import messages from './messages';
import { getUserName } from '../../utils/GetAccountDetails';
import { db } from '../../firebase';

function Apps() {
    const styles = getStyles();
    const { tostAlert } = useOutletContext();
    const unsubscribeRefs = useRef({});
    const [loading, setLoading] = useState(false);
    const [copiedData, setCopiedData] = useState(null);

    const { selectedOrganization, selectedWorkspace, selectedProject } = useAppContext();

    const [allApps, setAllApps] = useState([{ id: 'bug_tracker', name: 'Bug Tracker', description: 'Bug Tracker', status: false }]);

    useEffect(() => {
        loading ? topbar.show() : topbar.hide();
    }, [loading]);

    useEffect(() => {
        fetchData();
    }, [selectedProject]);

    useEffect(() => {
        return () => {
            Object.values(unsubscribeRefs.current).forEach(unsub => unsub?.());
        };
    }, []);

    const startAppListener = (appId, appType) => {

        if (unsubscribeRefs.current[appType]) {
            unsubscribeRefs.current[appType]();
        }

        const docRef = doc(db, "appflyte_apps", appId);

        unsubscribeRefs.current[appType] = onSnapshot(
            docRef,
            (snapshot) => {
                if (!snapshot.exists()) return;

                const data = snapshot.data();

                setAllApps(prevApps =>
                    prevApps.map(app => {
                        if (app.id !== appType) return app;
                        return {
                            ...app,
                            status: true,
                            app_state: data.status,
                        };
                    })
                );

                if (data.status === 'completed' || data.status === 'failed') {
                    unsubscribeRefs.current[appType]?.();
                    unsubscribeRefs.current[appType] = null;
                }
            },
            (error) => {
                console.error("Firebase app listener error:", error);
            }
        );
    };

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
                        return { ...app, status: false };
                    }

                    if (matchedApp.app_state === 'in_progress') {
                        startAppListener(matchedApp.app_id, app.id);
                    }

                    return {
                        ...app,
                        status: true,
                        app_id: matchedApp.app_id,
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

    const handleAppSetup = async (app) => {
        if (app.status || loading) return;

        setLoading(true);
        try {
            const organizationId = selectedOrganization?.payload?.__auto_id__ ?? null;
            const workspaceId = selectedWorkspace?.payload?.__auto_id__ ?? null;
            const projectId = selectedProject?.payload?.__auto_id__ ?? null;
            const createdBy = getUserName();
            const app_id = uuid();

            const reqObj = {
                app_id,
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
                setAllApps(prevApps =>
                    prevApps.map(a =>
                        a.id === app.id
                            ? { ...a, status: true, app_id, app_state: 'in_progress' }
                            : a
                    )
                );
                startAppListener(app_id, app.id);
                tostAlert(<FormattedMessage {...messages.successfullySubscribed} />, 'success');
            }
        } catch (error) {
            console.error(error);
            tostAlert(<FormattedMessage {...messages.subscribeFail} />, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDataCopy = (itemId, data) => {
        if (!itemId) return;
        const app_base_url = process.env.REACT_APP_BUGTRACKER_APP_BASE_URL;
        const bug_tracker_url = `${app_base_url}/${data}`;
        navigator.clipboard.writeText(bug_tracker_url).then(() => {
            setCopiedData(itemId);
            setTimeout(() => setCopiedData(null), 2000);
        });
    };

    const handleLaunch = (app) => {
        const app_base_url = process.env.REACT_APP_BUGTRACKER_APP_BASE_URL;
        const url = `${app_base_url}/${app.app_slug}`;
        window.open(url, '_blank');
    };

    return (
        <Box sx={styles.mainContainer}>
            <Box sx={styles.cardContainer}>
                <LoadingOverlay
                    active={loading}
                    styles={{
                        wrapper: { height: '100%', width: '100%' },
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
                            const isSuccess = app.status && (app.app_state === 'completed' || app.app_state === 'success');
                            const isInProgress = app.status && app.app_state === 'in_progress';
                            const isFailed = app.status && app.app_state === 'failed';

                            return (
                                <Button
                                    key={app.id}
                                    variant="text"
                                    disableRipple
                                    sx={styles.card}
                                    onClick={() => {
                                        if (!app.status && !loading) handleAppSetup(app);
                                    }}
                                >
                                    <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        {isSuccess && (
                                            <Box
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDataCopy(app.id, app.app_slug);
                                                }}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    cursor: 'pointer',
                                                    color: copiedData === app.id ? '#0B51C5' : 'inherit',
                                                }}
                                            >
                                                {copiedData === app.id
                                                    ? <ContentCopy fontSize="small" />
                                                    : <ContentCopyOutlined fontSize="small" />
                                                }
                                            </Box>
                                        )}
                                        <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
                                            {app.name}
                                        </Typography>
                                    </Box>

                                    {!app.status && (
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography sx={{ color: '#0B51C5', '&:hover': { textDecoration: 'underline' } }}>
                                                Subscribe App
                                            </Typography>
                                            <IconButton>
                                                <ArrowForward sx={{ color: '#0B51C5', height: 18, width: 18 }} />
                                            </IconButton>
                                        </Box>
                                    )}

                                    {isInProgress && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <CircularProgress size={'15px'} sx={{ height: '10px', width: '10px' }} />
                                            <Typography sx={{ color: '#FBBC04' }}>
                                                Processing
                                            </Typography>
                                        </Box>
                                    )}

                                    {isFailed && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <ReactSVG
                                                src={IconSvg.errorIcon}
                                                beforeInjection={(svg) => {
                                                    svg.setAttribute('style', 'width:18px; height:18px; display:block;');
                                                }}
                                            />
                                            <Typography sx={{ color: '#C30E2E' }}>
                                                Failed
                                            </Typography>
                                        </Box>
                                    )}

                                    {isSuccess && (
                                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                startIcon={<Launch sx={{ height: 16, width: 16 }} />}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleLaunch(app);
                                                }}
                                                sx={styles.launchButton}
                                            >
                                                Launch
                                            </Button>
                                        </Box>
                                    )}

                                </Button>
                            );
                        })}
                    </Box>
                </LoadingOverlay>
            </Box>
        </Box>
    );
}

export default Apps;