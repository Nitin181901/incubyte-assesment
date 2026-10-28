import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import { useState } from 'react'
import { api } from '../backend/client'
import { employeeName } from './formatters'

export default function DeleteEmployeeDialog({ open, employee, onClose, onDeleted }) {
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!employee) return
    setDeleting(true)
    try {
      await api(`/employees/${employee.id}`, { method: 'DELETE' })
      onDeleted(`Deleted ${employeeName(employee)}`)
      onClose()
    } catch (err) {
      onDeleted(err.message || 'Delete failed', 'error')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={deleting ? undefined : onClose}
      aria-labelledby="delete-employee-title"
      aria-describedby="delete-employee-description"
    >
      <DialogTitle id="delete-employee-title">Delete employee?</DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-employee-description">
          This permanently removes {employee ? employeeName(employee) : 'this employee'} and their salary
          history.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={deleting} autoFocus>
          Cancel
        </Button>
        <Button color="error" variant="contained" onClick={handleDelete} disabled={deleting}>
          {deleting ? 'Deleting…' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
