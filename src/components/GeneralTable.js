import React, { useEffect, useState } from 'react';
import {
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel,
    Box, Pagination, Select, MenuItem, Typography, CircularProgress, IconButton, Popover, FormControl, Button
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { FilterAlt, FilterAltOff } from '@mui/icons-material';
import { getComponentsStyles } from '../styles/componentsStyles';
import { tableStyles } from '../styles/tableStyles';

const GeneralTable = ({ data, columns, rowsPerPageOptions = [5, 10, 20, 50], defaultRowsPerPage = 20, loading = false }) => {

    const theme = useTheme();
    const componentsStyles = getComponentsStyles(theme);

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState(columns[0].id);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
    const [userTriggeredSort, setUserTriggeredSort] = useState(false);
    const [filterAnchorEl, setFilterAnchorEl] = useState(null);
    const [activeFilterColumn, setActiveFilterColumn] = useState(null);
    const [filters, setFilters] = useState({});
    const [tempFilter, setTempFilter] = useState({});

    useEffect(() => {
        setPage(1);
        setUserTriggeredSort(false);
    }, [data, filters]);

    const handleSortRequest = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        setUserTriggeredSort(true);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };

    const getNestedValue = (obj, path) => {
        return path?.split('.')?.reduce((acc, key) => acc?.[key], obj) || '';
    }

    const filteredData = data.filter((row) =>
        Object.entries(filters).every(([key, value]) => {
            if (!value) return true;
            const cellValue = getNestedValue(row, key)?.toString()?.toLowerCase();
            return cellValue.includes(value.toLowerCase());
        })
    );

    const sortedData = userTriggeredSort
        ? [...filteredData]?.sort((a, b) => {
            const aValue = getNestedValue(a, orderBy)?.toString()?.toLowerCase();
            const bValue = getNestedValue(b, orderBy)?.toString()?.toLowerCase();

            if (aValue < bValue) return order === 'asc' ? -1 : 1;
            if (aValue > bValue) return order === 'asc' ? 1 : -1;
            return 0;
        })
        : filteredData;

    const paginatedData = sortedData?.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    return (
        <Box width={'100%'} marginBottom={'20px'}>
            <Paper sx={{ bgcolor: 'transparent' }}>
                <Box width="100%" sx={{ overflowX: 'auto' }}>
                    <TableContainer component={Paper} sx={tableStyles.tcontainer}>
                        <Table stickyHeader
                            sx={{
                                tableLayout: 'auto',
                                minWidth: '100%',
                            }}
                        >
                            <TableHead sx={tableStyles.thead}>
                                <TableRow>
                                    {columns?.map((column) => (
                                        <TableCell key={column.id}
                                            sx={{ ...tableStyles.thcell, width: column?.width || 'auto' }}
                                        >
                                            {column.sortable ? (
                                                <TableSortLabel sx={tableStyles.sortlabel}
                                                    active={orderBy === column.id}
                                                    direction={orderBy === column.id ? order : 'asc'}
                                                    onClick={(e) => { e.stopPropagation(); handleSortRequest(column.id) }}
                                                >
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <Typography sx={tableStyles.theadText}>
                                                            {column.label}
                                                        </Typography>
                                                        {column?.filter && (
                                                            <IconButton
                                                                size="small"
                                                                sx={{ p: 0.5 }}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setActiveFilterColumn(column);
                                                                    setTempFilter({
                                                                        [column.id]: filters[column.id] || '',
                                                                    });
                                                                    setFilterAnchorEl(e.currentTarget);
                                                                }}
                                                            >
                                                                {filters[column.id]
                                                                    ? <FilterAltOff sx={{ color: '#FFFFFF', fontSize: 18 }} />
                                                                    : <FilterAlt sx={{ color: '#FFFFFF', fontSize: 18 }} />
                                                                }
                                                            </IconButton>
                                                        )}
                                                    </Box>
                                                </TableSortLabel>
                                            ) : (
                                                <Typography sx={tableStyles.theadText}>
                                                    {column.label}
                                                </Typography>
                                            )}


                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {!loading && paginatedData?.length === 0 && (
                                    <TableRow sx={tableStyles.emptytr}>
                                        <TableCell colSpan={8} sx={tableStyles.emptytdcell}>
                                            No records to display
                                        </TableCell>
                                    </TableRow>
                                )}
                                {paginatedData?.length === 0 && loading ?
                                    (<TableRow sx={tableStyles.emptytr}>
                                        <TableCell colSpan={7} sx={tableStyles.emptytdcell}>
                                            <CircularProgress sx={{ color: '#0B51C5' }} />
                                        </TableCell>
                                    </TableRow>)
                                    :
                                    (paginatedData?.length > 0 && paginatedData?.map((row, index) => (
                                        <TableRow key={index} sx={{ ...tableStyles.trow }}>
                                            {columns.map((column) => (
                                                <TableCell key={column.id} style={{
                                                    ...tableStyles.tdcell,
                                                    borderBottom: index < paginatedData.length - 1 && row.temp_layout_id !== paginatedData[index + 1]?.temp_layout_id
                                                        ? '1.5px solid #c7cbd4'
                                                        : undefined,
                                                }}>
                                                    <Typography noWrap={false}>
                                                        {column.renderCell
                                                            ? column.renderCell(row)
                                                            : row[column.id]}
                                                    </Typography>
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    )))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {paginatedData?.length > 0 &&
                        (<Box display={'flex'} justifyContent={'space-between'} padding={'10px'} alignItems={'center'} bgColor={"#FFFFFF"}>
                            <Box display={'flex'} alignItems={'center'}>
                                <Box marginLeft={'20px'}>
                                    <Select
                                        value={rowsPerPage} onChange={handleChangeRowsPerPage}
                                        sx={{
                                            ...componentsStyles.selectField,
                                            width: '130px',
                                            height: '35px',
                                        }}
                                    >
                                        {rowsPerPageOptions?.map((option) => (
                                            <MenuItem key={option} value={option} sx={{ fontSize: '13px' }}>
                                                {option} per page
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Box>
                            </Box>
                            <Pagination
                                count={Math.ceil(sortedData.length / rowsPerPage)}
                                page={page}
                                onChange={handleChangePage}
                                color="standard"
                            />
                        </Box>)
                    }
                </Box>
            </Paper>

            <Popover
                open={Boolean(filterAnchorEl)}
                anchorEl={filterAnchorEl}
                onClose={() => {
                    setFilterAnchorEl(null);
                    setActiveFilterColumn(null);
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Box p={2} minWidth={200}>
                    {activeFilterColumn && (
                        <>
                            <Typography variant="subtitle2" mb={1}>
                                Filter by {activeFilterColumn.label}
                            </Typography>

                            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                                <Select
                                    value={tempFilter[activeFilterColumn.id] || ''}
                                    onChange={(e) =>
                                        setTempFilter(prev => ({
                                            ...prev,
                                            [activeFilterColumn.id]: e.target.value
                                        }))
                                    }
                                >
                                    <MenuItem value="">
                                        <em>All</em>
                                    </MenuItem>
                                    {[...new Set(data.map(row =>
                                        getNestedValue(row, activeFilterColumn.id)
                                    ))]
                                        .filter(v => v !== undefined && v !== null)
                                        .map((value) => (
                                            <MenuItem key={value} value={value}>
                                                {value || '—'}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>

                            <Box display="flex" justifyContent="flex-end" gap={1}>
                                <Button
                                    size="small"
                                    variant="contained"
                                    onClick={() => {
                                        setFilters(prev => ({
                                            ...prev,
                                            [activeFilterColumn.id]: tempFilter[activeFilterColumn.id]
                                        }));
                                        setFilterAnchorEl(null);
                                        setActiveFilterColumn(null);
                                    }}
                                >
                                    Apply
                                </Button>

                                <Button
                                    size="small"
                                    onClick={() => {
                                        setFilters(prev => {
                                            const updated = { ...prev };
                                            delete updated[activeFilterColumn.id];
                                            return updated;
                                        });
                                        setTempFilter({});
                                        setFilterAnchorEl(null);
                                        setActiveFilterColumn(null);
                                    }}
                                >
                                    Clear
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>
            </Popover>


        </Box>
    );
};

export default GeneralTable;