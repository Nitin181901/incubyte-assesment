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
import MailOutlineIcon from '@mui/icons-material/MailOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined'
import HistoryEduOutlinedIcon from '@mui/icons-material/HistoryEduOutlined'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import BrandMark from '../components/BrandMark'
import DocumentTitle from '../components/DocumentTitle'

const DEMO_EMAIL = 'demo@acme.test'
const DEMO_PASSWORD = 'Password123!'

const PILLS = [
  { icon: GroupsOutlinedIcon, text: '10,000 people, 10 countries' },
  { icon: InsightsOutlinedIcon, text: 'Answers, not just rows' },
  { icon: HistoryEduOutlinedIcon, text: 'Every change is recorded' },
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
        gridTemplateColumns: { xs: '1fr', md: '1.05fr 0.95fr' },
      }}
    >
      <DocumentTitle title="Sign in" />

      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          color: 'common.white',
          px: { xs: 3, md: 6 },
          py: { xs: 4, md: 6 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: (t) =>
            `linear-gradient(160deg, ${t.palette.acme.navy} 0%, #1E1B4B 45%, #312E81 100%)`,
        }}
      >
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            '& .blob': {
              position: 'absolute',
              borderRadius: '50%',
              filter: 'blur(50px)',
              opacity: 0.5,
              animation: 'acme-drift 20s ease-in-out infinite alternate',
              '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
            },
          }}
        >
          <Box
            className="blob"
            sx={{
              width: '48%',
              height: '48%',
              top: '-10%',
              left: '-8%',
              bgcolor: 'primary.main',
            }}
          />
          <Box
            className="blob"
            sx={{
              width: '40%',
              height: '40%',
              top: '30%',
              right: '-12%',
              bgcolor: 'secondary.main',
              animationDelay: '-7s',
            }}
          />
          <Box
            className="blob"
            sx={{
              width: '44%',
              height: '44%',
              bottom: '-16%',
              left: '20%',
              bgcolor: 'info.main',
              animationDelay: '-14s',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: 120,
              background:
                'radial-gradient(100% 80% at 20% 100%, rgba(99,102,241,.35), transparent 60%), radial-gradient(90% 70% at 80% 100%, rgba(236,72,153,.28), transparent 55%)',
            }}
          />
        </Box>

        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 520 }}>
          <BrandMark light />
          <Typography variant="h3" sx={{ mt: 4, mb: 1, color: 'common.white' }}>
            Pay people fairly.
          </Typography>
          <Typography
            variant="h3"
            sx={{
              mb: 2,
              backgroundImage: (t) => t.palette.acme.textAccent,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            See it clearly.
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.72)', mb: 3, maxWidth: 420 }}>
            The salary workspace for HR: manage compensation across every country and understand how
            your organisation really pays.
          </Typography>
          <Stack spacing={1.25}>
            {PILLS.map(({ icon: Icon, text }) => (
              <Stack
                key={text}
                direction="row"
                spacing={1.25}
                sx={{
                  alignItems: 'center',
                  px: 1.5,
                  py: 1.1,
                  borderRadius: 999,
                  bgcolor: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.16)',
                  backdropFilter: 'blur(12px)',
                  width: 'fit-content',
                }}
              >
                <Icon fontSize="small" />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
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
          bgcolor: (t) => (t.palette.mode === 'dark' ? 'background.default' : '#F8FAFC'),
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 420,
            p: { xs: 3, sm: 4 },
            borderRadius: 6,
            bgcolor: 'background.paper',
            boxShadow: (t) => t.palette.acme.glassShadow,
            border: (t) => t.palette.acme.glassBorder,
          }}
        >
          <Stack spacing={2.25} component="form" onSubmit={handleSubmit}>
            <Box>
              <Typography variant="h5">Welcome back</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Sign in to manage salaries and view pay insights.
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
                      <MailOutlineIcon fontSize="small" color="action" />
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
                borderRadius: 3,
                bgcolor: (t) =>
                  t.palette.mode === 'dark' ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.08)',
                border: '1px dashed',
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
