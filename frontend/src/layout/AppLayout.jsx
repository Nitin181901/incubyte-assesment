import { useEffect, useMemo, useState } from 'react'
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import MenuIcon from '@mui/icons-material/Menu'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import Atmosphere from '../components/Atmosphere'
import BrandMark from '../components/BrandMark'
import { useThemeMode } from '../theme'
import { layout, SIDEBAR_STORAGE_KEY } from '../theme/tokens'
import { avatarColor, initials } from '../utils/display'
import { NAV_ITEMS } from './navItems'

function readCollapsed() {
  try {
    return localStorage.getItem(SIDEBAR_STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function SidebarNav({ collapsed, onNavigate }) {
  const location = useLocation()
  const theme = useTheme()

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: theme.palette.acme.sidebarGradient,
        color: 'common.white',
      }}
    >
      <Box sx={{ px: collapsed ? 1.25 : 2, py: 2.25 }}>
        <BrandMark collapsed={collapsed} light />
      </Box>

      <Typography
        variant="overline"
        sx={{
          px: collapsed ? 0 : 2.5,
          opacity: 0.55,
          textAlign: collapsed ? 'center' : 'left',
          display: 'block',
        }}
      >
        {collapsed ? '···' : 'Workspace'}
      </Typography>

      <List sx={{ px: 1, flexGrow: 1 }}>
        {NAV_ITEMS.map((item) => {
          const active =
            item.to === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.to)
          const Icon = item.icon
          return (
            <ListItemButton
              key={item.to}
              component={RouterLink}
              to={item.to}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              sx={{
                mb: 0.75,
                borderRadius: 999,
                minHeight: 44,
                justifyContent: collapsed ? 'center' : 'flex-start',
                px: collapsed ? 1 : 1.75,
                color: 'common.white',
                bgcolor: active ? 'rgba(255,255,255,0.16)' : 'transparent',
                boxShadow: active ? `0 8px 22px ${alpha('#6366F1', 0.45)}` : 'none',
                backgroundImage: active ? theme.palette.acme.gradient : 'none',
                '&:hover': {
                  bgcolor: active ? undefined : 'rgba(255,255,255,0.08)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 1.5, color: 'inherit' }}>
                <Icon fontSize="small" />
              </ListItemIcon>
              {!collapsed ? <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600 }} /> : null}
            </ListItemButton>
          )
        })}
      </List>

      <SidebarUser collapsed={collapsed} />
    </Box>
  )
}

function SidebarUser({ collapsed }) {
  const { user, logout } = useAuth()
  const name = user?.name || user?.email || 'User'
  const color = avatarColor(name)

  return (
    <Box sx={{ p: collapsed ? 1 : 1.5 }}>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)', mb: 1.5 }} />
      <Stack
        direction="row"
        spacing={1.25}
        sx={{
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          p: collapsed ? 0.5 : 1,
          borderRadius: 3,
          bgcolor: 'rgba(255,255,255,0.08)',
        }}
      >
        <Avatar sx={{ width: 36, height: 36, bgcolor: color, fontSize: 14, fontWeight: 700 }}>
          {initials(name)}
        </Avatar>
        {!collapsed ? (
          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
            <Typography variant="body2" noWrap sx={{ fontWeight: 700, color: 'common.white' }}>
              {name}
            </Typography>
            <Typography variant="caption" noWrap sx={{ color: 'rgba(255,255,255,0.65)' }}>
              {user?.email}
            </Typography>
          </Box>
        ) : null}
        <Tooltip title="Log out">
          <IconButton aria-label="Log out" onClick={logout} size="small" sx={{ color: 'common.white' }}>
            <LogoutOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  )
}

export default function AppLayout() {
  const theme = useTheme()
  const { mode, toggleMode } = useThemeMode()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(readCollapsed)

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, collapsed ? '1' : '0')
    } catch {
      /* ignore */
    }
  }, [collapsed])

  const sidebarWidth = collapsed ? layout.sidebarCollapsed : layout.sidebarWidth

  const desktopSidebar = useMemo(
    () => (
      <Box
        component="nav"
        aria-label="Main"
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
          display: { xs: 'none', md: 'block' },
          transition: theme.transitions.create('width'),
        }}
      >
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: sidebarWidth,
            height: '100vh',
            transition: theme.transitions.create('width'),
          }}
        >
          <SidebarNav collapsed={collapsed} />
          <IconButton
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={() => setCollapsed((v) => !v)}
            size="small"
            sx={{
              position: 'absolute',
              top: 18,
              right: -14,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: 1,
              '&:hover': { bgcolor: 'background.paper' },
            }}
          >
            {collapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
          </IconButton>
        </Box>
      </Box>
    ),
    [collapsed, sidebarWidth, theme],
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Atmosphere />

      {desktopSidebar}

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: layout.sidebarWidth, border: 0 },
        }}
      >
        <SidebarNav collapsed={false} onNavigate={() => setMobileOpen(false)} />
      </Drawer>

      <Box
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${sidebarWidth}px)` },
          transition: theme.transitions.create('width'),
          minWidth: 0,
        }}
      >
        <Toolbar
          sx={{
            px: { xs: 1.5, sm: 2.5 },
            justifyContent: 'space-between',
            gap: 1,
            position: 'sticky',
            top: 0,
            zIndex: 10,
            backdropFilter: 'blur(12px)',
            bgcolor: (t) => alpha(t.palette.background.default, 0.55),
          }}
        >
          <IconButton
            aria-label="Open navigation"
            onClick={() => setMobileOpen(true)}
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
            <IconButton aria-label="Toggle color mode" onClick={toggleMode}>
              {mode === 'dark' ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
            </IconButton>
          </Tooltip>
        </Toolbar>

        <Box
          component="main"
          sx={{
            px: { xs: 1.5, sm: 2.5, lg: 3 },
            pb: 4,
            mx: 'auto',
            width: '100%',
            maxWidth: layout.contentMaxWidth,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
