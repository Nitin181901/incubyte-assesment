import { Paper } from '@mui/material'

/** Solid surface card (name kept for import stability after the ACME Pay restyle). */
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
