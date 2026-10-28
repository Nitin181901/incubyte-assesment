import { useEffect, useState } from 'react'
import {
  Button,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import GlassCard from '../components/GlassCard'

export default function EmployeeFilters({
  filters,
  meta,
  onChange,
  onClear,
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
    <GlassCard sx={{ p: 2 }}>
      <Stack
        direction="row"
        spacing={1.5}
        useFlexGap
        flexWrap="wrap"
        sx={{ alignItems: 'center' }}
      >
        <TextField
          label="Search name, email or title"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Name, email or title"
          sx={{ minWidth: { xs: '100%', sm: 260 }, flexGrow: 1 }}
          slotProps={{
            htmlInput: { 'aria-label': 'Search employees' },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          select
          label="Country"
          size="small"
          value={filters.country || ''}
          onChange={(e) => onChange({ country: e.target.value })}
          sx={{ minWidth: 150, flexShrink: 0 }}
        >
          <MenuItem value="">All</MenuItem>
          {(meta.countries || []).map((c) => (
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
          sx={{ minWidth: 160, flexShrink: 0 }}
        >
          <MenuItem value="">All</MenuItem>
          {(meta.departments || []).map((d) => (
            <MenuItem key={d} value={d}>
              {d}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Level"
          size="small"
          value={filters.job_title || ''}
          onChange={(e) => onChange({ job_title: e.target.value })}
          sx={{ minWidth: 180, flexShrink: 0 }}
        >
          <MenuItem value="">All</MenuItem>
          {(meta.job_titles || []).map((t) => (
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
          sx={{ minWidth: 140, flexShrink: 0 }}
        />
        <TextField
          label="Max salary (USD)"
          size="small"
          type="number"
          value={filters.max_salary_usd || ''}
          onChange={(e) => onChange({ max_salary_usd: e.target.value })}
          sx={{ minWidth: 140, flexShrink: 0 }}
        />
        <Button onClick={onClear} sx={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
          Clear filters
        </Button>
      </Stack>
    </GlassCard>
  )
}
