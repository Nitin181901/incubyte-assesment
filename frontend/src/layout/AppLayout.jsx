import { useState } from 'react'
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import BrandMark from '../components/BrandMark'
import { useThemeMode } from '../theme'
import { layout } from '../theme/tokens'
import { avatarColor, initials } from '../utils/display'
import { NAV_ITEMS } from './navItems'

function NavLinks({ onNavigate, vertical = false }) {
  const location = useLocation()

  if (vertical) {
    return (
      <List sx={{ px: 1 }}>
        {NAV_ITEMS.map((item) => {
          const active =
            item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to)
          const Icon = item.icon
          return (
            <ListItemButton
              key={item.to}
              component={RouterLink}
              to={item.to}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              selected={active}
              sx={{ borderRadius: 2, mb: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          )
        })}
      </List>
    )
  }

  return (
    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
      {NAV_ITEMS.map((item) => {
        const active =
          item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to)
        return (
          <Button
            key={item.to}
            component={RouterLink}
            to={item.to}
            aria-current={active ? 'page' : undefined}
            color="inherit"
            sx={{
              px: 1.5,
              borderRadius: 0,
              borderBottom: '2px solid',
              borderColor: active ? 'primary.main' : 'transparent',
              color: active ? 'text.primary' : 'text.secondary',
              fontWeight: active ? 700 : 600,
              '&:hover': { bgcolor: 'transparent', color: 'text.primary' },
            }}
          >
            {item.label}
          </Button>
        )
      })}
    </Stack>
  )
}

function UserMenu() {
  const { user, logout } = useAuth()
  const [anchor, setAnchor] = useState(null)
  const name = user?.name || user?.email || 'User'
  const color = avatarColor(name)

  return (
    <>
      <Tooltip title="Account">
        <IconButton
          aria-label="Open user menu"
          onClick={(e) => setAnchor(e.currentTarget)}
          size="small"
          sx={{ ml: 0.5 }}
        >
          <Avatar sx={{ width: 34, height: 34, bgcolor: color, fontSize: 13, fontWeight: 700 }}>
            {initials(name)}
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ px: 2, py: 1.25, minWidth: 200 }}>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>
        <Divider />
        <MenuItem
          onClick={() => {
            setAnchor(null)
            logout()
          }}
        >
          <ListItemIcon>
            <LogoutOutlinedIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  )
}

export default function AppLayout() {
  const { mode, toggleMode } = useThemeMode()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="sticky"
        elevation={0}
        color="inherit"
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Toolbar sx={{ gap: 1, minHeight: 64 }}>
          <IconButton
            aria-label="Open navigation"
            onClick={() => setMobileOpen(true)}
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: { xs: 'none', sm: 'block' }, mr: 2 }}>
            <BrandMark />
          </Box>
          <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
            <BrandMark compact />
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            <NavLinks />
          </Box>

          <Box sx={{ flexGrow: { xs: 1, md: 0 } }} />

          <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
            <IconButton aria-label="Toggle color mode" onClick={toggleMode}>
              {mode === 'dark' ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
            </IconButton>
          </Tooltip>
          <UserMenu />
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { md: 'none' },
          '& .MuiDrawer-paper': { width: 280 },
        }}
      >
        <Box sx={{ p: 2 }}>
          <BrandMark />
        </Box>
        <Divider />
        <NavLinks vertical onNavigate={() => setMobileOpen(false)} />
      </Drawer>

      <Box
        component="main"
        sx={{
          px: { xs: 1.5, sm: 2.5, lg: 3 },
          py: 3,
          mx: 'auto',
          width: '100%',
          maxWidth: layout.contentMaxWidth,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}
