import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ThemeModeProvider } from '../theme'
import OutliersSection from './OutliersSection'

describe('OutliersSection', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('loads outliers at the fixed 40% threshold', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify({
          threshold: 0.4,
          limit: 50,
          data: [
            {
              id: 1,
              name: 'Ada Lovelace',
              email: 'ada@acme.test',
              job_title: 'Engineer',
              country: { code: 'US' },
              salary_usd: 200000,
              deviation_pct: 0.5,
            },
          ],
        }),
    })
    vi.stubGlobal('fetch', fetchMock)

    render(
      <ThemeModeProvider>
        <MemoryRouter>
          <OutliersSection refreshKey={0} />
        </MemoryRouter>
      </ThemeModeProvider>,
    )

    await waitFor(() => {
      expect(fetchMock.mock.calls.some(([url]) => String(url).includes('threshold=0.4'))).toBe(true)
    })

    expect(await screen.findByText('Ada Lovelace')).toBeInTheDocument()
    expect(screen.queryByRole('slider')).not.toBeInTheDocument()
  })
})
