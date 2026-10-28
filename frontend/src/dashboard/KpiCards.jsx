import { Box, Card, CardContent, Skeleton, Tooltip, Typography } from '@mui/material'
import { formatCompactUsd, formatUsd } from './formatters'
import SectionCard from './SectionCard'

const CARDS = [
  { key: 'headcount', label: 'Headcount', format: (v) => Number(v).toLocaleString('en-US'), full: (v) => Number(v).toLocaleString('en-US') },
  { key: 'total_payroll_usd', label: 'Total payroll', format: formatCompactUsd, full: formatUsd },
  { key: 'avg', label: 'Average', format: formatCompactUsd, full: formatUsd },
  { key: 'median', label: 'Median', format: formatCompactUsd, full: formatUsd },
  { key: 'min', label: 'Min', format: formatCompactUsd, full: formatUsd },
  { key: 'max', label: 'Max', format: formatCompactUsd, full: formatUsd },
]

export default function KpiCards({ data, loading, error, onRetry }) {
  if (error) {
    return <SectionCard title="Overview" loading={false} error={error} onRetry={onRetry} />
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(6, 1fr)',
        },
      }}
    >
      {CARDS.map((card) => {
        const value = data?.[card.key]
        return (
          <Card key={card.key} variant="outlined">
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {card.label}
              </Typography>
              {loading ? (
                <Skeleton width="60%" height={36} />
              ) : (
                <Tooltip title={value == null ? '' : card.full(value)} arrow>
                  <Typography variant="h5" component="p" sx={{ mt: 0.5 }}>
                    {value == null ? '—' : card.format(value)}
                  </Typography>
                </Tooltip>
              )}
            </CardContent>
          </Card>
        )
      })}
    </Box>
  )
}
