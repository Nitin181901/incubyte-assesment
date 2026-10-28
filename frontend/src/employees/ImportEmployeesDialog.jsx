import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { importEmployeesCsv } from './csv'

export default function ImportEmployeesDialog({ open, onClose, onImported }) {
  const [file, setFile] = useState(null)
  const [dryRun, setDryRun] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  function reset() {
    setFile(null)
    setDryRun(false)
    setSubmitting(false)
    setError('')
    setResult(null)
  }

  function handleClose() {
    if (submitting) return
    reset()
    onClose()
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!file) {
      setError('Choose a CSV file')
      return
    }

    setSubmitting(true)
    setError('')
    setResult(null)
    try {
      const summary = await importEmployeesCsv(file, { dryRun })
      setResult(summary)
      if (!dryRun) onImported?.(summary)
    } catch (err) {
      setError(err.body?.error || err.message || 'Import failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md" aria-labelledby="import-csv-title">
      <form onSubmit={handleSubmit}>
        <DialogTitle id="import-csv-title">Import CSV</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {error ? <Alert severity="error">{error}</Alert> : null}
            <Button variant="outlined" component="label" aria-label="Choose CSV file">
              {file ? file.name : 'Choose CSV file'}
              <input
                hidden
                type="file"
                accept=".csv,text/csv"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </Button>
            <FormControlLabel
              control={
                <Checkbox
                  checked={dryRun}
                  onChange={(e) => setDryRun(e.target.checked)}
                />
              }
              label="Validate only (dry run)"
            />


            {result ? (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Summary
                </Typography>
                <Typography variant="body2">
                  Created: {result.created} · Updated: {result.updated} · Unchanged: {result.unchanged} ·
                  Failed: {result.failed}
                </Typography>
                {result.errors?.length ? (
                  <Table size="small" sx={{ mt: 2 }} aria-label="Import errors">
                    <TableHead>
                      <TableRow>
                        <TableCell>Row</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Messages</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {result.errors.map((err) => (
                        <TableRow key={`${err.row}-${err.email}`}>
                          <TableCell>{err.row}</TableCell>
                          <TableCell>{err.email || '—'}</TableCell>
                          <TableCell>{(err.messages || []).join('; ')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : null}
              </Box>
            ) : null}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={submitting}>
            Close
          </Button>
          <Button type="submit" variant="contained" disabled={submitting || !file}>
            {submitting ? 'Working…' : dryRun ? 'Validate' : 'Import'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
