import { useEffect, useMemo, useState } from 'react'
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { api } from '../backend/client'
import { formatUsd } from './formatters'

const EMPTY = {
  first_name: '',
  last_name: '',
  email: '',
  country_id: '',
  department: '',
  job_title: '',
  salary: '',
  hired_on: '',
  change_reason: '',
}

function fieldError(errors, key) {
  const messages = errors?.[key]
  if (!messages) return ''
  return Array.isArray(messages) ? messages.join(' ') : String(messages)
}

export default function EmployeeFormDialog({
  open,
  employee,
  countries,
  departments,
  jobTitles,
  onClose,
  onSaved,
}) {
  const isEdit = Boolean(employee?.id)
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    if (!open) return
    if (employee) {
      setForm({
        first_name: employee.first_name || '',
        last_name: employee.last_name || '',
        email: employee.email || '',
        country_id: employee.country?.id || employee.country_id || '',
        department: employee.department || '',
        job_title: employee.job_title || '',
        salary: employee.salary != null ? String(employee.salary) : '',
        hired_on: employee.hired_on || '',
        change_reason: '',
      })
    } else {
      setForm(EMPTY)
    }
    setErrors({})
    setFormError('')
  }, [open, employee])

  const selectedCountry = useMemo(
    () => countries.find((c) => String(c.id) === String(form.country_id)),
    [countries, form.country_id],
  )

  const salaryChanged =
    isEdit &&
    employee?.salary != null &&
    form.salary !== '' &&
    Number(form.salary) !== Number(employee.salary)

  const usdPreview = useMemo(() => {
    if (!selectedCountry || form.salary === '' || Number.isNaN(Number(form.salary))) return null
    return Number(form.salary) * Number(selectedCountry.usd_rate)
  }, [form.salary, selectedCountry])

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setErrors({})
    setFormError('')

    const payload = {
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      country_id: Number(form.country_id),
      department: form.department,
      job_title: form.job_title,
      salary: Number(form.salary),
      hired_on: form.hired_on,
    }
    if (isEdit && salaryChanged) payload.change_reason = form.change_reason

    try {
      if (isEdit) {
        await api(`/employees/${employee.id}`, { method: 'PATCH', body: payload })
      } else {
        await api('/employees', { method: 'POST', body: payload })
      }
      onSaved(isEdit ? 'Employee updated' : 'Employee created')
      onClose()
    } catch (err) {
      if (err.status === 422 && err.body?.details) {
        setErrors(err.body.details)
      } else {
        setFormError(err.message || 'Save failed')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>{isEdit ? 'Edit employee' : 'Add employee'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {formError ? (
              <Typography color="error" variant="body2">
                {formError}
              </Typography>
            ) : null}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="First name"
                required
                fullWidth
                value={form.first_name}
                onChange={(e) => update('first_name', e.target.value)}
                error={Boolean(fieldError(errors, 'first_name'))}
                helperText={fieldError(errors, 'first_name')}
              />
              <TextField
                label="Last name"
                required
                fullWidth
                value={form.last_name}
                onChange={(e) => update('last_name', e.target.value)}
                error={Boolean(fieldError(errors, 'last_name'))}
                helperText={fieldError(errors, 'last_name')}
              />
            </Stack>
            <TextField
              label="Email"
              type="email"
              required
              fullWidth
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              error={Boolean(fieldError(errors, 'email'))}
              helperText={fieldError(errors, 'email')}
            />
            <TextField
              select
              label="Country"
              required
              fullWidth
              value={form.country_id}
              onChange={(e) => update('country_id', e.target.value)}
              error={Boolean(fieldError(errors, 'country') || fieldError(errors, 'country_id'))}
              helperText={fieldError(errors, 'country') || fieldError(errors, 'country_id')}
            >
              {countries.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.code} — {c.name} ({c.currency_code})
                </MenuItem>
              ))}
            </TextField>
            <Autocomplete
              freeSolo
              options={departments}
              inputValue={form.department}
              onInputChange={(_e, value) => update('department', value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Department"
                  required
                  error={Boolean(fieldError(errors, 'department'))}
                  helperText={fieldError(errors, 'department')}
                />
              )}
            />
            <Autocomplete
              freeSolo
              options={jobTitles}
              inputValue={form.job_title}
              onInputChange={(_e, value) => update('job_title', value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Job title"
                  required
                  error={Boolean(fieldError(errors, 'job_title'))}
                  helperText={fieldError(errors, 'job_title')}
                />
              )}
            />

            <TextField
              label={`Salary${selectedCountry ? ` (${selectedCountry.currency_code})` : ''}`}
              type="number"
              required
              fullWidth
              value={form.salary}
              onChange={(e) => update('salary', e.target.value)}
              error={Boolean(fieldError(errors, 'salary'))}
              helperText={
                fieldError(errors, 'salary') ||
                (usdPreview != null ? `≈ ${formatUsd(usdPreview)} USD` : ' ')
              }
              slotProps={{ htmlInput: { step: '0.01', min: '0' } }}
            />
            <TextField
              label="Hired on"
              type="date"
              required
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              value={form.hired_on}
              onChange={(e) => update('hired_on', e.target.value)}
              error={Boolean(fieldError(errors, 'hired_on'))}
              helperText={fieldError(errors, 'hired_on')}
            />

            {salaryChanged ? (
              <TextField
                label="Reason for change"
                fullWidth
                value={form.change_reason}
                onChange={(e) => update('change_reason', e.target.value)}
                helperText="Shown in salary history"
              />
            ) : null}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
