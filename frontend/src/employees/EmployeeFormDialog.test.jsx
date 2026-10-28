import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import EmployeeFormDialog from './EmployeeFormDialog'

describe('EmployeeFormDialog', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('shows server validation errors under fields', async () => {
    const user = userEvent.setup()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 422,
        text: async () =>
          JSON.stringify({
            error: 'validation_failed',
            details: { email: ["Email can't be blank"], salary: ['Salary must be greater than 0'] },
          }),
      }),
    )

    render(
      <EmployeeFormDialog
        open
        employee={{
          id: 9,
          first_name: 'Pat',
          last_name: 'Lee',
          email: 'pat@acme.test',
          department: 'Engineering',
          job_title: 'Software Engineer',
          salary: 100000,
          hired_on: '2020-01-01',
          country: { id: 1, code: 'US', name: 'United States', currency_code: 'USD', usd_rate: 1 },
        }}
        countries={[
          { id: 1, code: 'US', name: 'United States', currency_code: 'USD', usd_rate: 1 },
        ]}
        departments={[ 'Engineering' ]}
        jobTitles={[ 'Software Engineer' ]}
        onClose={vi.fn()}
        onSaved={vi.fn()}
      />,
    )

    await user.click(screen.getByRole('button', { name: /^Save$/i }))

    await waitFor(() => {
      expect(screen.getByText(/Email can't be blank/i)).toBeInTheDocument()
      expect(screen.getByText(/Salary must be greater than 0/i)).toBeInTheDocument()
    })
  })
})
