import { useState } from 'react'
import { MenuItem, TextField, Box } from '@mui/material'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatCompactUsd } from './formatters'
import SectionCard from './SectionCard'
import { useStatsResource } from './useStats'

export default function DistributionSection({ refreshKey }) {
  const [bins, setBins] = useState(20)
  const { data, loading, error, refresh } = useStatsResource(
    () => `/stats/distribution?bins=${bins}`,
    [bins, refreshKey],
  )

  const chartData = (data?.data || []).map((bin, index) => ({
    index,
    label: `${formatCompactUsd(bin.from)}–${formatCompactUsd(bin.to)}`,
    from: Number(bin.from),
    to: Number(bin.to),
    count: Number(bin.count),
  }))

  return (
    <SectionCard
      title="Salary distribution"
      subtitle="Histogram of salary_usd"
      loading={loading}
      error={error}
      onRetry={refresh}
      action={
        <TextField
          select
          size="small"
          label="Bins"
          value={bins}
          onChange={(e) => setBins(Number(e.target.value))}
          sx={{ width: 100 }}
        >
          {[ 10, 20, 40 ].map((n) => (
            <MenuItem key={n} value={n}>
              {n}
            </MenuItem>
          ))}
        </TextField>
      }
    >
      <Box sx={{ width: '100%', height: 280 }} role="img" aria-label="Salary distribution histogram">
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="from"
              tickFormatter={formatCompactUsd}
              label={{ value: 'Salary (USD)', position: 'insideBottom', offset: -5 }}
            />
            <YAxis allowDecimals={false} label={{ value: 'Employees', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              labelFormatter={(_, payload) => payload?.[0]?.payload?.label || ''}
              formatter={(value) => [ value, 'Count' ]}
            />
            <Bar dataKey="count" name="Count" fill="#0b3d60" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </SectionCard>
  )
}
