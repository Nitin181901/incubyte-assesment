import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api, clearToken, setToken } from './client'

describe('api client', () => {
  beforeEach(() => {
    clearToken()
    vi.restoreAllMocks()
    window.history.pushState({}, '', '/')
  })

  it('attaches the bearer token from localStorage', async () => {
    setToken('test-token')
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ ok: true }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await api('/me')

    expect(fetchMock).toHaveBeenCalledWith(
      '/backend/v1/me',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
        }),
      }),
    )
  })

  it('clears the token and redirects on 401', async () => {
    setToken('expired')
    const assign = vi.fn()
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, pathname: '/', assign },
    })

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        text: async () => JSON.stringify({ error: 'unauthorized', details: {} }),
      }),
    )

    await expect(api('/me')).rejects.toMatchObject({ status: 401 })
    expect(localStorage.getItem('acme_token')).toBeNull()
    expect(assign).toHaveBeenCalledWith('/login')
  })
})
