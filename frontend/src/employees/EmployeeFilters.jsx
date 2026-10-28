import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material'

export default function EmployeeFilters({
  filters,
  meta,
  onChange,
  onClear,
  onAdd,
  onExport,
  onImport,
  onDownloadTemplate,
  exporting = false,
}) {

  const [search, setSearch] = useState(filters.q || '')

  useEffect(() => {
    setSearch(filters.q || '')
  }, [filters.q])

  useEffect(() => {
    const handle = setTimeout(() => {
      if (search !== (filters.q || '')) {
        onChange({ q: search })
      }
    }, 300)
    return () => clearTimeout(handle)
  }, [search, filters.q, onChange])

  return (
    <Stack spacing={2}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ alignItems: { md: 'center' } }}>
        <TextField
          label="Search"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Name or email"
          sx={{ minWidth: { md: 220 } }}
          slotProps={{ htmlInput: { 'aria-label': 'Search employees' } }}
        />

        <TextField
          select
          label="Country"
          size="small"
          value={filters.country || ''}
          onChange={(e) => onChange({ country: e.target.value })}
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="">All</MenuItem>
          {meta.countries.map((c) => (
            <MenuItem key={c.code} value={c.code}>
              {c.code} — {c.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Department"
          size="small"
          value={filters.department || ''}
          onChange={(e) => onChange({ department: e.target.value })}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="">All</MenuItem>
          {meta.departments.map((d) => (
            <MenuItem key={d} value={d}>
              {d}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Job title"
          size="small"
          value={filters.job_title || ''}
          onChange={(e) => onChange({ job_title: e.target.value })}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">All</MenuItem>
          {meta.job_titles.map((t) => (
            <MenuItem key={t} value={t}>
              {t}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Min salary (USD)"
          size="small"
          type="number"
          value={filters.min_salary_usd || ''}
          onChange={(e) => onChange({ min_salary_usd: e.target.value })}
          sx={{ width: 150 }}
        />
        <TextField
          label="Max salary (USD)"
          size="small"
          type="number"
          value={filters.max_salary_usd || ''}
          onChange={(e) => onChange({ max_salary_usd: e.target.value })}
          sx={{ width: 150 }}
        />
        <Box sx={{ flexGrow: 1 }} />
        <Button onClick={onClear}>Clear filters</Button>
        <Button onClick={onDownloadTemplate}>Download template</Button>
        <Button onClick={onExport} disabled={exporting}>
          {exporting ? 'Exporting…' : 'Export CSV'}
        </Button>
        <Button onClick={onImport}>Import CSV</Button>
        <Button variant="contained" onClick={onAdd}>
          Add employee
        </Button>
      </Stack>
    </Stack>
  )
}

