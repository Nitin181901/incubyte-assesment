import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ThemeModeProvider } from '../theme'
import EmployeeTable from './EmployeeTable'

const rows = [
  {
    id: 1,
    first_name: 'Alice',
    last_name: 'Anderson',
    department: 'Engineering',
    job_title: 'Software Engineer',
    salary: 100000,
    salary_usd: 100000,
    hired_on: '2020-01-15',
    country: { code: 'US', currency_code: 'USD' },
  },
  {
    id: 2,
    first_name: 'Bob',
    last_name: 'Baker',
    department: 'Sales',
    job_title: 'Account Manager',
    salary: 80000,
    salary_usd: 80000,
    hired_on: '2018-06-01',
    country: { code: 'US', currency_code: 'USD' },
  },
]

describe('EmployeeTable', () => {
  it('renders rows and pagination meta', () => {
    render(
      <ThemeModeProvider>
        <EmployeeTable
          rows={rows}
          meta={{ page: 2, per_page: 25, total: 52, total_pages: 3 }}
          loading={false}
          error={null}
          sort="name"
          dir="asc"
          onSort={vi.fn()}
          onPageChange={vi.fn()}
          onPerPageChange={vi.fn()}
          onRetry={vi.fn()}
          onEdit={vi.fn()}
          onDelete={vi.fn()}
          onHistory={vi.fn()}
        />
      </ThemeModeProvider>,
    )

    expect(screen.getByText('Alice Anderson')).toBeInTheDocument()
    expect(screen.getByText('Bob Baker')).toBeInTheDocument()
    expect(screen.getByText(/52/)).toBeInTheDocument()
    expect(screen.getByText('Engineering')).toBeInTheDocument()
    // Level column is derived L1–L6 from job_title (API has no level field)
    expect(screen.getAllByText('L3').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('15 Jan 2020')).toBeInTheDocument()
  })
})
