import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

import { Box, Button, Link, Typography } from '@mui/material'
import { getStyles } from './Styles'
import { useTheme } from '@mui/material/styles';
import { ReactSVG } from "react-svg";

import appflyte_logo from "../images/appflyte_logo.svg";
import { IconSvg } from '../utils/globalIcons';
import { useAppContext } from '../context/AppContext';
import { tostAlert } from '../utils/AlertToast';
import { UTIL_CONFIG } from '../utils';

function Authentication() {

    const theme = useTheme();
    const styles = getStyles(theme);
    const navigate = useNavigate()
    const location = useLocation();
    const { updateAuthData, initialAuthData } = useAppContext();
    const [requestType, setRequestType] = useState('signin')
    const [authStep, setAuthStep] = useState("select");

    const appName = process.env.REACT_APP_NAME
    const authServerUrl = process.env.REACT_APP_OAUTH_SERVER_URL
    const schemaId = process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID

    const handleOAuthLogin = (authProvider) => {
        try {

            const params = new URLSearchParams({
                app_name: appName,
                schema_id: schemaId,
                auth_provider: authProvider,
                request_type: requestType
            });

            const externalParams = sessionStorage.getItem("externalParams")
            if (externalParams) {
                const external_params = new URLSearchParams(externalParams);
                const userType = external_params.get("user_type");
                const requestType = external_params.get("request_type");
                userType === UTIL_CONFIG.EXT_USER_TYPE && params.append("user_auth_type", requestType)
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

            const decoded_dpod_token = jwtDecode(dpodToken);
            const app_subscribed = decoded_dpod_token?.app_subscribed ?? [];
            const user_name = decoded_dpod_token?.user_name;

            if (app_subscribed?.length > 0 && app_subscribed.includes(appName)) {

                localStorage.setItem('dpod-token', JSON.stringify(dpodToken));
                localStorage.setItem('refresh-token', JSON.stringify(refreshToken));
                localStorage.setItem('UserName', JSON.stringify(user_name));

                const isExternalUser = Boolean(authResponse?.is_external === "True");
                const authRequestType = authResponse?.request_type ?? null;
                const organizationId = authResponse?.organization_id ?? null;

                const isSignin = authRequestType === "signin";
                const isSignup = authRequestType === "signup";
                const externalParams = sessionStorage.getItem("externalParams");

                if (isExternalUser && externalParams) {

                    const externalParamsObj = new URLSearchParams(externalParams);
                    const externalUserType = externalParamsObj.get("user_type");
                    const externalRequestType = externalParamsObj.get("request_type");
                    const serviceType = externalParamsObj.get("service_type");
                    const billingPeriodType = externalParamsObj.get("billing_period_type");
                    const isSupportedService = Boolean(serviceType && UTIL_CONFIG.SUPPORTED_SERVICES.includes(serviceType));
                    const isSupportedBillingPeriod = Boolean(billingPeriodType && UTIL_CONFIG.SUPPORTED_BILLING_PERIODS.includes(billingPeriodType));

                    if (externalUserType === UTIL_CONFIG.EXT_USER_TYPE) {

                        if (externalRequestType === UTIL_CONFIG.USER_REQUEST && isSupportedService) {
                            updateAuthData({
                                user_type: UTIL_CONFIG.EXT_USER_TYPE,
                                request_type: UTIL_CONFIG.USER_REQUEST,
                                collection_service_type: serviceType,
                                organization_id: organizationId
                            });
                        } else if (externalRequestType === UTIL_CONFIG.STRIPE_REQUEST && isSupportedBillingPeriod) {
                            updateAuthData({
                                user_type: UTIL_CONFIG.EXT_USER_TYPE,
                                request_type: UTIL_CONFIG.STRIPE_REQUEST,
                                billing_period_type: billingPeriodType,
                                organization_id: organizationId
                            });
                        } else {
                            updateAuthData(initialAuthData);
                        }

                    } else {
                        updateAuthData(initialAuthData);
                    }

                    sessionStorage.removeItem("externalParams");

                    if (isSignin) {
                        navigate("/home");
                        return;
                    }

                    if (isSignup && organizationId) {
                        navigate("/onboarding", { state: { from: "login" } });
                        return;
                    }

                }

                updateAuthData(initialAuthData);
                navigate("/home");
            }
            else {
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
                        <img src={appflyte_logo} alt='appflyte_logo' style={{ height: '68px', width: '200px' }} />
                        <Typography sx={{ fontSize: '18px', fontWeight: 600, marginTop: '10px' }}>Welcome to Appflyte</Typography>

                        {authStep === "select" && (
                            <Box marginTop="30px" display="flex" flexDirection="column" gap={2}>
                                <Button
                                    sx={{
                                        marginTop: '5px', width: '100px', height: '35px',
                                        borderRadius: '10px',
                                        backgroundColor: "#0B51C5", color: '#FFFFFF'
                                    }}
                                    onClick={() => {
                                        setRequestType("signin");
                                        setAuthStep("provider");
                                    }}
                                >
                                    <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>
                                        SIGN IN
                                    </Typography>
                                </Button>

                                <Button
                                    sx={{
                                        marginTop: '5px', width: '100px', height: '35px',
                                        border: '1px solid #0B51C5', borderRadius: '10px',
                                        backgroundColor: "#FFFFFF"
                                    }}
                                    onClick={() => {
                                        setRequestType("signup");
                                        setAuthStep("provider");
                                    }}
                                >
                                    <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#0B51C5' }}>
                                        SIGN UP
                                    </Typography>
                                </Button>
                            </Box>
                        )}

                        <Box marginTop={'30px'} display={'flex'} flexDirection={'column'} alignItems={'center'}>
                            {authStep === "provider" && (
                                <>
                                    <Typography sx={{ fontSize: '15px', fontWeight: 500, marginTop: '10px' }}>
                                        {requestType === 'signin' ? 'Sign in to your Appflyte account' : 'Create an account to get started'}
                                    </Typography>

                                    <Box marginTop={'20px'}>
                                        {/* Google */}
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

                                        {/* Microsoft */}
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

                                    <Button
                                        sx={{ marginTop: 3 }}
                                        onClick={() => setAuthStep("select")}
                                    >
                                        Back
                                    </Button>
                                </>
                            )}
                        </Box>

                        {/* <Typography
                            sx={styles.linkText}
                            onClick={() => navigate('/root-user')}
                        >
                            Sign in to root user account
                        </Typography> */}

                        <Box marginTop="10px" textAlign="center">
                            <Typography sx={{ fontSize: '13px', fontWeight: 400 }}>
                                By continuing, you are indicating that you accept our{" "}
                                <Link
                                    href={`${process.env.REACT_APP_APPFLYTE_WEBSITE_URL}/terms-of-service`}
                                    underline="always"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link
                                    href={`${process.env.REACT_APP_APPFLYTE_WEBSITE_URL}/privacy-policy`}
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