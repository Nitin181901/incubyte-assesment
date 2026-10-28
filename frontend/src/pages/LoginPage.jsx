import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import MailOutlinedIcon from '@mui/icons-material/MailOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import QueryStatsOutlinedIcon from '@mui/icons-material/QueryStatsOutlined'
import BalanceOutlinedIcon from '@mui/icons-material/BalanceOutlined'
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import BrandMark from '../components/BrandMark'
import DocumentTitle from '../components/DocumentTitle'
import { colors } from '../theme/tokens'

const DEMO_EMAIL = 'hr@acme.test'
const DEMO_PASSWORD = 'Password123!'

const POINTS = [
  { icon: QueryStatsOutlinedIcon, text: 'See payroll totals and ranges without a spreadsheet hunt' },
  { icon: BalanceOutlinedIcon, text: 'Compare teams and titles on the same USD footing' },
  { icon: HistoryOutlinedIcon, text: 'Every salary change stays in the audit trail' },
]

export default function LoginPage() {
  const { login, isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!authLoading && isAuthenticated) {
    return <Navigate to={location.state?.from?.pathname || '/'} replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password)
      navigate(location.state?.from?.pathname || '/', { replace: true })
    } catch (err) {
      setError(err.body?.error || err.message || 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  const canSubmit = Boolean(email.trim() && password) && !submitting

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
      }}
    >
      <DocumentTitle title="Sign in" />

      <Box
        sx={{
          bgcolor: colors.slate950,
          color: 'common.white',
          px: { xs: 3, md: 6 },
          py: { xs: 4, md: 6 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ maxWidth: 460 }}>
          <BrandMark light />
          <Typography variant="h3" sx={{ mt: 4, mb: 1, color: 'common.white' }}>
            Know what you pay.
          </Typography>
          <Typography variant="h3" sx={{ mb: 2, color: colors.primary }}>
            Spot what&apos;s unfair.
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.72)', mb: 3 }}>
            PayLens helps HR understand ACME compensation across countries — totals, ranges, and
            outliers in one place.
          </Typography>
          <Stack spacing={1.5}>
            {POINTS.map(({ icon: Icon, text }) => (
              <Stack key={text} direction="row" spacing={1.25} sx={{ alignItems: 'flex-start' }}>
                <Icon fontSize="small" sx={{ mt: 0.25, color: colors.secondary }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)' }}>
                  {text}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          placeItems: 'center',
          px: { xs: 2, sm: 4 },
          py: 4,
          bgcolor: 'background.default',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 420,
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: (t) => t.shadows[1],
          }}
        >
          <Stack spacing={2.25} component="form" onSubmit={handleSubmit}>
            <Box>
              <Typography variant="h5">Welcome back</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Sign in to review ACME salaries and pay insights.
              </Typography>
            </Box>

            {error ? <Alert severity="error">{error}</Alert> : null}

            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              autoFocus
              autoComplete="username"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutlinedIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              autoComplete="current-password"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        onClick={() => setShowPassword((v) => !v)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button type="submit" variant="contained" size="large" disabled={!canSubmit}>
              {submitting ? 'Signing in…' : 'Sign in'}
            </Button>

            <Box
              sx={{
                p: 1.75,
                borderRadius: 2,
                bgcolor: 'action.hover',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="overline" color="text.secondary">
                Demo account
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'ui-monospace, monospace' }}>
                {DEMO_EMAIL}
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'ui-monospace, monospace' }}>
                {DEMO_PASSWORD}
              </Typography>
              <Link
                component="button"
                type="button"
                variant="body2"
                sx={{ mt: 0.75, fontWeight: 700 }}
                onClick={() => {
                  setEmail(DEMO_EMAIL)
                  setPassword(DEMO_PASSWORD)
                }}
              >
                Fill in
              </Link>
            </Box>
          </Stack>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 3 }}>
          © ACME · Confidential compensation data
        </Typography>
      </Box>
    </Box>
  )
}
