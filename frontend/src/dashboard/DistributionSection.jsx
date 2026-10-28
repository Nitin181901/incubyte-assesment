import { useState } from 'react'
import { Box, MenuItem, TextField, useTheme } from '@mui/material'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import ChartCard from '../components/ChartCard'
import { formatCompactUsd } from './formatters'
import { useStatsResource } from './useStats'

export default function DistributionSection({ refreshKey }) {
  const theme = useTheme()
  const [bins, setBins] = useState(20)
  const { data, loading, error, refresh } = useStatsResource(
    () => `/stats/distribution?bins=${bins}`,
    [bins, refreshKey],
  )

  const rows = (data?.data || []).map((bin) => ({
    ...bin,
    from: Number(bin.from),
    count: Number(bin.count) || 0,
  }))

  return (
    <ChartCard
      title="Salary distribution"
      subtitle="Headcount by salary band (USD)."
      footnote={`Histogram with ${bins} bins.`}
      loading={loading}
      error={error}
      onRetry={refresh}
      empty={rows.length === 0 ? 'No distribution data.' : null}
      action={
        <TextField
          select
          size="small"
          label="Bins"
          value={bins}
          onChange={(e) => setBins(Number(e.target.value))}
          sx={{ minWidth: 96, flexShrink: 0 }}
        >
          {[10, 20, 40].map((n) => (
            <MenuItem key={n} value={n}>
              {n}
            </MenuItem>
          ))}
        </TextField>
      }
    >
      <Box sx={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis
              dataKey="from"
              tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
              tickFormatter={(v) => formatCompactUsd(v)}
            />
            <YAxis tick={{ fontSize: 11, fill: theme.palette.text.secondary }} />
            <Tooltip
              formatter={(value) => [value, 'Count']}
              labelFormatter={(v) => `From ${formatCompactUsd(v)}`}
              contentStyle={{
                borderRadius: 12,
                border: `1px solid ${theme.palette.divider}`,
                background: theme.palette.background.paper,
              }}
            />
            <Bar dataKey="count" name="Count" fill={theme.palette.primary.main} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </ChartCard>
  )
}
