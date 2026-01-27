import React, { useEffect, useState } from 'react'
import { getStyles } from './styles';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import { AppflyteRootConfig } from "dpod-access-control";
import RootUserNav from './navbar';
import RootUserSidebar from './sidebar';
import { useNavigate } from 'react-router-dom';

function RootUserHome() {
    const theme = useTheme();
    const styles = getStyles(theme);
    const navigate = useNavigate();
    const [isAutenticated, setIsAuthenticated] = useState(false);
    const [pageType, setPageType] = useState('Auth')
    const auth_server_url = process.env.REACT_APP_OAUTH_SERVER_URL
    const schema_id = process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID

    useEffect(() => {
        const checkAuth = () => {
            const session_token = localStorage.getItem('root-user-token');
            setIsAuthenticated(!!session_token);
        };
        const handleStorageChange = () => {
            checkAuth();
        };
        checkAuth();
        window.addEventListener('storage', handleStorageChange);
        const interval = setInterval(checkAuth, 2000);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, []);

    const handleCancel = () => {
        navigate('/cancel')
    }

    if (!isAutenticated) {
        return (<Box sx={styles.mainContainer}>
            <Box sx={styles.libraryComponent(isAutenticated)}>
                <AppflyteRootConfig
                    appflyte_authentication_url={auth_server_url}
                    schema_id={schema_id}
                    onCancel={handleCancel}
                />
            </Box>
        </Box>)
    }

    return (
        <Box sx={styles.mainContainer}>
            <Box sx={styles.sidebarContainer}>
                <RootUserSidebar setPageType={setPageType} />
            </Box>

            <Box style={styles.mainConatainer}>

                <Box sx={styles.navContainer}>
                    <RootUserNav />
                </Box>

                <Box sx={styles.mainComponentContainer}>
                    <Box sx={styles.libraryComponent(isAutenticated)}>
                        <Box sx={{
                            flex: 1,
                            overflow: 'auto',
                            width: '100%',
                            backgroundColor: '#FFFFFF',
                            borderRadius: '20px',
                            padding: '10px',
                            scrollbarWidth: "none",
                            "&::-webkit-scrollbar": {
                                display: "none",
                            },
                        }}>
                            {(pageType === "Auth" && isAutenticated) &&
                                (<AppflyteRootConfig
                                    appflyte_authentication_url={auth_server_url}
                                    schema_id={schema_id}
                                    onCancel={handleCancel}
                                />)
                            }
                        </Box>
                    </Box>
                </Box>

            </Box>
        </Box>

    )
}

export default RootUserHome;