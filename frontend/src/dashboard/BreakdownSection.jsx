import { useMemo, useState } from 'react'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { breakdownLabel, formatCompactUsd, formatUsd } from './formatters'
import SectionCard from './SectionCard'
import { useStatsResource } from './useStats'

const BY_OPTIONS = [
  { value: 'country', label: 'Country' },
  { value: 'department', label: 'Department' },
  { value: 'job_title', label: 'Job title' },
]

function num(value) {
  return value == null ? 0 : Number(value)
}

export default function BreakdownSection({ refreshKey }) {
  const [by, setBy] = useState('department')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState({ id: 'headcount', dir: 'desc' })

  const { data, loading, error, refresh } = useStatsResource(
    () => `/stats/breakdown?by=${by}`,
    [by, refreshKey],
  )

  const rows = useMemo(() => {
    const list = (data?.data || []).map((row) => ({
      ...row,
      label: breakdownLabel(row, by),
      headcount: num(row.headcount),
      avg: num(row.avg),
      median: num(row.median),
      p25: num(row.p25),
      p75: num(row.p75),
      p90: num(row.p90),
    }))

    const filtered =
      by === 'job_title' && search.trim()
        ? list.filter((row) => row.label.toLowerCase().includes(search.trim().toLowerCase()))
        : list

    const dir = sort.dir === 'asc' ? 1 : -1
    return filtered.sort((a, b) => {
      const av = a[sort.id]
      const bv = b[sort.id]
      if (typeof av === 'string') return av.localeCompare(bv) * dir
      return (av - bv) * dir
    })
  }, [data, by, search, sort])

  const chartData = rows.slice(0, 12)

  function toggleSort(id) {
    setSort((prev) =>
      prev.id === id ? { id, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { id, dir: 'desc' },
    )
  }

  return (
    <SectionCard
      title="Pay by group"
      subtitle="Median with p25–p75 band across peer groups"
      loading={loading}
      error={error}
      onRetry={refresh}
      action={
        <ToggleButtonGroup
          exclusive
          size="small"
          value={by}
          onChange={(_e, value) => value && setBy(value)}
          aria-label="Breakdown dimension"
        >
          {BY_OPTIONS.map((opt) => (
            <ToggleButton key={opt.value} value={opt.value}>
              {opt.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      }
    >
      {by === 'job_title' ? (
        <TextField
          size="small"
          label="Search job titles"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 2, maxWidth: 320 }}
        />
      ) : null}

      <Box sx={{ width: '100%', height: 280, mb: 2 }} role="img" aria-label="Pay by group chart">
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 48 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" interval={0} angle={-25} textAnchor="end" height={60} tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={formatCompactUsd} width={64} />
            <Tooltip formatter={(value) => formatUsd(value)} />
            <Legend />
            <Bar dataKey="p25" name="p25" fill="#90caf9" />
            <Bar dataKey="median" name="Median" fill="#0b3d60" />
            <Bar dataKey="p75" name="p75" fill="#c45c26" />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      <Box sx={{ overflowX: 'auto' }}>
        <Table size="small" aria-label="Pay by group table">
          <TableHead>
            <TableRow>
              {[
                [ 'label', by === 'country' ? 'Country' : by === 'department' ? 'Department' : 'Job title' ],
                [ 'headcount', 'Headcount' ],
                [ 'avg', 'Avg' ],
                [ 'median', 'Median' ],
                [ 'p25', 'p25' ],
                [ 'p75', 'p75' ],
                [ 'p90', 'p90' ],
              ].map(([ id, label ]) => (
                <TableCell key={id} align={id === 'label' ? 'left' : 'right'}>
                  <TableSortLabel
                    active={sort.id === id}
                    direction={sort.id === id ? sort.dir : 'asc'}
                    onClick={() => toggleSort(id)}
                  >
                    {label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <Typography color="text.secondary">No groups to show.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.label}>
                  <TableCell>{row.label}</TableCell>
                  <TableCell align="right">{row.headcount}</TableCell>
                  <TableCell align="right">{formatUsd(row.avg)}</TableCell>
                  <TableCell align="right">{formatUsd(row.median)}</TableCell>
                  <TableCell align="right">{formatUsd(row.p25)}</TableCell>
                  <TableCell align="right">{formatUsd(row.p75)}</TableCell>
                  <TableCell align="right">{formatUsd(row.p90)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Box>
    </SectionCard>
  )
}
