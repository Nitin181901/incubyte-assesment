import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { api } from '../backend/client'
import { employeeName, formatDate, formatLocalSalary } from './formatters'

export default function SalaryHistoryDrawer({ open, employee, onClose }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open || !employee?.id) return
    let cancelled = false

    async function load() {
      setLoading(true)
      setError('')
      try {
        const result = await api(`/employees/${employee.id}/salary_changes`)
        if (!cancelled) setRows(result.data || [])
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load history')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [open, employee])

  const name = employee ? employeeName(employee) : ''

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" aria-labelledby="salary-history-title">
      <DialogTitle id="salary-history-title">Salary history: {name}</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'grid', placeItems: 'center', py: 6 }}>
            <CircularProgress size={28} />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : rows.length === 0 ? (
          <Typography color="text.secondary">No salary changes yet.</Typography>
        ) : (
          <Table size="small" aria-label="Salary history">
            <TableHead>
              <TableRow>
                <TableCell>Effective</TableCell>
                <TableCell>Salary</TableCell>
                <TableCell>Reason</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((change) => (
                <TableRow key={change.id}>
                  <TableCell>{formatDate(change.created_at)}</TableCell>
                  <TableCell>
                    {formatLocalSalary(change.old_salary, change.currency_code)} →{' '}
                    {formatLocalSalary(change.new_salary, change.currency_code)}
                  </TableCell>
                  <TableCell>{change.reason || '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
