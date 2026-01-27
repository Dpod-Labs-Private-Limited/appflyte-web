import React, { useEffect, useState } from 'react';
import {
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Select,
    MenuItem, Typography, CircularProgress, IconButton, Popover, TableSortLabel, FormControl, Button
} from '@mui/material';
import { tableStyles } from '../styles/tableStyles';
import { FilterAlt, FilterAltOff, NavigateBefore, NavigateNext } from '@mui/icons-material';

const PaginationTable = ({ data,
    columns,
    rowsPerPageOptions = [5, 10, 20, 50],
    defaultRowsPerPage = 20,
    loading = false,
    onFetchNextPage,
    hasMore,
    onRowClick,
}) => {
    const [page, setPage] = useState(1);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState(columns[0].id);
    const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
    const [userTriggeredSort, setUserTriggeredSort] = useState(false);
    const [filters, setFilters] = useState({});
    const [tempFilter, setTempFilter] = useState({});
    const [filterAnchorEl, setFilterAnchorEl] = useState(null);
    const [activeFilterColumn, setActiveFilterColumn] = useState(null);

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

    const handleNext = () => {
        const totalPages = Math.ceil(filteredData.length / rowsPerPage);
        if (page < totalPages) {
            setPage(prev => prev + 1);
        } else if (hasMore) {
            onFetchNextPage();
            setPage(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (page > 1) setPage(prev => prev - 1);
    };

    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
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
        <Box width="100%" marginBottom="20px">
            <Paper sx={{ bgcolor: 'transparent' }}>
                <TableContainer component={Paper} sx={tableStyles.tcontainer}>
                    <Table stickyHeader>
                        <TableHead sx={tableStyles.thead}>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell key={column.id} sx={{ ...tableStyles.thcell, width: column?.width || 'auto' }}>
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
                            {!loading && paginatedData.length === 0 && (
                                <TableRow sx={tableStyles.emptytr}>
                                    <TableCell colSpan={columns.length} sx={tableStyles.emptytdcell}>
                                        No records to display
                                    </TableCell>
                                </TableRow>
                            )}

                            {loading ? (
                                <TableRow sx={tableStyles.emptytr}>
                                    <TableCell colSpan={columns.length} sx={tableStyles.emptytdcell}>
                                        <CircularProgress sx={{ color: '#0B51C5' }} />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedData.map((row, index) => (
                                    <TableRow key={index} sx={tableStyles.trow} hover onClick={() => onRowClick?.(row)}>
                                        {columns.map((column) => (
                                            <TableCell key={column.id} sx={tableStyles.tdcell}>
                                                {column.renderCell ? column.renderCell(row) : row[column.id]}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
                    <Select
                        value={rowsPerPage}
                        onChange={handleChangeRowsPerPage}
                        sx={{ width: '130px', height: '35px' }}
                    >
                        {rowsPerPageOptions.map((option) => (
                            <MenuItem key={option} value={option} sx={{ fontSize: '13px' }}>
                                {option} per page
                            </MenuItem>
                        ))}
                    </Select>

                    <Box display="flex" gap={2}>
                        <IconButton
                            disabled={page === 1 || loading}
                            onClick={handlePrev}
                        >
                            <NavigateBefore />
                        </IconButton>
                        <IconButton
                            disabled={((!hasMore && page >= Math.ceil(filteredData.length / rowsPerPage)) || loading)}
                            onClick={handleNext}
                        >
                            <NavigateNext />
                        </IconButton>
                    </Box>
                </Box>
            </Paper >

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

        </Box >
    );
};

export default PaginationTable;