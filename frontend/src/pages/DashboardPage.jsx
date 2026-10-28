import { useMemo, useState } from 'react'
import {
  Box,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useAuth } from '../auth/AuthContext'
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
import { formatCompactPayroll, firstNameFromUser, greetingForHour, safeNumber } from '../utils/display'

export default function DashboardPage() {
  const { user } = useAuth()
  const [refreshKey] = useState(0)
  const [filters, setFilters] = useState({ country: '', department: '', job_title: '' })
  const summary = useStatsResource('/stats/summary', [refreshKey])
  const { meta } = useMetaFilters()

  const headcount = safeNumber(summary.data?.headcount)
  const payroll = safeNumber(summary.data?.total_payroll_usd)
  const firstName = firstNameFromUser(user)
  const greeting = useMemo(() => greetingForHour(new Date().getHours()), [])

  function patchFilters(patch) {
    setFilters((prev) => ({ ...prev, ...patch }))
  }

  return (
    <Stack spacing={2.5}>
      <DocumentTitle title="Overview" />

      <GlassCard
        sx={{
          p: { xs: 2.5, md: 3 },
          position: 'relative',
          overflow: 'hidden',
          color: 'common.white',
          backgroundImage: (t) => t.palette.acme.heroGradient,
          border: 'none',
        }}
      >
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            width: 220,
            height: 220,
            borderRadius: '50%',
            right: -40,
            top: -60,
            bgcolor: 'rgba(255,255,255,0.18)',
            filter: 'blur(2px)',
          }}
        />
        <Typography variant="h5" sx={{ position: 'relative', fontWeight: 800 }}>
          {greeting}, {firstName} 👋
        </Typography>
        <Typography variant="h6" sx={{ position: 'relative', mt: 1, fontWeight: 700, opacity: 0.98 }}>
          ACME spends {payroll == null ? '—' : formatCompactPayroll(payroll)} a year on{' '}
          {headcount == null ? '—' : headcount.toLocaleString('en-US')} people.
        </Typography>
        <Typography variant="body2" sx={{ position: 'relative', mt: 1, opacity: 0.9, maxWidth: 640 }}>
          Use the filters to slice by country, department or level. Chart series update client-side;
          headline KPIs come from the organisation-wide summary.
        </Typography>
      </GlassCard>

      <GlassCard
        sx={{
          p: 2,
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
          sx={{ minWidth: 160, flexShrink: 0 }}
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
          sx={{ minWidth: 180, flexShrink: 0 }}
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
          label="Level"
          value={filters.job_title}
          onChange={(e) => patchFilters({ job_title: e.target.value })}
          sx={{ minWidth: 200, flexShrink: 0 }}
        >
          <MenuItem value="">All levels</MenuItem>
          {(meta.job_titles || []).map((t) => (
            <MenuItem key={t} value={t}>
              {t}
            </MenuItem>
          ))}
        </TextField>
      </GlassCard>

      <KpiCards
        data={summary.data}
        loading={summary.loading}
        error={summary.error}
        onRetry={summary.refresh}
      />

      <BreakdownSection refreshKey={refreshKey} filters={filters} />

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', lg: '1.1fr 0.9fr' },
        }}
      >
        <JobTitleMedians refreshKey={refreshKey} filters={filters} />
        <OutliersSection refreshKey={refreshKey} filters={filters} />
      </Box>

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
    </Stack>
  )
}
