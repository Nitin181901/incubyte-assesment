import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ThemeModeProvider } from '../theme'
import EmployeesPage from './EmployeesPage'

vi.mock('../employees/useEmployees', () => ({
  useEmployees: () => ({
    filters: { q: '', sort: 'name', dir: 'asc', page: '1', per_page: '25' },
    setFilters: vi.fn(),
    clearFilters: vi.fn(),
    data: [],
    meta: { page: 1, per_page: 25, total: 0, total_pages: 0 },
    loading: false,
    error: null,
    refresh: vi.fn(),
  }),
  useMetaFilters: () => ({
    meta: { countries: [], departments: [], job_titles: [] },
    countries: [],
    loading: false,
  }),
}))

describe('EmployeesPage toolbar', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('keeps Add employee and Export CSV labels on one line (nowrap)', () => {
    render(
      <ThemeModeProvider>
        <MemoryRouter>
          <EmployeesPage />
        </MemoryRouter>
      </ThemeModeProvider>,
    )

    const add = screen.getByRole('button', { name: /add employee/i })
    const exp = screen.getByRole('button', { name: /export csv/i })
    expect(add).toHaveStyle({ whiteSpace: 'nowrap' })
    expect(exp).toHaveStyle({ whiteSpace: 'nowrap' })
  })
})
