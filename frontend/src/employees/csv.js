import { api, getToken } from '../backend/client'

const TEMPLATE = [
  'first_name,last_name,email,country_code,department,job_title,salary,hired_on',
  'Ada,Lovelace,ada.lovelace@acme.test,US,Engineering,Software Engineer,120000,2020-01-15',
].join('\n')

export function downloadTemplate() {
  const blob = new Blob([ TEMPLATE ], { type: 'text/csv;charset=utf-8' })
  triggerDownload(blob, 'employees-template.csv')
}

export async function exportEmployeesCsv(filters) {
  const query = new URLSearchParams()
  Object.entries(filters || {}).forEach(([ key, value ]) => {
    if (value != null && String(value) !== '' && ![ 'page', 'per_page' ].includes(key)) {
      query.set(key, String(value))
    }
  })

  const response = await api(`/employees/export?${query.toString()}`, { rawResponse: true })
  const blob = await response.blob()
  const disposition = response.headers.get('Content-Disposition') || ''
  const match = disposition.match(/filename="?([^"]+)"?/)
  const filename = match?.[1] || `employees-${new Date().toISOString().slice(0, 10)}.csv`
  triggerDownload(blob, filename)
}

export async function importEmployeesCsv(file, { dryRun = false } = {}) {
  const body = new FormData()
  body.append('file', file)
  if (dryRun) body.append('dry_run', 'true')
  return api('/employees/import', { method: 'POST', body })
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

// Kept for tests that assert auth header wiring without going through api().
export function authHeaderForTests() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}
