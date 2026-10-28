import { Paper } from '@mui/material'

export default function GlassCard({ children, sx, ...rest }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2.5,
        overflow: 'hidden',
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Paper>
  )
}
