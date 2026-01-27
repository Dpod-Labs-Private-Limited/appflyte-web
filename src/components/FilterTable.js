import React, { useEffect, useState } from 'react';
import {
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Typography,
    CircularProgress, IconButton, Popover, TableSortLabel, FormControl, Select, MenuItem, Button
} from '@mui/material';
import { FilterAlt, FilterAltOff, NavigateNext, NavigateBefore, } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { tableStyles } from '../styles/tableStyles';

const FilterTable = ({ data, columns, loading = false, hasMore, onFetchNextPage, onFilterChange, disableLocalFilter = false, rowsPerPageOptions = [5, 10, 20, 50, 100] }) => {
    const [frontendPage, setFrontendPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState(columns[0].id);
    const [userTriggeredSort, setUserTriggeredSort] = useState(false);

    const [filters, setFilters] = useState({});
    const [tempFilter, setTempFilter] = useState({});
    const [filterAnchorEl, setFilterAnchorEl] = useState(null);
    const [activeFilterColumn, setActiveFilterColumn] = useState(null);

    useEffect(() => {
        setFrontendPage(1);
    }, [rowsPerPage, filters, data]);

    const getNestedValue = (obj, path) =>
        path?.split('.')?.reduce((acc, key) => acc?.[key], obj) ?? '';

    let displayData = data;

    if (!disableLocalFilter) {
        displayData = data.filter((row) =>
            Object.entries(filters).every(([key, value]) => {
                if (!value) return true;

                const col = columns.find((c) => c.id === key);
                const cell = getNestedValue(row, key);

                if (col?.type === 'date') {
                    const rowDate = dayjs(cell);
                    const start = value.startDate ? dayjs(value.startDate) : null;
                    const end = value.endDate ? dayjs(value.endDate) : null;

                    if (!rowDate.isValid()) return false;
                    if (start && rowDate.isBefore(start, 'day')) return false;
                    if (end && rowDate.isAfter(end, 'day')) return false;
                    return true;
                }

                return cell
                    ?.toString()
                    ?.toLowerCase()
                    ?.includes(value?.toString()?.toLowerCase());
            })
        );
    }

    const sortedData = userTriggeredSort
        ? [...displayData].sort((a, b) => {
            const aV = getNestedValue(a, orderBy)?.toString()?.toLowerCase();
            const bV = getNestedValue(b, orderBy)?.toString()?.toLowerCase();
            if (aV < bV) return order === 'asc' ? -1 : 1;
            if (aV > bV) return order === 'asc' ? 1 : -1;
            return 0;
        })
        : displayData;

    const start = (frontendPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageData = sortedData.slice(start, end);

    const canGoNextFrontend = end < sortedData.length;

    const handleNext = () => {
        if (canGoNextFrontend) {
            setFrontendPage((p) => p + 1);
        } else if (hasMore && !loading) {
            onFetchNextPage?.();
        }
    };

    const handlePrev = () => {
        if (frontendPage > 1) setFrontendPage((p) => p - 1);
    };

    return (
        <Box width="100%" mb={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Paper>
                    <TableContainer sx={tableStyles.tcontainer}>
                        <Table stickyHeader>
                            <TableHead sx={tableStyles.thead}>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell key={column.id} sx={tableStyles.thcell}>
                                            <TableSortLabel
                                                active={orderBy === column.id}
                                                direction={orderBy === column.id ? order : 'asc'}
                                                onClick={() => {
                                                    setOrderBy(column.id);
                                                    setOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
                                                    setUserTriggeredSort(true);
                                                }}
                                            >
                                                <Box display="flex" alignItems="center" gap={0.5}>
                                                    <Typography sx={tableStyles.theadText}>
                                                        {column.label}
                                                    </Typography>

                                                    {column.filter && (
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => {
                                                                setActiveFilterColumn(column);
                                                                setFilterAnchorEl(e.currentTarget);

                                                                if (column.type === 'date') {
                                                                    setTempFilter(filters[column.id] || {});
                                                                } else {
                                                                    setTempFilter(filters[column.id] || '');
                                                                }
                                                            }}
                                                        >
                                                            {filters[column.id] ? (
                                                                <FilterAltOff fontSize="small" />
                                                            ) : (
                                                                <FilterAlt fontSize="small" />
                                                            )}
                                                        </IconButton>
                                                    )}
                                                </Box>
                                            </TableSortLabel>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {!loading && pageData.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} align="center">
                                            No records to display
                                        </TableCell>
                                    </TableRow>
                                )}

                                {pageData.map((row, index) => (
                                    <TableRow key={index}>
                                        {columns.map((column) => (
                                            <TableCell key={column.id}>
                                                {column.renderCell
                                                    ? column.renderCell(row)
                                                    : row[column.id]}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}

                                {loading && (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} align="center">
                                            <CircularProgress size={24} />
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box display="flex" justifyContent="space-between" p={2}>
                        <FormControl size="small">
                            <Select
                                value={rowsPerPage}
                                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                            >
                                {rowsPerPageOptions.map((v) => (
                                    <MenuItem key={v} value={v}>
                                        {v} per page
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Box display="flex" gap={1} alignItems="center">
                            <IconButton disabled={frontendPage === 1} onClick={handlePrev}>
                                <NavigateBefore />
                            </IconButton>

                            <Typography>
                                Page {frontendPage}
                            </Typography>

                            <IconButton
                                disabled={!hasMore && !canGoNextFrontend}
                                onClick={handleNext}
                            >
                                <NavigateNext />
                            </IconButton>
                        </Box>
                    </Box>
                </Paper>

                <Popover
                    open={Boolean(filterAnchorEl)}
                    anchorEl={filterAnchorEl}
                    onClose={() => {
                        setFilterAnchorEl(null);
                        setActiveFilterColumn(null);
                        setTempFilter({});
                    }}
                >
                    <Box p={2} minWidth={260}>
                        {activeFilterColumn?.type === 'date' && (
                            <>
                                <DatePicker
                                    label="From"
                                    maxDate={dayjs()}
                                    value={tempFilter.startDate ? dayjs(tempFilter.startDate) : null}
                                    onChange={(v) =>
                                        setTempFilter((p) => ({
                                            ...p,
                                            startDate: v ? v.startOf('day').toISOString() : '',
                                        }))
                                    }
                                />
                                <Box mt={2} />

                                <DatePicker
                                    label="To"
                                    minDate={tempFilter.startDate ? dayjs(tempFilter.startDate) : undefined}
                                    maxDate={dayjs()}
                                    value={tempFilter.endDate ? dayjs(tempFilter.endDate) : null}
                                    onChange={(v) =>
                                        setTempFilter((p) => ({
                                            ...p,
                                            endDate: v ? v.endOf('day').toISOString() : '',
                                        }))
                                    }
                                />

                                <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => {
                                            const updated = {
                                                ...filters,
                                                [activeFilterColumn.id]: tempFilter,
                                            };
                                            setFilters(updated);
                                            onFilterChange?.(updated);
                                            setFilterAnchorEl(null);
                                        }}
                                    >
                                        Apply
                                    </Button>

                                    <Button
                                        size="small"
                                        onClick={() => {
                                            const updated = { ...filters };
                                            delete updated[activeFilterColumn.id];
                                            setFilters(updated);
                                            onFilterChange?.(updated);
                                            setFilterAnchorEl(null);
                                        }}
                                    >
                                        Clear
                                    </Button>
                                </Box>
                            </>
                        )}
                    </Box>
                </Popover>
            </LocalizationProvider>
        </Box>
    );
};

export default FilterTable;