import React, { useEffect, useState } from 'react';
import { Box, IconButton, Typography, Tooltip } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import moment from 'moment';
import { useAppContext } from '../../context/AppContext';
import PaginationTable from '../../components/PaginationTable';
import getCostLogData from '../../utils/ApiFunctions/AppflyteCostLogs';
import { useDispatch, useSelector } from 'react-redux';
import { setCostUsageState } from '../../Redux/slice/dataSlice';

function Usage() {

  const dispatch = useDispatch();
  const { selectedOrganization } = useAppContext();
  const organization_id = selectedOrganization?.payload?.__auto_id__ ?? null;
  const cost_usages = useSelector(state => state.all_data.cost_usages)

  const [loading, setLoading] = useState(false);
  const [lastKey, setLastKey] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [costUsage, setCostUsage] = useState([]);

  useEffect(() => {
    fetchCostLogs("load")
    //eslint-disable-next-line
  }, [])

  const updateCostData = async (data = []) => {
    try {
      if (!Array.isArray(data)) return [];

      return [...data].sort((a, b) => {
        const dateA = new Date(a?.payload?.created_on || 0).getTime();
        const dateB = new Date(b?.payload?.created_on || 0).getTime();
        return dateB - dateA;
      });
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const fetchCostLogs = async (load_status) => {
    try {
      setLoading(true)

      if ((cost_usages || []).length > 0 && load_status === "load") {
        setCostUsage(cost_usages);
      }
      else {
        let currentKey = null;
        while (true) {

          const response = await getCostLogData(currentKey, organization_id);
          const responseData = response?.data ?? [];
          const lastEvaluatedKey = response?.lastEvaluatedKey ?? null;

          if (responseData.length > 0) {
            const updated_data = await updateCostData(responseData)
            setCostUsage(updated_data);
            setLastKey(lastEvaluatedKey);
            setHasMore(!!lastEvaluatedKey);
            dispatch(setCostUsageState(updated_data))
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
        const response = await getCostLogData(lastKey, organization_id);
        const newData = response?.data ?? [];
        const lastEvaluatedKey = response?.lastEvaluatedKey ?? null;
        const combined_data = [...costUsage, ...newData]
        const updated_data = await updateCostData(combined_data)
        setCostUsage(updated_data);
        dispatch(setCostUsageState(updated_data))
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
    setCostUsage([]);
    setLastKey(null);
    setHasMore(true);
    await fetchCostLogs("reload");
  };

  const serviceNames = {
    "ameya-extraction": "Extraction",
    "ameya-analytics": "Analytics"
  };

  const columns = [
    {
      id: 'file_names',
      label: 'File Name',
      sortable: true,
      filter: false,
      renderCell: (row) => {
        const files = row?.payload?.file_names || [];
        if (!files.length) return '-';
        const firstFile = files[0];
        return (
          <Tooltip
            title={
              <div>
                {files.map((name, file_index) => (
                  <div key={file_index}>{name}</div>
                ))}
              </div>
            }
            arrow
            placement="bottom"
          >
            <Typography
              sx={{
                maxWidth: 200,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                cursor: 'pointer',
              }}
            >
              {firstFile}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      id: 'payload.created_on',
      label: 'Date',
      type: 'date',
      sortable: true,
      filter: false,
      renderCell: (row) => moment(row?.payload?.created_on).format('DD-MMM-YYYY hh:mm A'),
    },
    {
      id: 'payload.cost_consumed',
      label: 'Cost Consumed',
      sortable: true,
      renderCell: (row) => row?.payload?.cost_consumed || 0,
    },
    {
      id: 'payload.service_type',
      label: 'Services',
      sortable: true,
      renderCell: (row) => serviceNames[row?.payload?.service_type] || row?.service_type || '-'
    },
    {
      id: 'payload.page_consumed',
      label: 'Total Pages',
      sortable: true,
      renderCell: (row) => row?.payload?.page_consumed || 0,
    }
  ];

  return (
    <Box>

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
          data={costUsage}
          columns={columns}
          loading={loading}
          onFetchNextPage={onFetchNextPage}
          hasMore={hasMore}
        />
      </Box>

    </Box>
  );
}

export default Usage;
