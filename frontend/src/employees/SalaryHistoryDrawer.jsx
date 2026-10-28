import { useEffect, useState } from 'react'
import {
  Box,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
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

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: '100%', sm: 420 } } }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6">Salary history</Typography>
          <Typography variant="body2" color="text.secondary">
            {employee ? employeeName(employee) : ''}
          </Typography>
        </Box>
        <IconButton aria-label="Close history" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      {loading ? (
        <Box sx={{ display: 'grid', placeItems: 'center', py: 6 }}>
          <CircularProgress size={28} />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ p: 2 }}>
          {error}
        </Typography>
      ) : rows.length === 0 ? (
        <Typography color="text.secondary" sx={{ p: 2 }}>
          No salary changes yet.
        </Typography>
      ) : (
        <List dense>
          {rows.map((change) => (
            <ListItem key={change.id} alignItems="flex-start" divider>
              <ListItemText
                primary={`${formatLocalSalary(change.old_salary, change.currency_code)} → ${formatLocalSalary(change.new_salary, change.currency_code)}`}
                secondary={
                  <>
                    <Typography component="span" variant="body2" display="block">
                      {formatDate(change.created_at)}
                    </Typography>
                    {change.reason ? (
                      <Typography component="span" variant="body2" display="block">
                        Reason: {change.reason}
                      </Typography>
                    ) : null}
                    <Typography component="span" variant="body2" display="block">
                      Changed by: {change.changed_by_id != null ? `User #${change.changed_by_id}` : 'System'}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Drawer>
  )
}
