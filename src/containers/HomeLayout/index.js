import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { getStyles } from './styles';
import LoadBar from '../../utils/LoadBar';

import { useIntl } from 'react-intl';
import messages from './messages';
import { useAppContext } from '../../context/AppContext';
import { UTIL_CONFIG } from '../../utils';

function HomeLayout() {

    const theme = useTheme();
    const styles = getStyles(theme);
    const navigate = useNavigate();
    const intl = useIntl();
    const location = useLocation();
    const loading = true
    const { updateAuthData, initialAuthData } = useAppContext();

    useEffect(() => {
        handleSetup();
    }, [navigate]);

    const handleSetup = async () => {
        try {

            const queryParams = new URLSearchParams(location.search)
            const externalUserType = queryParams.get("user_type");
            const externalRequestType = queryParams.get("request_type");
            const serviceType = queryParams.get("service_type");
            const serviceMessage = queryParams.get("service_message");
            const billingPeriodType = queryParams.get("billing_period_type");
            const isSupportedService = Boolean(serviceType && UTIL_CONFIG.SUPPORTED_SERVICES.includes(serviceType));
            const isSupportedBillingPeriod = Boolean(billingPeriodType && UTIL_CONFIG.SUPPORTED_BILLING_PERIODS.includes(billingPeriodType));

            if (externalUserType === UTIL_CONFIG.EXT_USER_TYPE) {

                if (externalRequestType === UTIL_CONFIG.USER_REQUEST && isSupportedService) {
                    updateAuthData({
                        user_type: UTIL_CONFIG.EXT_USER_TYPE,
                        request_type: UTIL_CONFIG.USER_REQUEST,
                        collection_service_type: serviceType,
                        service_message: serviceMessage
                    });
                } else if (externalRequestType === UTIL_CONFIG.STRIPE_REQUEST && isSupportedBillingPeriod) {
                    updateAuthData({
                        user_type: UTIL_CONFIG.EXT_USER_TYPE,
                        request_type: UTIL_CONFIG.STRIPE_REQUEST,
                        billing_period_type: billingPeriodType
                    });
                } else {
                    updateAuthData(initialAuthData);
                }

            } else {
                updateAuthData(initialAuthData);
            }

            navigate("/home");

        } catch (err) {
            console.error("Failed to process request_type:", err);
        }
    };

    const message = loading ? intl.formatMessage(messages.loading)
        :
        (<Typography sx={{ ...styles.infoText, color: '#999' }}>
            {intl.formatMessage(messages.error)}
        </Typography>)

    return (
        <Box style={styles.mainContainer}>
            {loading && <LoadBar />}
            <Box sx={{ ...styles.cardContainer }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography sx={styles.infoText}>
                        {message}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}

export default HomeLayout;