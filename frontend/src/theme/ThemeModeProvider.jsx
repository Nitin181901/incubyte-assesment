import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { buildTheme } from './theme'
import { THEME_STORAGE_KEY } from './tokens'

const ThemeModeContext = createContext(null)

function readStoredMode() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    /* ignore */
  }
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    try {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
    } catch {
      /* ignore */
    }
  }
  return 'light'
}

export function ThemeModeProvider({ children }) {
  const [mode, setMode] = useState(readStoredMode)

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode)
    } catch {
      /* ignore */
    }
    document.documentElement.dataset.theme = mode
  }, [mode])

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'))
  }, [])

  const theme = useMemo(() => buildTheme(mode), [mode])

  const value = useMemo(
    () => ({ mode, setMode, toggleMode, isDark: mode === 'dark' }),
    [mode, toggleMode],
  )

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  )
}

export function useThemeMode() {
  const ctx = useContext(ThemeModeContext)
  if (!ctx) throw new Error('useThemeMode must be used within ThemeModeProvider')
  return ctx
}
