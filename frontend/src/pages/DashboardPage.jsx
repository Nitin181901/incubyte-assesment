import { Typography, Paper } from '@mui/material'

export default function DashboardPage() {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Dashboard
      </Typography>
      <Typography color="text.secondary">
        Stats and charts will appear here in a later step.
      </Typography>
    </Paper>
  )
}
