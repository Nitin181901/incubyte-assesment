import { Box } from '@mui/material'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatCompactUsd, formatUsd } from './formatters'
import SectionCard from './SectionCard'
import { useStatsResource } from './useStats'

export default function TenureSection({ refreshKey }) {
  const { data, loading, error, refresh } = useStatsResource('/stats/tenure', [refreshKey])

  const chartData = (data?.data || []).map((row) => ({
    band: row.band,
    median: row.median == null ? 0 : Number(row.median),
    headcount: Number(row.headcount || 0),
  }))

  return (
    <SectionCard
      title="Median pay by tenure"
      subtitle="Bands of years since hired_on"
      loading={loading}
      error={error}
      onRetry={refresh}
    >
      <Box sx={{ width: '100%', height: 280 }} role="img" aria-label="Median pay by tenure chart">
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="band" label={{ value: 'Tenure (years)', position: 'insideBottom', offset: -2 }} />
            <YAxis tickFormatter={formatCompactUsd} width={64} />
            <Tooltip
              formatter={(value, _name, item) => [
                `${formatUsd(value)} (n=${item?.payload?.headcount ?? 0})`,
                'Median',
              ]}
            />
            <Bar dataKey="median" name="Median" fill="#c45c26" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </SectionCard>
  )
}
