import { beforeEach, describe, expect, it, vi } from 'vitest'
import { buildTheme } from './theme'
import { THEME_STORAGE_KEY } from './tokens'

describe('buildTheme', () => {
  it('builds light and dark themes with ACME primary', () => {
    const light = buildTheme('light')
    const dark = buildTheme('dark')
    expect(light.palette.mode).toBe('light')
    expect(dark.palette.mode).toBe('dark')
    expect(light.palette.primary.main).toBe('#6366F1')
    expect(dark.palette.acme.indigo).toBe('#6366F1')
  })
})

describe('ThemeModeProvider persistence', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetModules()
  })

  it('persists mode to localStorage when toggled', async () => {
    const { render, screen } = await import('@testing-library/react')
    const userEvent = (await import('@testing-library/user-event')).default
    const { ThemeModeProvider, useThemeMode } = await import('./ThemeModeProvider')

    function Probe() {
      const { mode, toggleMode } = useThemeMode()
      return (
        <button type="button" onClick={toggleMode}>
          {mode}
        </button>
      )
    }

    render(
      <ThemeModeProvider>
        <Probe />
      </ThemeModeProvider>,
    )

    const user = userEvent.setup()
    const btn = screen.getByRole('button')
    const initial = btn.textContent
    await user.click(btn)
    const next = initial === 'light' ? 'dark' : 'light'
    expect(btn).toHaveTextContent(next)
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe(next)
  })
})
