import { Typography, Paper } from '@mui/material'

export default function EmployeesPage() {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Employees
      </Typography>
      <Typography color="text.secondary">
        Employee search and CRUD will appear here in a later step.
      </Typography>
    </Paper>
  )
}
