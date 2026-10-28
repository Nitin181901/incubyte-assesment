import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { api } from '../backend/client'

export default function CountriesPage() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError('')
      try {
        const result = await api('/countries')
        if (!cancelled) setRows(result.data || [])
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load countries')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Countries
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        FX rates relative to USD (1 unit of local currency = usd_rate USD). Rates are edited via the API.
      </Typography>

      {loading ? (
        <Box sx={{ display: 'grid', placeItems: 'center', py: 6 }}>
          <CircularProgress size={28} />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : rows.length === 0 ? (
        <Typography color="text.secondary">No countries seeded yet.</Typography>
      ) : (
        <Table size="small" aria-label="Countries and FX rates">
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Currency</TableCell>
              <TableCell align="right">USD rate</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((country) => (
              <TableRow key={country.code}>
                <TableCell>{country.code}</TableCell>
                <TableCell>{country.name}</TableCell>
                <TableCell>{country.currency_code}</TableCell>
                <TableCell align="right">{Number(country.usd_rate).toFixed(6)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Paper>
  )
}
