import { useMemo } from 'react'
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

export default function JobTitleMedians({ refreshKey, filters = {} }) {
  const theme = useTheme()
  const { data, loading, error, refresh } = useStatsResource(
    () => '/stats/breakdown?by=job_title',
    [refreshKey],
  )

  const rows = useMemo(() => {
    let list = (data?.data || []).map((row) => ({
      title: row.key || 'Unknown',
      median: safeNumber(row.median, 0),
      p25: safeNumber(row.p25),
      p75: safeNumber(row.p75),
      headcount: safeNumber(row.headcount, 0),
    }))
    if (filters.job_title) list = list.filter((r) => r.title === filters.job_title)
    return list.sort((a, b) => b.median - a.median).slice(0, 12)
  }, [data, filters.job_title])

  const axisColor = theme.palette.text.secondary
  const gridColor = theme.palette.divider
  const hasPercentiles = rows.some((r) => r.p25 != null && r.p75 != null)

  return (
    <ChartCard
      title="Median pay by job title"
      subtitle="Median USD for the top titles."
      footnote="Top 12 titles by median."
      loading={loading}
      error={error}
      onRetry={refresh}
      empty={rows.length === 0 ? 'No titles to show.' : null}
    >
      <Box sx={{ width: '100%', height: Math.max(280, rows.length * 28) }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
            <defs>
              <linearGradient id="titleBar" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={theme.palette.primary.main} />
                <stop offset="100%" stopColor={theme.palette.secondary.main} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: axisColor }}
              tickFormatter={(v) => formatUsd(v)}
            />
            <YAxis
              type="category"
              dataKey="title"
              width={150}
              tick={{ fontSize: 11, fill: axisColor }}
            />
            <Tooltip
              formatter={(value, _name, props) => {
                const row = props?.payload
                if (!row) return [formatUsd(value), 'Median']
                if (hasPercentiles && row.p25 != null && row.p75 != null) {
                  return [
                    `${formatUsd(row.median)} (25th–75th: ${formatUsd(row.p25)}–${formatUsd(row.p75)})`,
                    'Median',
                  ]
                }
                return [formatUsd(row.median), 'Median']
              }}
              labelFormatter={(label) => label}
              contentStyle={{
                borderRadius: 12,
                border: `1px solid ${theme.palette.divider}`,
                background: theme.palette.background.paper,
              }}
            />
            <Bar dataKey="median" name="Median" fill="url(#titleBar)" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </ChartCard>
  )
}
