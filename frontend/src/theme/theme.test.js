import { createElement } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { ThemeModeProvider, useThemeMode } from './ThemeModeProvider'
import { buildTheme } from './theme'
import { THEME_STORAGE_KEY } from './tokens'

describe('buildTheme', () => {
  it('builds light and dark themes with ACME primary', () => {
    const light = buildTheme('light')
    const dark = buildTheme('dark')
    expect(light.palette.mode).toBe('light')
    expect(dark.palette.mode).toBe('dark')
    expect(light.palette.primary.main).toBe('#0D9488')
    expect(dark.palette.paylens.primary).toBe('#0D9488')
  })
})

describe('ThemeModeProvider persistence', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('persists mode to localStorage when toggled', () => {
    function Probe() {
      const { mode, toggleMode } = useThemeMode()
      return createElement('button', { type: 'button', onClick: toggleMode }, mode)
    }

    render(createElement(ThemeModeProvider, null, createElement(Probe)))

    const btn = screen.getByRole('button')
    const initial = btn.textContent
    fireEvent.click(btn)
    const next = initial === 'light' ? 'dark' : 'light'
    expect(btn).toHaveTextContent(next)
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe(next)
  })
})
