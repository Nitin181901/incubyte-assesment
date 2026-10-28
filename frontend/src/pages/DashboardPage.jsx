import { useState } from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import BreakdownSection from '../dashboard/BreakdownSection'
import DistributionSection from '../dashboard/DistributionSection'
import KpiCards from '../dashboard/KpiCards'
import OutliersSection from '../dashboard/OutliersSection'
import TenureSection from '../dashboard/TenureSection'
import { useStatsResource } from '../dashboard/useStats'

export default function DashboardPage() {
  const [refreshKey, setRefreshKey] = useState(0)
  const summary = useStatsResource('/stats/summary', [refreshKey])

  function refreshAll() {
    setRefreshKey((k) => k + 1)
  }

  return (
    <Stack spacing={3}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          Dashboard
        </Typography>
        <Button startIcon={<RefreshIcon />} variant="outlined" onClick={refreshAll}>
          Refresh
        </Button>
      </Box>

      <KpiCards
        data={summary.data}
        loading={summary.loading}
        error={summary.error}
        onRetry={summary.refresh}
      />

      <BreakdownSection refreshKey={refreshKey} />

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        }}
      >
        <DistributionSection refreshKey={refreshKey} />
        <TenureSection refreshKey={refreshKey} />
      </Box>

      <OutliersSection refreshKey={refreshKey} />
    </Stack>
  )
}
