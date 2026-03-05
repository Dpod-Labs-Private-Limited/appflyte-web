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
import { UTIL_CONFIG } from '../../utils';

function Payment() {

    const theme = useTheme();
    const styles = getStyles(theme);

    const [loading, setLoading] = useState(false)
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(false)
    const [creditBundlesData, setCreditBundlesData] = useState([])
    const { selectedOrganization, authData, initialAuthData, updateAuthData } = useAppContext();
    const { apiBalance, projectBalance } = useCredit();

    const [selected, setSelected] = useState("month");

    useEffect(() => {
        fetchAll()
        //eslint-disable-next-line
    }, [])

    const fetchAll = async () => {
        setDataLoading(true)
        try {

            const billingPeriodType = authData?.billing_period_type ?? null;
            const isSupportedBillingPeriod = Boolean(billingPeriodType && UTIL_CONFIG.SUPPORTED_BILLING_PERIODS.includes(billingPeriodType));
            if (isSupportedBillingPeriod) {
                billingPeriodType === "monthly" ? setSelected("month") : setSelected("year")
                updateAuthData(initialAuthData)
            }
            await fetchCreditBundless()
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
                    email_id,
                    plan_period: selected
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

    const baseColumns = [
        {
            id: 'payload.display_name',
            label: 'Plan',
            sortable: false,
            renderCell: (row) => (<Typography sx={{ fontWeight: 600 }}>{row?.payload?.display_name}</Typography>)
        },
        {
            id: 'payload.features.projects',
            label: 'Projects',
            sortable: false,
            renderCell: (row) => row?.payload?.features?.projects
        },
        {
            id: 'payload.features.api_calls',
            label: 'API Requests/mo',
            sortable: false,
            renderCell: (row) => formatCompact(Number(row?.payload?.features?.api_calls || 0))
        },
        {
            id: 'price',
            label: selected === "year" ? 'Price (Yearly)' : 'Price',
            sortable: false,
            renderCell: (row) => {
                const pricing = row?.payload?.pricing?.[
                    selected === "month" ? "monthly" : "yearly"
                ];

                if (!pricing) return "—";

                const total = Number(pricing.billing_total || 0);

                return (
                    <Typography sx={{ fontWeight: 600 }}>
                        {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: pricing.currency || 'USD',
                        }).format(total)}
                    </Typography>
                );
            }
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

    if (selected === "year") {
        baseColumns.splice(4, 0, {
            id: 'monthly_equivalent',
            label: 'Monthly Equivalent',
            sortable: false,
            renderCell: (row) => {
                const yearly = row?.payload?.pricing?.yearly;
                if (!yearly) return "—";

                return (
                    <Typography>
                        {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: yearly.currency || 'USD',
                        }).format(Number(yearly.price_per_month))}
                        /mo
                    </Typography>
                );
            }
        });
    }

    const columns = baseColumns;

    const filteredBundles = creditBundlesData.filter(bundle => {
        const pricing = bundle?.payload?.pricing || {};
        return pricing[selected === "month" ? "monthly" : "yearly"];
    });

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

        <Box marginTop={loading ? '40px' : '5px'} display={'flex'} justifyContent={'center'}>
            <div style={styles.wrapper}>
                <div
                    style={{
                        ...styles.slider,
                        transform: selected === "year"
                            ? "translateX(100%)"
                            : "translateX(0%)",
                    }}
                />

                <button
                    style={{
                        ...styles.button,
                        color: selected === "month" ? "#fff" : "#333",
                    }}
                    onClick={() => setSelected("month")}
                >
                    Month
                </button>

                <button
                    style={{
                        ...styles.button,
                        color: selected === "year" ? "#fff" : "#333",
                    }}
                    onClick={() => setSelected("year")}
                >
                    Year&nbsp;&nbsp;
                    <span
                        style={{
                            fontSize: '10px', padding: '5px', color: '#0ce04c',
                            backgroundColor: '#ffffff', borderRadius: '10px'
                        }}
                    >
                        Save 20%
                    </span>
                </button>
            </div>
        </Box>

        <Box marginTop={'10px'} >
            <GeneralTable
                columns={columns}
                loading={loading || dataLoading}
                data={filteredBundles}
            />
        </Box>

    </Box>
    )
}

export default Payment
