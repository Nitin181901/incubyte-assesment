import { useMemo } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Chip,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import ChartCard from '../components/ChartCard'
import { formatPercent, formatUsd } from './formatters'
import { useStatsResource } from './useStats'
import { safeNumber } from '../utils/display'

export default function OutliersSection({ refreshKey, filters = {} }) {
  const { data, loading, error, refresh } = useStatsResource(
    () => '/stats/outliers?threshold=0.4&limit=50',
    [refreshKey],
  )

  const rows = useMemo(() => {
    let list = data?.data || []
    if (filters.country) {
      list = list.filter((r) => (r.country?.code || '') === filters.country)
    }
    if (filters.job_title) {
      list = list.filter((r) => r.job_title === filters.job_title)
    }
    return list
  }, [data, filters])

  return (
    <ChartCard
      title="Who is paid unusually?"
      subtitle="People far from the peer median for the same title and country."
      footnote="More than 40% from the peer median. Peer groups smaller than 5 are skipped."
      loading={loading}
      error={error}
      onRetry={refresh}
      empty={rows.length === 0 ? 'No outliers at this threshold.' : null}
    >
      <Box sx={{ overflowX: 'auto' }}>
        <Table size="small" aria-label="Pay outliers table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell align="right">Salary (USD)</TableCell>
              <TableCell align="right">Vs peers</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const deviation = safeNumber(row.deviation_pct, 0)
              const positive = deviation >= 0
              const role = [row.job_title, row.country?.code].filter(Boolean).join(' · ')
              return (
                <TableRow key={row.id} hover>
                  <TableCell>
                    <Link
                      component={RouterLink}
                      to={`/employees?q=${encodeURIComponent(row.email || row.name)}`}
                      underline="hover"
                      sx={{ fontWeight: 700 }}
                    >
                      {row.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {role || '—'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">{formatUsd(row.salary_usd)}</TableCell>
                  <TableCell align="right">
                    <Chip
                      size="small"
                      label={formatPercent(deviation)}
                      sx={{
                        fontWeight: 700,
                        bgcolor: positive ? 'rgba(20,184,166,0.15)' : 'rgba(244,63,94,0.14)',
                        color: positive ? 'success.main' : 'error.main',
                      }}
                    />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Box>
    </ChartCard>
  )
}
