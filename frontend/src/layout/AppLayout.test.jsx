import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { ThemeModeProvider } from '../theme'
import AppLayout from './AppLayout'
import { NAV_ITEMS } from './navItems'

vi.mock('../auth/AuthContext', () => ({
  useAuth: () => ({
    user: { name: 'HR Manager', email: 'demo@acme.test' },
    logout: vi.fn(),
    loading: false,
    isAuthenticated: true,
  }),
}))

function renderShell(path = '/') {
  return render(
    <ThemeModeProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<div>Overview page</div>} />
            <Route path="/employees" element={<div>Employees page</div>} />
            <Route path="/settings/countries" element={<div>Countries page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </ThemeModeProvider>,
  )
}

describe('AppLayout', () => {
  it('renders nav items and marks the active route', () => {
    renderShell('/')
    for (const item of NAV_ITEMS) {
      expect(screen.getAllByRole('link', { name: item.label }).length).toBeGreaterThan(0)
    }
    const overview = screen.getAllByRole('link', { name: 'Overview' })[0]
    expect(overview).toHaveAttribute('aria-current', 'page')
  })

  it('exposes a logout control', async () => {
    const user = userEvent.setup()
    renderShell('/')
    const buttons = screen.getAllByRole('button', { name: /log out/i })
    expect(buttons.length).toBeGreaterThan(0)
    await user.click(buttons[0])
  })
})
