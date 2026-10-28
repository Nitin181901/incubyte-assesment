import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  Skeleton,
  Stack,
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
import GlassCard from '../components/GlassCard'
import { avatarColor, countryFlag, departmentStyle, initials } from '../utils/display'
import { employeeName, formatDate, formatLocalSalary, formatUsd } from './formatters'

const COLUMNS = [
  { id: 'name', label: 'Employee' },
  { id: 'department', label: 'Department' },
  { id: 'job_title', label: 'Level' },
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
    <GlassCard sx={{ p: 0, overflow: 'hidden' }}>
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
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={`sk-${i}`}>
                  {COLUMNS.map((col) => (
                    <TableCell key={col.id}>
                      <Skeleton height={28} />
                    </TableCell>
                  ))}
                  <TableCell>
                    <Skeleton height={28} />
                  </TableCell>
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">No employees match these filters.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((employee) => {
                const name = employeeName(employee)
                const dept = departmentStyle(employee.department)
                return (
                  <TableRow
                    key={employee.id}
                    hover
                    tabIndex={0}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => onRowClick?.(employee)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        onRowClick?.(employee)
                      }
                    }}
                  >
                    <TableCell>
                      <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            fontSize: 13,
                            fontWeight: 700,
                            bgcolor: avatarColor(name),
                          }}
                        >
                          {initials(name)}
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
                            {name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {employee.job_title || '—'}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={employee.department || '—'}
                        sx={{ bgcolor: dept.bg, color: dept.fg, fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip size="small" variant="outlined" label={employee.job_title || '—'} />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
                        <span aria-hidden>{countryFlag(employee.country?.code)}</span>
                        <Typography variant="body2">{employee.country?.code || '—'}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      {formatLocalSalary(employee.salary, employee.country?.currency_code)}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      {formatUsd(employee.salary_usd)}
                    </TableCell>
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
                          <IconButton
                            size="small"
                            aria-label="Delete employee"
                            onClick={() => onDelete(employee)}
                            sx={{ '&:hover': { color: 'error.main' } }}
                          >
                            <DeleteOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                )
              })
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
    </GlassCard>
  )
}
