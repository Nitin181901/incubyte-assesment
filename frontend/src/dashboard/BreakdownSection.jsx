import { useMemo, useState } from 'react'
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
} from '@mui/material'
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
import { breakdownLabel, formatCompactUsd, formatUsd } from './formatters'
import { useStatsResource } from './useStats'
import { safeNumber } from '../utils/display'

const BY_OPTIONS = [
  { value: 'country', label: 'Country' },
  { value: 'department', label: 'Department' },
  { value: 'job_title', label: 'Level' },
]

export default function BreakdownSection({ refreshKey, filters = {} }) {
  const theme = useTheme()
  const [by, setBy] = useState('department')
  const { data, loading, error, refresh } = useStatsResource(
    () => `/stats/breakdown?by=${by}`,
    [by, refreshKey],
  )

  const chartRows = useMemo(() => {
    let list = (data?.data || []).map((row) => {
      const headcount = safeNumber(row.headcount, 0)
      const avg = safeNumber(row.avg, 0)
      const median = safeNumber(row.median, 0)
      return {
        ...row,
        label: breakdownLabel(row, by),
        headcount,
        avg,
        median,
        // Approximate total annual salary for the group
        payroll: avg * headcount,
      }
    })

    if (filters.country && by === 'country') {
      list = list.filter((r) => (r.key?.code || '') === filters.country)
    }
    if (filters.department && by === 'department') {
      list = list.filter((r) => r.key === filters.department)
    }
    if (filters.job_title && by === 'job_title') {
      list = list.filter((r) => r.key === filters.job_title)
    }

    return list.sort((a, b) => b.payroll - a.payroll).slice(0, 12)
  }, [data, by, filters])

  const axisColor = theme.palette.text.secondary
  const gridColor = theme.palette.divider

  return (
    <ChartCard
      title="Where does the payroll money go?"
      subtitle="Total annual salary (USD) by group — approximate from average × headcount."
      footnote="Top groups by estimated payroll. Chart filters apply client-side; stats APIs are global."
      loading={loading}
      error={error}
      onRetry={refresh}
      empty={chartRows.length === 0 ? 'No groups match these filters.' : null}
      action={
        <ToggleButtonGroup
          exclusive
          size="small"
          value={by}
          onChange={(_e, value) => {
            if (value) setBy(value)
          }}
          aria-label="Breakdown dimension"
          sx={{ flexShrink: 0, flexWrap: 'wrap' }}
        >
          {BY_OPTIONS.map((opt) => (
            <ToggleButton key={opt.value} value={opt.value} sx={{ textTransform: 'none', px: 1.5 }}>
              {opt.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      }
    >
      <Box sx={{ width: '100%', height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartRows} margin={{ top: 8, right: 8, left: 8, bottom: 48 }}>
            <defs>
              <linearGradient id="payrollBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={theme.palette.acme.indigo} />
                <stop offset="100%" stopColor={theme.palette.acme.violet} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="label"
              interval={0}
              angle={-25}
              textAnchor="end"
              height={60}
              tick={{ fontSize: 11, fill: axisColor }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: axisColor }}
              tickFormatter={(v) => formatCompactUsd(v)}
            />
            <Tooltip
              formatter={(value) => [formatUsd(value), 'Payroll']}
              labelFormatter={(label) => label}
              contentStyle={{
                borderRadius: 12,
                border: `1px solid ${theme.palette.divider}`,
                background: theme.palette.background.paper,
              }}
            />
            <Bar dataKey="payroll" name="Payroll" fill="url(#payrollBar)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </ChartCard>
  )
}
