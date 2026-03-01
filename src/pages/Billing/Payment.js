import React, { useEffect, useState } from 'react'
import { Typography, Box, Button, IconButton, Tooltip } from '@mui/material';
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
import { Refresh } from '@mui/icons-material';

function Payment() {

    const theme = useTheme();
    const styles = getStyles(theme);

    const [loading, setLoading] = useState(false)
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(false)
    const [creditBundlesData, setCreditBundlesData] = useState([])
    const { selectedOrganization, authData, initialAuthData, updateAuthData } = useAppContext();
    const { apiBalance, projectBalance } = useCredit();

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
            const schema_id = process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID ?? null;

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
                    schema_id: schema_id,
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

    const activeLevel = Number(creditBundlesData.find(p => p.payload.active_plan)?.payload?.level || 0);

    const columns = [
        {
            id: 'payload.display_name',
            label: 'Bundle',
            sortable: false,
            renderCell: (row) => (<Typography sx={{ fontWeight: 600 }}>{row?.payload?.display_name}</Typography>)
        },
        {
            id: 'payload.projects',
            label: 'Projects',
            sortable: false,
            renderCell: (row) => row?.payload?.projects
        },
        {
            id: 'payload.api_calls',
            label: 'API Requests/mo',
            sortable: false,
            renderCell: (row) => formatCompact(Number(row?.payload?.api_calls || 0))
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
            id: '',
            label: '',
            sortable: false,
            renderCell: (row) => {
                const rowLevel = Number(row?.payload?.level);

                if (row?.payload?.active_plan) {
                    return <Button disabled>Current Plan ✅</Button>;
                }

                if (rowLevel > activeLevel) {
                    return (
                        <Button
                            onClick={() => handleContinue(row)}
                            disabled={loading || paymentLoading}
                        >
                            Upgrade
                        </Button>
                    );
                }

                return <Typography textAlign={'start'}>—</Typography>;
            }
        }
    ]

    const formatCompact = (value) => {
        return new Intl.NumberFormat('en', {
            notation: 'compact',
            maximumFractionDigits: 1,
        }).format(value);
    };

    return (<Box mt={5}>

        {(paymentLoading || dataLoading) && <LoadBar />}

        <Box>
            <Typography sx={{ ...styles.paraText }}>Api balance</Typography>
            <Typography sx={{ ...styles.creditText }}>
                {formatCompact(Number(apiBalance || 0))}
            </Typography>
        </Box>

        <Box mt={2}>
            <Typography sx={{ ...styles.paraText }}>Project balance</Typography>
            <Typography sx={{ ...styles.creditText }}>{Number(projectBalance || 0).toFixed(0)}</Typography>
        </Box>


        {!loading &&
            <Box sx={{ marginTop: '5px', marginBottom: '10px', display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                <Tooltip
                    title="Reload"
                    arrow
                    placement="bottom"
                >
                    <IconButton onClick={fetchCreditBundless}>
                        <Refresh />
                    </IconButton>
                </Tooltip>
            </Box>
        }

        <Box marginTop={loading ? '40px' : '5px'}>
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
