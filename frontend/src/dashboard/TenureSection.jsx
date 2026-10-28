import { Box, useTheme } from '@mui/material'
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
import { formatUsd } from './formatters'
import { useStatsResource } from './useStats'
import { safeNumber } from '../utils/display'

export default function TenureSection({ refreshKey }) {
  const theme = useTheme()
  const { data, loading, error, refresh } = useStatsResource('/stats/tenure', [refreshKey])

  const rows = (data?.data || []).map((row) => ({
    ...row,
    median: safeNumber(row.median, 0),
    headcount: safeNumber(row.headcount, 0),
  }))

  return (
    <ChartCard
      title="Pay by tenure"
      subtitle="Median pay by years at ACME."
      footnote="Bands: 0–2, 2–5, and 5+ years."
      loading={loading}
      error={error}
      onRetry={refresh}
      empty={rows.length === 0 ? 'No tenure data.' : null}
    >
      <Box sx={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis
              dataKey="band"
              tick={{ fill: theme.palette.text.secondary, fontSize: 11 }}
              label={{ value: 'Tenure (years)', position: 'insideBottom', offset: -2 }}
            />
            <YAxis
              tick={{ fill: theme.palette.text.secondary, fontSize: 11 }}
              tickFormatter={(v) => formatUsd(v)}
            />
            <Tooltip
              formatter={(value, name) => {
                if (name === 'median') return [formatUsd(value), 'Median']
                return [value, name]
              }}
              labelFormatter={(label, payload) => {
                const hc = payload?.[0]?.payload?.headcount
                return hc != null ? `${label} · ${hc} people` : label
              }}
              contentStyle={{
                borderRadius: 12,
                border: `1px solid ${theme.palette.divider}`,
                background: theme.palette.background.paper,
              }}
            />
            <Bar dataKey="median" name="Median" fill={theme.palette.secondary.main} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </ChartCard>
  )
}
