import { Alert, Box, Button, Skeleton, Typography } from '@mui/material'
import GlassCard from './GlassCard'

export default function ChartCard({
  title,
  subtitle,
  footnote,
  loading,
  error,
  onRetry,
  action,
  children,
  empty,
  sx,
}) {
  return (
    <GlassCard sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column', ...sx }}>
      <Box sx={{ height: 3, bgcolor: 'primary.main' }} />
      <Box sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1.5, minHeight: 0 }}>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="h6" component="h2">
              {title}
            </Typography>
            {subtitle ? (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            ) : null}
          </Box>
          {action}
        </Box>

        {loading ? (
          <Box>
            <Skeleton variant="rounded" height={28} sx={{ mb: 1 }} />
            <Skeleton variant="rounded" height={180} />
          </Box>
        ) : error ? (
          <Alert
            severity="error"
            action={
              onRetry ? (
                <Button color="inherit" size="small" onClick={onRetry}>
                  Retry
                </Button>
              ) : null
            }
          >
            {error.message || 'Failed to load'}
          </Alert>
        ) : empty ? (
          <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
            {empty}
          </Typography>
        ) : (
          <Box sx={{ flexGrow: 1, minHeight: 0 }}>{children}</Box>
        )}

        {footnote && !loading && !error ? (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 'auto' }}>
            {footnote}
          </Typography>
        ) : null}
      </Box>
    </GlassCard>
  )
}
