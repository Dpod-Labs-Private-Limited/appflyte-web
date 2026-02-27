import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

import { Box, Typography, FormControl, TextField, Button, Link } from '@mui/material'
import { getStyles } from './Styles'
import { useTheme } from '@mui/material/styles';

import appflyte_logo from "../images/appflyte_logo.svg"

import { getComponentsStyles } from '../styles/componentsStyles';
import { useState } from 'react';
import { IconSvg } from '../utils/globalIcons';
import { ReactSVG } from 'react-svg';
import { useDispatch } from 'react-redux';
import { tostAlert } from '../utils/AlertToast';

function InviteSignIn() {

    const theme = useTheme();
    const styles = getStyles(theme);
    const componentsStyles = getComponentsStyles(theme);
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch();
    const [formErrors, setFormErrors] = useState({});
    const [invitecode, setInviteCode] = useState('')

    const app_name = process.env.REACT_APP_NAME
    const authServerUrl = process.env.REACT_APP_OAUTH_SERVER_URL
    const schema_id = process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID

    useEffect(() => {
        const errors = { ...formErrors };
        if (formErrors?.invitecode && invitecode?.trim()) { delete errors?.invitecode }
        if (JSON.stringify(errors) !== JSON.stringify(formErrors)) { setFormErrors(errors) }
    }, [invitecode, formErrors]);

    const handleOAuthLogin = (auth_provider) => {
        try {
            const errors = {};
            if (!invitecode?.trim()) { errors.invitecode = 'Invite code is required' }
            if (Object.keys(errors).length === 0) {

                localStorage.clear()
                sessionStorage.clear()
                dispatch({ type: 'RESET_ALL' });

                const params = new URLSearchParams({
                    app_name: app_name,
                    schema_id: schema_id,
                    auth_provider: auth_provider,
                    request_type: "invite_signin",
                    invite_code: invitecode
                });

                const authUrlWithParams = `${authServerUrl}/user_auth?${params.toString()}`;
                const popup = window.open(authUrlWithParams, "oauthPopup", "width=500,height=600");
                const interval = setInterval(() => {
                    if (popup.closed) {
                        clearInterval(interval);
                        console.log("Popup closed");
                    }
                }, 1000);
            } else {
                setFormErrors(errors);
            }
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        const handlePopupMessage = async (event) => {
            const app_origin = window.location.origin
            if (event.origin !== app_origin) {
                console.warn("Invalid origin:", event.origin);
                return;
            }
            if (event.data && event.data.type === "login-success") {
                const { queryParams } = event.data;
                postLogin(queryParams);
            }
        };

        window.addEventListener("message", handlePopupMessage);
        return () => {
            window.removeEventListener("message", handlePopupMessage);
        };
        //eslint-disable-next-line
    }, []);

    const postLogin = async (authResponse) => {
        try {

            const dpodToken = authResponse?.token;
            const refreshToken = authResponse?.refresh_token;
            const decoded_dpod_token = jwtDecode(dpodToken);
            const app_subscribed = decoded_dpod_token?.app_subscribed ?? [];
            const user_name = decoded_dpod_token?.user_name;

            if (app_subscribed.length > 0 && app_subscribed.includes(app_name)) {
                localStorage.setItem('dpod-token', JSON.stringify(dpodToken));
                localStorage.setItem('refresh-token', JSON.stringify(refreshToken));
                localStorage.setItem('UserName', JSON.stringify(user_name));
                navigate("/home");
            } else {
                tostAlert("You do not have access to this application.", "error");
                localStorage.clear();
                sessionStorage.clear()
            }
        } catch (error) {
            console.error('Error decoding Token:', error);
            if (location.pathname !== '/invite-login' && location.pathname !== '/root-user') {
                navigate('/login');
            }
            localStorage.clear()
            sessionStorage.clear()
        }
    };

    useEffect(() => {
        checkLogin();
        //eslint-disable-next-line
    }, []);

    const checkLogin = async () => {
        const jwtIdToken = localStorage.getItem('dpod-token')
        if (location.pathname !== "/authorized") {
            if (!jwtIdToken) {
                localStorage.clear()
                if (location.pathname !== '/invite-login' && location.pathname !== '/root-user') {
                    navigate('/login');
                }
            }
        }
    };

    return (
        <Box sx={styles.mainContainer}>
            <Box sx={styles.body}>
                <Box sx={styles.signinContainer}>
                    <Box padding={'20px'} display={'flex'} alignItems={'center'} flexDirection={'column'}>
                        <img src={appflyte_logo} alt='appflyte_logo' style={{ height: '68px', width: '200px' }} />
                        <Typography sx={{ fontSize: '18px', fontWeight: 600, marginTop: '10px' }}>Welcome to Appflyte</Typography>
                        <Typography sx={{ fontSize: '15px', fontWeight: 500, marginTop: '10px' }}>Sign Up</Typography>

                        <Box marginTop={'20px'} paddingBottom={'10px'}>
                            <FormControl>
                                <Typography sx={{ ...styles.paraText, marginBottom: '6px', textAlign: 'center' }}>Invite Code</Typography>
                                <TextField
                                    id="invite-code"
                                    size='small'
                                    sx={{ ...componentsStyles.textField, width: '250px' }}
                                    value={invitecode}
                                    onChange={(e) => setInviteCode(e.target.value)}
                                />
                            </FormControl>
                            {formErrors.invitecode && <Typography sx={{ ...styles.paraText, color: 'red', textAlign: 'center' }}>{formErrors.invitecode}</Typography>}
                        </Box>


                        <Box marginTop={'10px'}>
                            <Box
                                sx={styles.signinButton}
                                onClick={() => handleOAuthLogin('google')}
                            >
                                <ReactSVG
                                    src={IconSvg.googleIcon}
                                    beforeInjection={(svg) => {
                                        svg.setAttribute('style', 'width: 24px; height:24px; display: block;');
                                    }}
                                />
                                <Typography sx={{ fontSize: '15px', fontWeight: 600 }}>Continue with Google</Typography>
                            </Box>
                            <Box
                                sx={{ ...styles.signinButton, marginTop: '15px' }}
                                onClick={() => handleOAuthLogin('azure')}
                            >
                                <ReactSVG
                                    src={IconSvg.office365Icon}
                                    beforeInjection={(svg) => {
                                        svg.setAttribute('style', 'width: 24px; height:24px; display: block;');
                                    }}
                                />
                                <Typography sx={{ fontSize: '15px', fontWeight: 600 }}>Continue with Microsoft</Typography>
                            </Box>
                        </Box>

                        <Button
                            sx={{ marginTop: '10px', width: '90px', height: '35px', border: '1px solid #0B51C5', borderRadius: '10px' }}
                            onClick={() => navigate('/login')}
                        >
                            <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#0B51C5' }}>
                                SIGN IN
                            </Typography>
                        </Button>

                        {/* <Box marginTop="20px" textAlign="center">
                            <Typography sx={{ fontSize: '13px', fontWeight: 400 }}>
                                By continuing, you are indicating that you accept our{" "}
                                <Link
                                    href={`${process.env.REACT_APP_AMEYA_WEBSITE_URL}/terms`}
                                    underline="always"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link
                                    href={`${process.env.REACT_APP_AMEYA_WEBSITE_URL}/privacy`}
                                    underline="always"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Privacy Policy
                                </Link>
                            </Typography>
                        </Box> */}

                    </Box>
                </Box>
            </Box>
        </Box >
    )
}

export default InviteSignIn