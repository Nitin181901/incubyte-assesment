import { alpha, createTheme } from '@mui/material/styles'
import { colors, glass, gradients, radii } from './tokens'

export function buildTheme(mode = 'light') {
  const isDark = mode === 'dark'
  const g = isDark ? glass.dark : glass.light

  return createTheme({
    palette: {
      mode,
      primary: {
        main: colors.indigo,
        light: colors.violet,
        dark: '#4F46E5',
        contrastText: colors.white,
      },
      secondary: {
        main: colors.pink,
        contrastText: colors.white,
      },
      error: { main: colors.coral },
      warning: { main: colors.orange },
      info: { main: colors.cyan },
      success: { main: colors.teal },
      text: {
        primary: isDark ? '#F8FAFC' : colors.navy,
        secondary: isDark ? '#94A3B8' : colors.muted,
      },
      background: {
        default: isDark ? colors.darkBg : '#F5F3FF',
        paper: isDark ? colors.darkPaper : colors.white,
      },
      divider: isDark ? 'rgba(148, 163, 184, 0.16)' : 'rgba(99, 102, 241, 0.12)',
      acme: {
        indigo: colors.indigo,
        violet: colors.violet,
        pink: colors.pink,
        cyan: colors.cyan,
        teal: colors.teal,
        orange: colors.orange,
        coral: colors.coral,
        navy: colors.navy,
        muted: colors.muted,
        gradient: gradients.primary,
        heroGradient: gradients.hero,
        sidebarGradient: gradients.sidebar,
        textAccent: gradients.textAccent,
        glassBg: g.bg,
        glassBorder: g.border,
        glassShadow: g.shadow,
        glassBlur: g.blur,
      },
    },
    typography: {
      fontFamily: '"Inter Variable", Inter, system-ui, sans-serif',
      h1: { fontWeight: 800, letterSpacing: '-0.04em' },
      h2: { fontWeight: 800, letterSpacing: '-0.03em' },
      h3: { fontWeight: 750, letterSpacing: '-0.03em' },
      h4: { fontWeight: 700, letterSpacing: '-0.02em' },
      h5: { fontWeight: 700, letterSpacing: '-0.02em' },
      h6: { fontWeight: 700, letterSpacing: '-0.015em' },
      button: { textTransform: 'none', fontWeight: 600 },
      overline: {
        fontWeight: 700,
        letterSpacing: '0.12em',
        fontSize: '0.68rem',
      },
    },
    shape: { borderRadius: radii.control },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            fontFamily: '"Inter Variable", Inter, system-ui, sans-serif',
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: radii.control,
            textTransform: 'none',
            fontWeight: 600,
            whiteSpace: 'nowrap',
          },
          containedPrimary: {
            backgroundImage: gradients.primary,
            boxShadow: `0 8px 20px ${alpha(colors.indigo, 0.35)}`,
            '&:hover': {
              backgroundImage: gradients.primaryHover,
              boxShadow: `0 12px 28px ${alpha(colors.violet, 0.45)}`,
            },
            '&.Mui-disabled': {
              backgroundImage: 'none',
            },
          },
          outlined: {
            borderRadius: radii.control,
            borderColor: alpha(colors.indigo, isDark ? 0.45 : 0.28),
          },
        },
      },
      MuiTextField: {
        defaultProps: { size: 'small' },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: radii.control,
            backgroundColor: isDark ? alpha('#fff', 0.04) : alpha('#fff', 0.85),
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: radii.card,
            backgroundImage: 'none',
            backgroundColor: g.bg,
            backdropFilter: `blur(${g.blur})`,
            WebkitBackdropFilter: `blur(${g.blur})`,
            border: g.border,
            boxShadow: g.shadow,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
          outlined: {
            borderRadius: radii.card,
            backgroundColor: g.bg,
            backdropFilter: `blur(${g.blur})`,
            WebkitBackdropFilter: `blur(${g.blur})`,
            border: g.border,
            boxShadow: g.shadow,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: radii.card,
            backgroundImage: 'none',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 10, fontWeight: 600 },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: isDark ? '#94A3B8' : colors.muted,
            backgroundColor: isDark ? alpha('#0B1026', 0.6) : alpha('#fff', 0.65),
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: 10,
            fontSize: '0.75rem',
          },
        },
      },
    },
  })
}

export default buildTheme
