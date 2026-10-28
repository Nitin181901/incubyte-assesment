import { Box, Stack, Typography } from '@mui/material'

export default function PageHeader({ title, subtitle, actions }) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      sx={{
        mb: 2.5,
        flexWrap: 'wrap',
        gap: 1.5,
        alignItems: { sm: 'flex-start' },
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="h4" component="h1">
          {title}
        </Typography>
        {subtitle ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        ) : null}
      </Box>
      {actions ? (
        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          flexWrap="wrap"
          sx={{ flexShrink: 0, '& > *': { flexShrink: 0, whiteSpace: 'nowrap' } }}
        >
          {actions}
        </Stack>
      ) : null}
    </Stack>
  )
}
