import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import OutliersSection from './OutliersSection'

describe('OutliersSection', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('re-queries when the threshold slider changes', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ threshold: 0.4, limit: 50, data: [] }),
    })
    vi.stubGlobal('fetch', fetchMock)

    render(
      <MemoryRouter>
        <OutliersSection refreshKey={0} />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(fetchMock.mock.calls.some(([url]) => String(url).includes('threshold=0.4'))).toBe(true)
    })

    const slider = screen.getByRole('slider')
    fireEvent.change(slider, { target: { value: '60' } })

    await waitFor(() => {
      expect(fetchMock.mock.calls.some(([url]) => String(url).includes('threshold=0.6'))).toBe(true)
    })
  })
})
