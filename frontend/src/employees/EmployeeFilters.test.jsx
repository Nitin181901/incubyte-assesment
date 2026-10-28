import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ThemeModeProvider } from '../theme'
import EmployeeFilters from './EmployeeFilters'

describe('EmployeeFilters', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('debounces search and calls onChange with q', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    const onChange = vi.fn()

    render(
      <ThemeModeProvider>
        <EmployeeFilters
          filters={{ q: '' }}
          meta={{ countries: [], departments: [], job_titles: [] }}
          onChange={onChange}
          onClear={vi.fn()}
        />
      </ThemeModeProvider>,
    )

    await user.type(screen.getByRole('textbox', { name: /search employees/i }), 'alice')

    expect(onChange).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(300)

    expect(onChange).toHaveBeenCalledWith({ q: 'alice' })
  })
})
