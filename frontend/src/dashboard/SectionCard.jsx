import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Skeleton,
  Typography,
} from '@mui/material'

export default function SectionCard({ title, subtitle, loading, error, onRetry, children, action }) {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
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
            <Skeleton variant="rounded" height={160} />
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
        ) : (
          children
        )}
      </CardContent>
    </Card>
  )
}
