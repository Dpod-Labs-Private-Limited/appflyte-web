import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { getStyles } from './styles';
import LoadBar from '../../utils/LoadBar';

import { useIntl } from 'react-intl';
import messages from './messages';

import HmacSHA256 from "crypto-js/hmac-sha256";
import Hex from "crypto-js/enc-hex";
import { useAppContext } from '../../context/AppContext';
const SECRET_KEY = "DPOD_AMEYA_2.0_AUTH_KEY";

function HomeLayout() {

    const theme = useTheme();
    const styles = getStyles(theme);
    const navigate = useNavigate();
    const intl = useIntl();
    const location = useLocation();
    const loading = true

    const { updateAuthData } = useAppContext();

    useEffect(() => {
        handleSetup();
    }, [navigate]);

    const handleSetup = async () => {
        try {

            const queryParams = new URLSearchParams(location.search)

            const externalRequestType = queryParams.get("request_type");
            const encodedToken = queryParams.get("token");

            const fileId = queryParams.get("file_id");
            const documentType = queryParams.get("document_type");
            const creditBundleId = queryParams.get("credit_bundle_id");

            if (encodedToken && fileId && documentType && externalRequestType === "external_ameya_auth") {
                const data = `${fileId}${documentType}`;
                const computedToken = HmacSHA256(data, SECRET_KEY).toString(Hex);
                if (computedToken === encodedToken) {
                    updateAuthData({ file_id: fileId, document_type: documentType, request_type: "ext_existing_user" });
                    navigate("/home")
                } else {
                    navigate("/home")
                }
            } else {
                const payload = {
                    request_type: "direct_user",
                    ...(externalRequestType === "external_ameya_stripe" && creditBundleId && {
                        user_auth_type: externalRequestType,
                        credit_bundle_id: creditBundleId,
                    }),
                };
                updateAuthData(payload);
                navigate("/home")
            }
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