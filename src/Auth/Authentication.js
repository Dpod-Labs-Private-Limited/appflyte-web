import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

import { Box, Button, Link, Typography } from '@mui/material'
import { getStyles } from './Styles'
import { useTheme } from '@mui/material/styles';
import { ReactSVG } from "react-svg";

import ameya_logo from "../images/ameya_logo.png"
import { IconSvg } from '../utils/globalIcons';
import { useDispatch } from 'react-redux';
import { decodeParamToken } from '../utils';
import { useAppContext } from '../context/AppContext';
import { tostAlert } from '../utils/AlertToast';

function Authentication() {

    const theme = useTheme();
    const styles = getStyles(theme);
    const navigate = useNavigate()
    const location = useLocation();
    const dispatch = useDispatch();
    const { updateAuthData } = useAppContext();
    const [requestType, setRequestType] = useState('signin')

    const appName = process.env.REACT_APP_NAME
    const authServerUrl = process.env.REACT_APP_OAUTH_SERVER_URL
    const schemaId = process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID

    const handleOAuthLogin = (authProvider) => {
        try {

            localStorage.clear()
            sessionStorage.clear()
            dispatch({ type: 'RESET_ALL' });

            const redirectTo = location.state?.from || "/";
            const url = new URL(redirectTo, window.location.origin);

            const externalRequestType = url.searchParams.get("request_type");
            const fileId = url.searchParams.get("file_id");
            const documentType = url.searchParams.get("document_type");
            const creditBundleId = url.searchParams.get("credit_bundle_id");
            const computedToken = decodeParamToken(fileId, documentType);
            const encodedToken = url.searchParams.get("token");

            const params = new URLSearchParams({
                app_name: appName,
                schema_id: schemaId,
                auth_provider: authProvider,
                request_type: requestType
            });

            if (computedToken === encodedToken) {
                params.append("user_file_id", fileId);
                params.append("document_type", documentType);
                params.append("user_auth_type", "external_ameya_auth")
            }

            if (externalRequestType === "external_ameya_stripe" && creditBundleId) {
                params.append("user_auth_type", "external_ameya_stripe")
                params.append("credit_bundle_id", creditBundleId)
            }

            const authUrlWithParams = `${authServerUrl}/user_auth?${params.toString()}`;
            const popup = window.open(authUrlWithParams, "oauthPopup", "width=500,height=600");
            const interval = setInterval(() => {
                if (popup.closed) {
                    clearInterval(interval);
                    console.log("Popup closed");
                }
            }, 1000);

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

            const isExternal = authResponse?.is_external ?? false;
            const authRequestType = authResponse?.request_type ?? null;
            const userAuthType = authResponse?.user_auth_type ?? null;
            const organizationId = authResponse?.organization_id ?? null;

            const userFileId = authResponse?.file_id ?? null;
            const documentType = authResponse?.document_type ?? null;
            const creditBundleId = authResponse?.credit_bundle_id ?? null;

            const decoded_dpod_token = jwtDecode(dpodToken);
            const app_subscribed = decoded_dpod_token?.app_subscribed ?? [];
            const user_name = decoded_dpod_token?.user_name;

            if (app_subscribed.length > 0 && app_subscribed.includes(appName)) {

                localStorage.setItem('dpod-token', JSON.stringify(dpodToken));
                localStorage.setItem('refresh-token', JSON.stringify(refreshToken));
                localStorage.setItem('UserName', JSON.stringify(user_name));

                const isExternalUser = isExternal === "True";
                const isSignin = authRequestType === "signin";
                const isSignup = authRequestType === "signup";
                const hasFileData = userFileId && documentType;

                if (isExternalUser && hasFileData) {

                    if (isSignin) {
                        updateAuthData({
                            request_type: "ext_user_signin",
                            user_auth_type: userAuthType,
                            file_id: userFileId,
                            document_type: documentType
                        });

                        navigate("/home");
                        return;
                    }

                    if (isSignup && organizationId) {
                        updateAuthData({
                            request_type: "ext_user_signup",
                            user_auth_type: userAuthType,
                            organization_id: organizationId,
                            file_id: userFileId,
                            document_type: documentType
                        });

                        navigate("/onboarding", { state: { from: "login" } });
                        return;
                    }
                }

                updateAuthData({
                    request_type: "direct_user",
                    user_auth_type: userAuthType,
                    credit_bundle_id: creditBundleId
                });

                navigate("/home");

            } else {
                tostAlert("You do not have access to this application.", "error");
                localStorage.clear();
            }
        } catch (error) {
            console.error('Error decoding Token:', error);
            if (location.pathname !== '/invite-login' && location.pathname !== '/root-user') {
                navigate('/login');
            }
            localStorage.clear()
        }
    };

    return (
        <Box sx={styles.mainContainer}>
            <Box sx={styles.body}>
                <Box sx={styles.signinContainer}>
                    <Box padding={'20px'} display={'flex'} alignItems={'center'} flexDirection={'column'}>
                        <img src={ameya_logo} alt='ameya_logo' style={{ height: '68px', width: '200px' }} />
                        <Typography sx={{ fontSize: '18px', fontWeight: 600, marginTop: '10px' }}>Welcome to Ameya AI Cloud</Typography>

                        {requestType === "signin"
                            ?
                            (<Typography sx={{ fontSize: '15px', fontWeight: 500, marginTop: '10px' }}>Sign in to your Ameya account</Typography>)
                            :
                            (<Typography sx={{ fontSize: '15px', fontWeight: 500, marginTop: '10px' }}>Create an account to get started</Typography>)
                        }

                        <Box marginTop={'20px'}>
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
                                <Typography sx={{ fontSize: '15px', fontWeight: 600 }}>
                                    {requestType === 'signin' ? 'Sign in with Google' : 'Continue with Google'}
                                </Typography>
                            </Box>
                            <Box
                                sx={{ ...styles.signinButton, marginTop: '20px' }}
                                onClick={() => handleOAuthLogin('azure')}
                            >
                                <ReactSVG
                                    src={IconSvg.office365Icon}
                                    beforeInjection={(svg) => {
                                        svg.setAttribute('style', 'width: 24px; height:24px; display: block;');
                                    }}
                                />
                                <Typography sx={{ fontSize: '15px', fontWeight: 600 }}>
                                    {requestType === 'signin' ? 'Sign in with Microsoft' : 'Continue with Microsoft'}
                                </Typography>
                            </Box>
                        </Box>

                        <Box marginTop={'30px'} display={'flex'} flexDirection={'column'} alignItems={'center'}>
                            <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>
                                {requestType === 'signin' ? '  Don’t have an account?' : 'Already have an account?'}
                            </Typography>
                            <Button
                                sx={{ marginTop: '5px', width: '90px', height: '35px', border: '1px solid #0B51C5', borderRadius: '10px' }}
                                onClick={() => setRequestType(prev => (prev === 'signin' ? 'signup' : 'signin'))}
                            >
                                <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#0B51C5' }}>
                                    {requestType === 'signin' ? 'SIGN UP' : 'SIGN IN'}
                                </Typography>
                            </Button>
                        </Box>

                        <Typography
                            sx={styles.linkText}
                            onClick={() => navigate('/root-user')}
                        >
                            Sign in using root user email
                        </Typography>

                        <Box marginTop="20px" textAlign="center">
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
                        </Box>

                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default Authentication;