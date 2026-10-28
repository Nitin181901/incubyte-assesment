const TOKEN_KEY = 'acme_token'
const BASE = '/backend/v1'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export class ApiError extends Error {
  constructor(status, body) {
    super(body?.error || `Request failed (${status})`)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

export async function api(path, options = {}) {
  const { body: requestBody, headers: extraHeaders, rawResponse = false, ...rest } = options
  const isFormData = typeof FormData !== 'undefined' && requestBody instanceof FormData

  const headers = {
    Accept: 'application/json',
    ...(!isFormData && requestBody != null ? { 'Content-Type': 'application/json' } : {}),
    ...extraHeaders,
  }

  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${BASE}${path}`, {
    ...rest,
    headers,
    body: requestBody == null ? undefined : isFormData ? requestBody : JSON.stringify(requestBody),
  })

  if (rawResponse) {
    if (!response.ok) {
      let data = null
      try {
        data = JSON.parse(await response.text())
      } catch {
        data = {}
      }
      if (response.status === 401) {
        clearToken()
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
          window.location.assign('/login')
        }
      }
      throw new ApiError(response.status, data || {})
    }
    return response
  }

  let data = null
  const text = await response.text()
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = { error: text }
    }
  }

  if (!response.ok) {
    if (response.status === 401) {
      clearToken()
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.assign('/login')
      }
    }
    throw new ApiError(response.status, data || {})
  }

  return data
}

