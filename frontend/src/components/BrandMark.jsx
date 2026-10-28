import { Box, Stack, Typography } from '@mui/material'

export default function BrandMark({ collapsed = false, light = false }) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ minWidth: 0, alignItems: 'center' }}>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 2.5,
          flexShrink: 0,
          backgroundImage: (t) => t.palette.acme.gradient,
          boxShadow: (t) => `0 8px 18px ${t.palette.primary.main}55`,
          display: 'grid',
          placeItems: 'center',
          color: 'common.white',
          fontWeight: 800,
          fontSize: 14,
        }}
      >
        AP
      </Box>
      {!collapsed ? (
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 800,
              lineHeight: 1.1,
              color: light ? 'common.white' : 'text.primary',
            }}
          >
            ACME Pay
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: light ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}
          >
            Salary management
          </Typography>
        </Box>
      ) : null}
    </Stack>
  )
}
