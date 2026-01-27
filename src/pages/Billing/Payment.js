import React, { useEffect, useState } from 'react'
import { Typography, Box, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAppContext } from '../../context/AppContext'
import AppflyteTransactionApi from '../../Api/Services/AppflyteBackend/AppflyteTransactionApi';

import LoadBar from '../../utils/LoadBar';
import { tostAlert } from '../../utils/AlertToast';
import { apiErrorHandler } from '../../utils/ApiErrorHandler';
import {
    fetchAccountId, fetchSubscriberId, fetchSubscriptionId,
    fetchUserEmail, fetchUserId
} from '../../utils/GetAccountDetails';

import GeneralTable from '../../components/GeneralTable'
import { useCredit } from '../../context/CreditContext';
import { getStyles } from './styles';

function Payment() {

    const theme = useTheme();
    const styles = getStyles(theme);

    const [loading, setLoading] = useState(false)
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(false)
    const [creditBundlesData, setCreditBundlesData] = useState([])
    const { selectedOrganization, authData, initialAuthData, updateAuthData } = useAppContext();
    const { credit } = useCredit();

    useEffect(() => {
        fetchAll()
        //eslint-disable-next-line
    }, [])

    const fetchAll = async () => {
        setDataLoading(true)
        try {

            const bundle_data = await fetchCreditBundless()
            const userAuthType = authData?.user_auth_type ?? null;
            const creditBundleId = authData?.credit_bundle_id ?? null;

            if (creditBundleId && userAuthType) {
                updateAuthData(initialAuthData);
                const filtered_bundle = (bundle_data || [])?.find(item => item?.payload?.__auto_id__ === creditBundleId)
                handleContinue(filtered_bundle)
            }

        } catch (error) {
            console.log(error)
        } finally {
            setDataLoading(false)
        }
    }

    const fetchCreditBundless = async () => {
        setLoading(true)
        try {
            const organization_id = selectedOrganization?.payload?.__auto_id__ ?? null;
            const credit_bundles = await AppflyteTransactionApi.getCreditBundles(organization_id);
            if (credit_bundles.status === 200) {
                const credit_bundles_data = credit_bundles?.data ?? [];
                const sortedData = [...credit_bundles_data].sort((a, b) => (a?.payload?.sort_order ?? 0) - (b?.payload?.sort_order ?? 0));
                setCreditBundlesData(sortedData);
                return sortedData
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleContinue = async (item) => {
        setPaymentLoading(true);

        try {
            const { payload } = item || {};
            const credit_bundle_id = payload?.__auto_id__ ?? null;
            const display_name = payload?.display_name ?? null;
            const organization_id = selectedOrganization?.payload?.__auto_id__ ?? null

            const [email_id, user_id, account_id, subscriber_id, subscription_id] = await Promise.all([
                fetchUserEmail(),
                fetchUserId(),
                fetchAccountId(),
                fetchSubscriberId(),
                fetchSubscriptionId(),
            ]);

            const reqObj = { account_id, subscriber_id, subscription_id, organization_id, credit_bundle_id };

            if (display_name === "Free") {
                const response = await AppflyteTransactionApi.getFreeCredit(reqObj);
                if (response.status === 200) {
                    tostAlert("Your free credit has been successfully applied!", 'success');
                    fetchCreditBundless()
                };
            }
            else {
                const sessionReqObj = {
                    ...reqObj,
                    success_url: `${process.env.REACT_APP_AMEYA_WEB_URL}/user/billing`,
                    cancel_url: `${process.env.REACT_APP_AMEYA_WEB_URL}/user/billing`,
                    user_id,
                    email_id
                };
                const response = await AppflyteTransactionApi.createSession(sessionReqObj);

                if (response.status === 200) {
                    const { checkout_url } = response.data ?? {};
                    if (checkout_url) window.location.href = checkout_url;
                } else {
                    tostAlert('Error While Recharge', 'error');
                }
            }

        } catch (error) {
            console.error(error);
            apiErrorHandler(error);
        } finally {
            setPaymentLoading(false);
        }
    };

    const columns = [
        {
            id: 'payload.display_name',
            label: 'Bundle',
            sortable: false,
            renderCell: (row) => (<Typography sx={{ fontWeight: 600 }}>{row?.payload?.display_name}</Typography>)
        },
        {
            id: 'payload.credits',
            label: 'Credits',
            sortable: false,
            renderCell: (row) => row?.payload?.credits
        },
        {
            id: 'payload.price_in_dollar',
            label: 'Price',
            sortable: false,
            renderCell: (row) => (
                <Typography sx={{ fontWeight: 600 }}>
                    {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                    }).format(row?.payload?.price_in_dollar ?? 0)}
                </Typography>
            )
        },
        {
            id: 'payload.price_per_credit_dollar',
            label: 'Per Credit',
            sortable: false,
            renderCell: (row) =>
                new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                }).format(row?.payload?.price_per_credit_dollar ?? 0)
        },
        {
            id: '',
            label: '',
            sortable: false,
            renderCell: (row) => (
                <Button
                    sx={{ textDecoration: 'none', textTransform: 'none', '&:hover': { textDecoration: 'underline' } }}
                    onClick={() => handleContinue(row)}
                    disabled={loading || paymentLoading}
                >
                    Buy Now
                </Button>
            )
        }
    ]

    return (<Box mt={5}>

        {(paymentLoading || dataLoading) && <LoadBar />}

        <Typography sx={{ ...styles.paraText }}>Credit balance</Typography>

        <Box display={'flex'} alignItems={'center'} gap={'10px'}>
            <Typography sx={{ ...styles.creditText }}>
                {Number(credit || 0).toFixed(2)}
            </Typography>
        </Box>

        <Box marginTop={'15px'}>
            <GeneralTable
                columns={columns}
                loading={loading || dataLoading}
                data={creditBundlesData}
            />
        </Box>

    </Box>
    )
}

export default Payment
