import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const CustomTable = ({ 
  data, 
  columns, 
  rowsPerPageOptions, 
  onRowClick, 
  selectionProps, 
  onSelectionChange 
}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(rowsPerPageOptions[0] || 5);
  const [selectedRows, setSelectedRows] = React.useState([]);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelectedRows = data.map((row) => row);
      setSelectedRows(newSelectedRows);
      onSelectionChange && onSelectionChange(newSelectedRows);
    } else {
      setSelectedRows([]);
      onSelectionChange && onSelectionChange([]);
    }
  };

  const handleRowSelection = (event, row) => {
    const isSelected = selectedRows.includes(row);
    const newSelectedRows = isSelected
      ? selectedRows.filter((r) => r !== row)
      : [...selectedRows, row];

    setSelectedRows(newSelectedRows);
    onSelectionChange && onSelectionChange(newSelectedRows);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableHead>
          <TableRow style={{ backgroundColor: '#f5f5f5' }}>
            <TableCell padding="checkbox">
              <Checkbox
              style={{ color: '#000' }}
                indeterminate={
                  selectedRows.length > 0 && selectedRows.length < data.length
                }
                checked={selectedRows.length === data.length}
                onChange={handleSelectAll}
              />
            </TableCell>
            {columns.map((column) => (
              <TableCell key={column.field} align={column.align || 'left'}>
                {column.title}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : data
          ).map((row, index) => (
            <TableRow 
              key={index} 
              onClick={() => onRowClick && onRowClick(row)} 
              style={{ cursor: onRowClick ? 'pointer' : 'default' }}
            >
              <TableCell padding="checkbox">
                <Checkbox
                  {...(selectionProps ? selectionProps(row) : {})}
                  onClick={(event) => event.stopPropagation()} // Prevent triggering onRowClick
                  onChange={(event) => handleRowSelection(event, row)}
                  checked={selectedRows.includes(row)}
                />
              </TableCell>
              {columns.map((column) => (
                <TableCell key={column.field} align={column.align || 'left'}>
                  {row[column.field]}
                </TableCell>
              ))}
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={columns.length + 1} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={rowsPerPageOptions}
              colSpan={columns.length + 1}
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              slotProps={{
                select: {
                  inputProps: {
                    'aria-label': 'rows per page',
                  },
                  native: true,
                },
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

CustomTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      headerName: PropTypes.string.isRequired,
      align: PropTypes.oneOf(['left', 'right', 'center']),
    })
  ).isRequired,
  rowsPerPageOptions: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.number, PropTypes.shape({ label: PropTypes.string, value: PropTypes.number })])
  ),
  onRowClick: PropTypes.func,
  selectionProps: PropTypes.func,
  onSelectionChange: PropTypes.func,
};

CustomTable.defaultProps = {
  rowsPerPageOptions: [5, 10, 25, { label: 'All', value: -1 }],
  onRowClick: null,
  selectionProps: null,
  onSelectionChange: null,
};

export default CustomTable;
