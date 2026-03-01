import React, { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { Styles } from './Styles';
import { InvalidAccess } from '../../utils/sessionDataHandle';

import SubSidebar from './Sidebar';
import GeneralSettings from './GeneralSettings';
import { useAppContext } from '../../context/AppContext';

function SettingsHome() {

    const navigate = useNavigate();
    const location = useLocation();
    const { selectedWorkspace, selectedProject } = useAppContext();

    const handleMenuChange = (selectedPage) => {
        navigate(`/settings/${selectedPage.toLowerCase()}`);
    };

    useEffect(() => {
        if (!selectedWorkspace || !selectedProject) {
            InvalidAccess(navigate);
            return
        }

        if (location.pathname === '/settings') {
            navigate('/settings/general');
        }
    }, [location.pathname, navigate]);

    return (
        <Box sx={Styles.mainContainer}>
            <Box sx={Styles.sidebar}>
                <SubSidebar handleMenuChange={handleMenuChange} />
            </Box>
            <main style={Styles.componentContainer}>
                <Box sx={Styles.cardContainer}>
                    <Routes>
                        <Route path="general" element={<GeneralSettings />} />
                    </Routes>
                </Box >
            </main>
        </Box>

    )
}

export default SettingsHome;