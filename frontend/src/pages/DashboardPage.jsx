import { useState } from 'react'
import {
  Box,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import DocumentTitle from '../components/DocumentTitle'
import GlassCard from '../components/GlassCard'
import BreakdownSection from '../dashboard/BreakdownSection'
import DistributionSection from '../dashboard/DistributionSection'
import JobTitleMedians from '../dashboard/JobTitleMedians'
import KpiCards from '../dashboard/KpiCards'
import OutliersSection from '../dashboard/OutliersSection'
import TenureSection from '../dashboard/TenureSection'
import { useStatsResource } from '../dashboard/useStats'
import { useMetaFilters } from '../employees/useEmployees'
import { formatCompactPayroll, safeNumber } from '../utils/display'

export default function DashboardPage() {
  const [refreshKey] = useState(0)
  const [filters, setFilters] = useState({ country: '', department: '', job_title: '' })
  const summary = useStatsResource('/stats/summary', [refreshKey])
  const { meta } = useMetaFilters()

  const headcount = safeNumber(summary.data?.headcount)
  const payroll = safeNumber(summary.data?.total_payroll_usd)

  function patchFilters(patch) {
    setFilters((prev) => ({ ...prev, ...patch }))
  }

  return (
    <Stack spacing={2}>
      <DocumentTitle title="Overview" />

      <Box>
        <Typography variant="h4" component="h1">
          Overview
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          ACME employs {headcount == null ? '—' : headcount.toLocaleString('en-US')} people with{' '}
          {payroll == null ? '—' : formatCompactPayroll(payroll)} annual payroll (USD). Chart filters
          below slice series client-side; headline KPIs are organisation-wide.
        </Typography>
      </Box>

      <Box
        sx={{
          position: 'sticky',
          top: 64,
          zIndex: 5,
          py: 1,
          bgcolor: 'background.default',
        }}
      >
        <GlassCard
          sx={{
            p: 1.5,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1.5,
            alignItems: 'center',
          }}
        >
          <TextField
            select
            label="Country"
            value={filters.country}
            onChange={(e) => patchFilters({ country: e.target.value })}
            sx={{ minWidth: 150, flexShrink: 0 }}
          >
            <MenuItem value="">All countries</MenuItem>
            {(meta.countries || []).map((c) => (
              <MenuItem key={c.code} value={c.code}>
                {c.code} — {c.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Department"
            value={filters.department}
            onChange={(e) => patchFilters({ department: e.target.value })}
            sx={{ minWidth: 170, flexShrink: 0 }}
          >
            <MenuItem value="">All departments</MenuItem>
            {(meta.departments || []).map((d) => (
              <MenuItem key={d} value={d}>
                {d}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Job title"
            value={filters.job_title}
            onChange={(e) => patchFilters({ job_title: e.target.value })}
            sx={{ minWidth: 200, flexShrink: 0 }}
          >
            <MenuItem value="">All titles</MenuItem>
            {(meta.job_titles || []).map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </TextField>
        </GlassCard>
      </Box>

      <KpiCards
        data={summary.data}
        loading={summary.loading}
        error={summary.error}
        onRetry={summary.refresh}
      />

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: 'repeat(12, 1fr)',
        }}
      >
        <Box sx={{ gridColumn: { xs: 'span 12', lg: 'span 8' } }}>
          <BreakdownSection refreshKey={refreshKey} filters={filters} />
        </Box>
        <Box sx={{ gridColumn: { xs: 'span 12', lg: 'span 4' } }}>
          <JobTitleMedians refreshKey={refreshKey} filters={filters} />
        </Box>
        <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
          <OutliersSection refreshKey={refreshKey} filters={filters} />
        </Box>
        <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
          <DistributionSection refreshKey={refreshKey} />
        </Box>
        <Box sx={{ gridColumn: 'span 12' }}>
          <TenureSection refreshKey={refreshKey} />
        </Box>
      </Box>
    </Stack>
  )
}
