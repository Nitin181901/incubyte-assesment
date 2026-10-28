import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Link,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { formatPercent, formatUsd } from './formatters'
import SectionCard from './SectionCard'
import { useStatsResource } from './useStats'

export default function OutliersSection({ refreshKey }) {
  const [thresholdPct, setThresholdPct] = useState(40)
  const threshold = thresholdPct / 100

  const { data, loading, error, refresh } = useStatsResource(
    () => `/stats/outliers?threshold=${threshold}&limit=50`,
    [threshold, refreshKey],
  )

  const rows = data?.data || []

  return (
    <SectionCard
      title="Pay outliers"
      subtitle="Vs median for same job title + country"
      loading={loading}
      error={error}
      onRetry={refresh}
      action={
        <Box sx={{ width: 180 }} aria-label="Outlier threshold">
          <Typography variant="caption" color="text.secondary">
            Threshold {thresholdPct}%
          </Typography>
          <Slider
            size="small"
            min={20}
            max={100}
            step={5}
            value={thresholdPct}
            onChange={(_e, value) => setThresholdPct(Number(value))}

            valueLabelDisplay="auto"
            valueLabelFormat={(v) => `${v}%`}
          />
        </Box>
      }
    >
      <Box sx={{ overflowX: 'auto' }}>
        <Table size="small" aria-label="Pay outliers table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Country</TableCell>
              <TableCell align="right">Salary (USD)</TableCell>
              <TableCell align="right">Group median</TableCell>
              <TableCell align="right">Deviation</TableCell>
              <TableCell align="right">Group size</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <Typography color="text.secondary">No outliers at this threshold.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => {
                const deviation = Number(row.deviation_pct)
                const color = deviation >= 0 ? 'error.main' : 'info.main'
                return (
                  <TableRow key={row.id} hover>
                    <TableCell>
                      <Link
                        component={RouterLink}
                        to={`/employees?q=${encodeURIComponent(row.email || row.name)}`}
                        underline="hover"
                      >
                        {row.name}
                      </Link>
                    </TableCell>
                    <TableCell>{row.job_title}</TableCell>
                    <TableCell>{row.country?.code || '—'}</TableCell>
                    <TableCell align="right">{formatUsd(row.salary_usd)}</TableCell>
                    <TableCell align="right">{formatUsd(row.group_median)}</TableCell>
                    <TableCell align="right" sx={{ color, fontWeight: 600 }}>
                      {formatPercent(deviation)}
                    </TableCell>
                    <TableCell align="right">{row.group_size}</TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </Box>
    </SectionCard>
  )
}
