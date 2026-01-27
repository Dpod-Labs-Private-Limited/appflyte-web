import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material'
import { Refresh } from '@mui/icons-material';

import FilesApi from '../../Api/Services/AppflyteBackend/FileServiceApi';
import { apiErrorHandler } from '../../utils/ApiErrorHandler';
import LoadBar from '../../utils/LoadBar';
import { setStripeTransactionsState } from '../../Redux/slice/dataSlice';
import { useAppContext } from '../../context/AppContext';
import getTransactionsData from '../../utils/ApiFunctions/AppflyteTransactions';
import PaginationTable from '../../components/PaginationTable';

dayjs.extend(customParseFormat);

function History() {

    const dispatch = useDispatch();
    const { selectedOrganization } = useAppContext();
    const stripe_transactions = useSelector(state => state.all_data.stripe_transactions)
    const organization_id = selectedOrganization?.payload?.__auto_id__ ?? null;

    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(false);
    const [lastKey, setLastKey] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [billingHistory, setBillingHistory] = useState([])

    useEffect(() => {
        fetchTransactionData("load")
    }, [])

    const updateTransactionsData = async (data) => {
        try {
            const formattedResponse = data.map(tx => {
                const parsedDate = dayjs(tx.payload.created_on, "DD-MM-YYYY HH:mm:ss");
                return {
                    ...tx,
                    payload: {
                        ...tx.payload,
                        created_on: parsedDate.isValid() ? parsedDate.toISOString() : tx.payload.created_on
                    }
                };
            });

            const sortedTransactions = [...formattedResponse].sort((a, b) => {
                return dayjs(b.payload.created_on).valueOf() - dayjs(a.payload.created_on).valueOf();
            });
            return sortedTransactions;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const fetchTransactionData = async (load_status) => {
        try {
            setLoading(true)

            if ((stripe_transactions || [])?.length > 0 && load_status === "load") {
                setBillingHistory(stripe_transactions);
            }
            else {

                let currentKey = null;
                while (true) {

                    const response = await getTransactionsData(currentKey, organization_id);
                    const responseData = response?.data ?? [];
                    const lastEvaluatedKey = response?.lastEvaluatedKey ?? null;

                    if (responseData.length > 0) {
                        const updated_data = await updateTransactionsData(responseData)
                        setBillingHistory(updated_data);
                        setLastKey(lastEvaluatedKey);
                        setHasMore(!!lastEvaluatedKey);
                        dispatch(setStripeTransactionsState(updated_data))
                        return updated_data;
                    }
                    else if (lastEvaluatedKey) {
                        currentKey = lastEvaluatedKey;
                        continue;
                    }
                    else {
                        setHasMore(false);
                        return [];
                    }
                }
            }
        } catch (error) {
            console.log(error);
            return []
        } finally {
            setLoading(false)
        }
    }

    const onFetchNextPage = async () => {
        if (hasMore) {
            setLoading(true);
            try {
                const response = await getTransactionsData(lastKey, organization_id);
                const newData = response?.data ?? [];
                const lastEvaluatedKey = response?.lastEvaluatedKey ?? null;
                const combined_data = [...billingHistory, ...newData]
                const updated_data = await updateTransactionsData(combined_data)
                setBillingHistory(updated_data);
                dispatch(setStripeTransactionsState(updated_data))
                setLastKey(lastEvaluatedKey);
                if (!lastEvaluatedKey) setHasMore(false);

            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleReload = async () => {
        setBillingHistory([]);
        setLastKey(null);
        setHasMore(true);
        await fetchTransactionData("reload");
    };

    const handlePreview = async (item) => {
        setDataLoading(true);
        try {
            const receipt_url = item?.payload?.receipt_url ?? null;
            if (receipt_url) {
                window.open(receipt_url, "_blank");
                return;
            }

            const file_id = item?.payload?.file_id ?? null;
            const response = await FilesApi.getFilesById(file_id);

            if (response.status === 200) {
                const responseData = response.data ?? {};
                const advancedData = responseData?.payload?.advanced ?? {};
                const object_path = advancedData?.object_path ?? null;
                const bucket_name = advancedData?.bucket_name ?? null;

                const url_response = await FilesApi.getAmeyaDownloadUrl(bucket_name, object_path);
                if (url_response.status === 200) {
                    const url_res_data = url_response.data ?? [];
                    const latest_url = url_res_data?.at(-1);
                    const lastValue = Object.values(latest_url)?.at(-1);
                    window.open(lastValue, "_blank");
                }
            }

        } catch (error) {
            console.log(error);
            apiErrorHandler(error);
        } finally {
            setDataLoading(false);
        }
    };

    const statusCheck = {
        succeeded: "Paid",
        failed: "Error"
    };

    const columns = [
        {
            id: 'payload.transaction_id',
            label: 'Invoice',
            sortable: true,
            filter: false,
            renderCell: (row) => row?.payload?.transaction_id
        },
        {
            id: 'payload.status',
            label: 'Status',
            sortable: true,
            filter: false,
            renderCell: (row) => {
                const status = statusCheck[row?.payload?.status] || row?.payload?.status;
                const isError = status?.toLowerCase() === 'error';
                return (
                    <span style={{ color: isError ? 'red' : 'inherit' }}>
                        {status}
                    </span>
                );
            }
        },
        {
            id: 'payload.amount',
            label: 'Amount',
            sortable: true,
            filter: false,
            renderCell: (row) => (
                <Box>
                    <span>$ </span>{row?.payload?.amount}
                </Box>
            )
        },
        {
            id: 'payload.created_on',
            label: 'Created On',
            sortable: true,
            filter: false,
            renderCell: (row) => moment(row?.payload?.created_on, ["DD-MM-YYYY HH:mm:ss", moment.ISO_8601]).format("DD-MMM-YYYY hh:mm A")
        },
        {
            id: '',
            label: '',
            sortable: true,
            filter: false,
            renderCell: (row) => (
                <Button disabled={dataLoading} onClick={() => handlePreview(row)}>
                    <Typography sx={{ fontSize: '14px', fontWeight: '400', color: '#0B51C5', '&:hover': { textDecoration: 'underline' } }}>
                        View
                    </Typography>
                </Button>)
        }
    ]

    return (
        <Box>

            {dataLoading && <LoadBar />}

            {!loading &&
                <Box sx={{ marginTop: '5px', marginBottom: '10px', display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                    <Tooltip
                        title="Reload"
                        arrow
                        placement="bottom"
                    >
                        <IconButton onClick={handleReload}>
                            <Refresh />
                        </IconButton>
                    </Tooltip>
                </Box>
            }

            <Box marginTop={loading ? '30px' : '10px'}>
                <PaginationTable
                    data={billingHistory}
                    columns={columns}
                    loading={loading}
                    onFetchNextPage={onFetchNextPage}
                    hasMore={hasMore}
                />
            </Box>


        </Box>
    )
}

export default History