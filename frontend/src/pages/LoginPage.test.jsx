import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthProvider } from '../auth/AuthContext'
import { ThemeModeProvider } from '../theme'
import LoginPage from './LoginPage'
import { clearToken } from '../backend/client'

function renderLogin() {
  return render(
    <ThemeModeProvider>
      <MemoryRouter initialEntries={['/login']}>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </MemoryRouter>
    </ThemeModeProvider>,
  )
}

describe('LoginPage', () => {
  beforeEach(() => {
    clearToken()
    vi.restoreAllMocks()
  })

  it('shows an error alert on failed login', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        text: async () => JSON.stringify({ error: 'unauthorized', details: {} }),
      }),
    )

    renderLogin()

    fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
      target: { value: 'bad@acme.test' },
    })
    fireEvent.change(document.querySelector('input[type="password"]'), {
      target: { value: 'wrong' },
    })
    fireEvent.click(screen.getByRole('button', { name: /^Sign in$/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/unauthorized/i)
    })
  }, 10000)
})
