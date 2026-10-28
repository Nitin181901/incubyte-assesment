import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthProvider } from '../auth/AuthContext'
import LoginPage from './LoginPage'
import { clearToken } from '../backend/client'

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={[ '/login' ]}>
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    </MemoryRouter>,
  )
}


describe('LoginPage', () => {
  beforeEach(() => {
    clearToken()
    vi.restoreAllMocks()
  })

  it('shows an error alert on failed login', async () => {
    const user = userEvent.setup()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        text: async () => JSON.stringify({ error: 'unauthorized', details: {} }),
      }),
    )

    renderLogin()

    await user.type(screen.getByLabelText(/email/i), 'bad@acme.test')
    await user.type(screen.getByLabelText(/password/i), 'wrong')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/unauthorized/i)
    })
  })
})
