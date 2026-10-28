import { createTheme } from '@mui/material/styles'
import { colors, radii, shadows } from './tokens'

export function buildTheme(mode = 'light') {
  const isDark = mode === 'dark'

  return createTheme({
    palette: {
      mode,
      primary: {
        main: colors.primary,
        dark: colors.primaryHover,
        contrastText: colors.white,
      },
      secondary: {
        main: colors.secondary,
        contrastText: colors.slate950,
      },
      error: { main: colors.danger },
      success: { main: colors.success },
      warning: { main: colors.secondary },
      text: {
        primary: isDark ? '#F8FAFC' : colors.slate950,
        secondary: isDark ? '#94A3B8' : colors.slate500,
      },
      background: {
        default: isDark ? colors.darkBg : colors.slate50,
        paper: isDark ? colors.darkPaper : colors.white,
      },
      divider: isDark ? 'rgba(148, 163, 184, 0.2)' : colors.slate200,
      paylens: {
        primary: colors.primary,
        primaryHover: colors.primaryHover,
        secondary: colors.secondary,
        danger: colors.danger,
        success: colors.success,
        slate950: colors.slate950,
        slate700: colors.slate700,
        slate500: colors.slate500,
        slate200: colors.slate200,
        slate50: colors.slate50,
      },
    },
    typography: {
      fontFamily: '"Inter Variable", Inter, system-ui, sans-serif',
      h1: { fontWeight: 750, letterSpacing: '-0.03em' },
      h2: { fontWeight: 750, letterSpacing: '-0.02em' },
      h3: { fontWeight: 700, letterSpacing: '-0.02em' },
      h4: { fontWeight: 700, letterSpacing: '-0.015em' },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
      button: { textTransform: 'none', fontWeight: 600 },
      overline: {
        fontWeight: 700,
        letterSpacing: '0.1em',
        fontSize: '0.68rem',
      },
    },
    shape: { borderRadius: radii.control },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            fontFamily: '"Inter Variable", Inter, system-ui, sans-serif',
            backgroundColor: isDark ? colors.darkBg : colors.slate50,
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
            backgroundColor: colors.primary,
            '&:hover': { backgroundColor: colors.primaryHover },
          },
          outlined: {
            borderColor: isDark ? 'rgba(148,163,184,0.35)' : colors.slate200,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: { borderRadius: radii.control },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: radii.card,
            backgroundImage: 'none',
            backgroundColor: isDark ? colors.darkPaper : colors.white,
            border: `1px solid ${isDark ? 'rgba(148,163,184,0.2)' : colors.slate200}`,
            boxShadow: shadows.card,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
          outlined: {
            borderRadius: radii.card,
            backgroundColor: isDark ? colors.darkPaper : colors.white,
            border: `1px solid ${isDark ? 'rgba(148,163,184,0.2)' : colors.slate200}`,
            boxShadow: shadows.card,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: { borderRadius: radii.card, backgroundImage: 'none' },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: isDark ? '#94A3B8' : colors.slate500,
            backgroundColor: isDark ? colors.darkPaper : colors.white,
          },
        },
      },
    },
  })
}

export default buildTheme
