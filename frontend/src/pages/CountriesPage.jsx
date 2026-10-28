import { Typography, Paper } from '@mui/material'

export default function CountriesPage() {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Countries
      </Typography>
      <Typography color="text.secondary">
        Country FX rates will be editable here in a later step.
      </Typography>
    </Paper>
  )
}
