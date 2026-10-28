import { Box, Skeleton, Tooltip, Typography } from '@mui/material'
import GlassCard from '../components/GlassCard'
import ChartCard from '../components/ChartCard'
import { formatCompactPayroll, formatMoney, safeNumber } from '../utils/display'
import { formatCompactUsd, formatUsd } from './formatters'

const CARDS = [
  {
    key: 'headcount',
    label: 'Headcount',
    format: (v) => Number(v).toLocaleString('en-US'),
    full: (v) => Number(v).toLocaleString('en-US'),
  },
  {
    key: 'total_payroll_usd',
    label: 'Annual payroll USD',
    format: formatCompactPayroll,
    full: formatMoney,
  },
  {
    key: 'median',
    label: 'Median salary USD',
    format: formatCompactUsd,
    full: formatUsd,
  },
  {
    key: 'avg',
    label: 'Average salary USD',
    format: formatCompactUsd,
    full: formatUsd,
  },
]

export default function KpiCards({ data, loading, error, onRetry }) {
  if (error) {
    return <ChartCard title="Overview" loading={false} error={error} onRetry={onRetry} />
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 1.5,
        gridTemplateColumns: {
          xs: '1fr 1fr',
          md: 'repeat(4, 1fr)',
        },
      }}
    >
      {CARDS.map((card) => {
        const value = safeNumber(data?.[card.key])
        return (
          <GlassCard key={card.key} sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              {card.label}
            </Typography>
            {loading ? (
              <Skeleton width="55%" height={40} />
            ) : (
              <Tooltip title={value == null ? '' : card.full(value)} arrow>
                <Typography variant="h4" component="p" sx={{ mt: 0.5, fontWeight: 800, lineHeight: 1.15 }}>
                  {value == null ? '—' : card.format(value)}
                </Typography>
              </Tooltip>
            )}
          </GlassCard>
        )
      })}
    </Box>
  )
}
