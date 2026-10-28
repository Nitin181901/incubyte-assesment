import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
} from '@mui/material'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import HistoryIcon from '@mui/icons-material/History'

import { employeeName, formatDate, formatLocalSalary, formatUsd } from './formatters'

const COLUMNS = [
  { id: 'name', label: 'Name' },
  { id: 'department', label: 'Department' },
  { id: 'job_title', label: 'Job title' },
  { id: 'country', label: 'Country' },
  { id: 'salary', label: 'Salary (local)', align: 'right' },
  { id: 'salary_usd', label: 'Salary (USD)', align: 'right' },
  { id: 'hired_on', label: 'Hired on' },
]

export default function EmployeeTable({
  rows,
  meta,
  loading,
  error,
  sort,
  dir,
  onSort,
  onPageChange,
  onPerPageChange,
  onRetry,
  onEdit,
  onDelete,
  onHistory,
  onRowClick,
}) {
  if (error) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={onRetry}>
            Retry
          </Button>
        }
      >
        {error.message || 'Failed to load employees'}
      </Alert>
    )
  }

  return (
    <Paper variant="outlined">
      <TableContainer>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {COLUMNS.map((col) => (
                <TableCell key={col.id} align={col.align || 'left'} sortDirection={sort === col.id ? dir : false}>
                  <TableSortLabel
                    active={sort === col.id}
                    direction={sort === col.id ? dir : 'asc'}
                    onClick={() => onSort(col.id)}
                  >
                    {col.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  <CircularProgress size={28} />
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">No employees match these filters.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((employee) => (
                <TableRow
                  key={employee.id}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => onRowClick?.(employee)}
                >
                  <TableCell>{employeeName(employee)}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.job_title}</TableCell>
                  <TableCell>{employee.country?.code}</TableCell>
                  <TableCell align="right">
                    {formatLocalSalary(employee.salary, employee.country?.currency_code)}
                  </TableCell>
                  <TableCell align="right">{formatUsd(employee.salary_usd)}</TableCell>
                  <TableCell>{formatDate(employee.hired_on)}</TableCell>
                  <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                    <Box sx={{ display: 'inline-flex' }}>
                      <Tooltip title="Salary history">
                        <IconButton size="small" aria-label="Salary history" onClick={() => onHistory(employee)}>
                          <HistoryIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small" aria-label="Edit employee" onClick={() => onEdit(employee)}>
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" aria-label="Delete employee" onClick={() => onDelete(employee)}>
                          <DeleteOutlinedIcon fontSize="small" />
                        </IconButton>

                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={meta.total || 0}
        page={Math.max((meta.page || 1) - 1, 0)}
        onPageChange={(_e, page) => onPageChange(page + 1)}
        rowsPerPage={meta.per_page || 25}
        onRowsPerPageChange={(e) => onPerPageChange(Number(e.target.value))}
        rowsPerPageOptions={[25, 50, 100]}
      />
    </Paper>
  )
}
