import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { visuallyHidden } from '@mui/utils';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function EnhancedTableHead({ columns, order, orderBy, numSelected, rowCount, onSelectAllClick, onRequestSort, showCheckbox, actions }) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow sx={{ backgroundColor: 'primary.main' }}>
        {showCheckbox && (
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                'aria-label': 'select all rows',
              }}
            />
          </TableCell>
        )}
        {columns.map((column) => (
          <TableCell
            key={column.field}
            align={column.numeric ? 'right' : 'left'}
            padding={column.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === column.field ? order : false}
          >
            <TableSortLabel
              active={orderBy === column.field}
              direction={orderBy === column.field ? order : 'asc'}
              onClick={createSortHandler(column.field)}
            >
              <Typography variant="body1" component="div">
                {column.title}
              </Typography>
              {orderBy === column.field ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        {actions.length > 0 && (
          <TableCell align="right">
            <Typography variant="body1" component="div">
              Actions
            </Typography>
          </TableCell>
        )}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  columns: PropTypes.array.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  showCheckbox: PropTypes.bool,
  actions: PropTypes.array,
};

function EnhancedCustomTable({ data = [], columns = [], onSelectionChange, onRowClick, showCheckbox = true, actions = [] }) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState(columns[0]?.field || '');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelected(data);
      onSelectionChange && onSelectionChange(data);
    } else {
      setSelected([]);
      onSelectionChange && onSelectionChange([]);
    }
  };

  const handleCheckboxClick = (event, row) => {
    event.stopPropagation(); // Prevent row click event
    const isSelected = selected.some((selectedRow) => JSON.stringify(selectedRow) === JSON.stringify(row));
    const newSelected = isSelected
      ? selected.filter((selectedRow) => JSON.stringify(selectedRow) !== JSON.stringify(row))
      : [...selected, row];
    setSelected(newSelected);
    onSelectionChange && onSelectionChange(newSelected);
  };

  const handleRowClick = (row) => {
    onRowClick && onRowClick(row);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const visibleRows = React.useMemo(
    () =>
      [...data]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, data]
  );

  const isRowSelected = (row) => selected.some((selectedRow) => JSON.stringify(selectedRow) === JSON.stringify(row));

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} size={dense ? 'small' : 'medium'}>
            <EnhancedTableHead
              columns={columns}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={data.length}
              showCheckbox={showCheckbox}
              actions={actions}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isRowSelected(row);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={() => handleRowClick(row)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id || index}
                    selected={isItemSelected}
                  >
                    {showCheckbox && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          onClick={(event) => handleCheckboxClick(event, row)}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell key={column.field} align={column.numeric ? 'right' : 'left'}>
                        {column.render ? column.render(row) : row[column.field]}
                      </TableCell>
                    ))}
                    {actions.length > 0 && (
                      <TableCell align="right">
                        {actions.map((action, actionIndex) => (
                          <Tooltip key={actionIndex} title={action.tooltip}>
                            <IconButton color="primary" onClick={(event) => action.onClick(event, row)}>
                              {action.icon}
                            </IconButton>
                          </Tooltip>
                        ))}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={columns.length + (showCheckbox ? 1 : 0) + (actions.length > 0 ? 1 : 0)} align="center">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}

EnhancedCustomTable.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array,
  onSelectionChange: PropTypes.func,
  onRowClick: PropTypes.func,
  showCheckbox: PropTypes.bool,
  actions: PropTypes.array,
};

export default EnhancedCustomTable;