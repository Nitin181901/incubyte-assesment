import { Box, Stack, Typography } from '@mui/material'
import { colors } from '../theme/tokens'

function LogoMark({ size = 36 }) {
  return (
    <Box
      component="svg"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden
      sx={{ flexShrink: 0, display: 'block' }}
    >
      <rect width="32" height="32" rx="8" fill={colors.primary} />
      <path
        d="M9 21V11h2.2v8.2H16V21H9zm8.2 0v-7.4h1.9l2.6 5.4h.1v-5.4H24V21h-1.9l-2.6-5.5h-.1V21h-2.2z"
        fill={colors.white}
      />
      <circle cx="22.5" cy="10.5" r="3.2" fill="none" stroke={colors.secondary} strokeWidth="1.6" />
      <path d="M24.7 12.7 27 15" stroke={colors.secondary} strokeWidth="1.6" strokeLinecap="round" />
    </Box>
  )
}

export default function BrandMark({ compact = false, light = false }) {
  return (
    <Stack direction="row" spacing={1.25} sx={{ minWidth: 0, alignItems: 'center' }}>
      <LogoMark />
      {!compact ? (
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 800,
              lineHeight: 1.1,
              color: light ? 'common.white' : 'text.primary',
            }}
          >
            PayLens
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: light ? 'rgba(255,255,255,0.72)' : 'text.secondary' }}
            noWrap
          >
            Compensation insights for HR
          </Typography>
        </Box>
      ) : null}
    </Stack>
  )
}
