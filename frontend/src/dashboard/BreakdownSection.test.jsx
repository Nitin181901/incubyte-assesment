import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import BreakdownSection from './BreakdownSection'

describe('BreakdownSection', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('requests a new breakdown when the dimension toggle changes', async () => {
    const user = userEvent.setup()
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify({
          by: 'department',
          data: [
            {
              key: 'Engineering',
              headcount: 3,
              avg: 100,
              median: 100,
              p25: 80,
              p75: 120,
              p90: 130,
            },
          ],
        }),
    })
    vi.stubGlobal('fetch', fetchMock)

    render(<BreakdownSection refreshKey={0} />)

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        '/backend/v1/stats/breakdown?by=department',
        expect.any(Object),
      )
    })

    await user.click(screen.getByRole('button', { name: /^Country$/i }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        '/backend/v1/stats/breakdown?by=country',
        expect.any(Object),
      )
    })
  })
})
