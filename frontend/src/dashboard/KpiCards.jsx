import { Box, Skeleton, Tooltip, Typography } from '@mui/material'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined'
import MedianIcon from '@mui/icons-material/AlignVerticalCenter'
import AvgIcon from '@mui/icons-material/Insights'
import GlassCard from '../components/GlassCard'
import ChartCard from '../components/ChartCard'
import { accentIcons } from '../theme/tokens'
import { formatCompactPayroll, formatMoney, safeNumber } from '../utils/display'
import { formatCompactUsd, formatUsd } from './formatters'

const CARDS = [
  {
    key: 'headcount',
    label: 'Headcount',
    icon: GroupsOutlinedIcon,
    color: accentIcons.headcount,
    format: (v) => Number(v).toLocaleString('en-US'),
    full: (v) => Number(v).toLocaleString('en-US'),
  },
  {
    key: 'total_payroll_usd',
    label: 'Annual payroll USD',
    icon: PaymentsOutlinedIcon,
    color: accentIcons.payroll,
    format: formatCompactPayroll,
    full: formatMoney,
  },
  {
    key: 'median',
    label: 'Median salary USD',
    icon: MedianIcon,
    color: accentIcons.median,
    format: formatCompactUsd,
    full: formatUsd,
  },
  {
    key: 'avg',
    label: 'Average salary USD',
    icon: AvgIcon,
    color: accentIcons.average,
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
        gap: 2,
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
      }}
    >
      {CARDS.map((card) => {
        const Icon = card.icon
        const raw = data?.[card.key]
        const value = safeNumber(raw)
        return (
          <GlassCard key={card.key} sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: `${card.color}22`,
                  color: card.color,
                  flexShrink: 0,
                }}
              >
                <Icon fontSize="small" />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" color="text.secondary">
                  {card.label}
                </Typography>
                {loading ? (
                  <Skeleton width="60%" height={36} />
                ) : (
                  <Tooltip title={value == null ? '' : card.full(value)} arrow>
                    <Typography variant="h5" component="p" sx={{ mt: 0.25, fontWeight: 800 }}>
                      {value == null ? '—' : card.format(value)}
                    </Typography>
                  </Tooltip>
                )}
              </Box>
            </Box>
          </GlassCard>
        )
      })}
    </Box>
  )
}
