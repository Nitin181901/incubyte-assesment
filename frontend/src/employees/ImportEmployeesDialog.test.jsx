import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ImportEmployeesDialog from './ImportEmployeesDialog'

describe('ImportEmployeesDialog', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('shows import summary and error rows from the API', async () => {
    const user = userEvent.setup()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () =>
          JSON.stringify({
            created: 1,
            updated: 2,
            unchanged: 3,
            failed: 1,
            errors: [ { row: 4, email: 'bad@acme.test', messages: [ 'country_code is unknown' ] } ],
          }),
      }),
    )

    render(<ImportEmployeesDialog open onClose={vi.fn()} onImported={vi.fn()} />)

    const file = new File(
      [ 'first_name,last_name,email,country_code,department,job_title,salary,hired_on\n' ],
      'employees.csv',
      { type: 'text/csv' },
    )
    const input = document.querySelector('input[type="file"]')
    await user.upload(input, file)
    await user.click(screen.getByRole('button', { name: /^Import$/i }))

    await waitFor(() => {
      expect(screen.getByText(/Created: 1/i)).toBeInTheDocument()
      expect(screen.getByText(/Updated: 2/i)).toBeInTheDocument()
      expect(screen.getByText(/Failed: 1/i)).toBeInTheDocument()
      expect(screen.getByText('bad@acme.test')).toBeInTheDocument()
      expect(screen.getByText(/country_code is unknown/i)).toBeInTheDocument()
      expect(screen.getByText('4')).toBeInTheDocument()
    })
  })
})
