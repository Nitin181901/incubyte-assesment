const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export function formatUsd(value) {
  if (value == null || value === '') return '—'
  return usdFormatter.format(Number(value))
}

export function formatLocalSalary(value, currencyCode = 'USD') {
  if (value == null || value === '') return '—'
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode || 'USD',
      maximumFractionDigits: 0,
    }).format(Number(value))
  } catch {
    return `${Number(value).toLocaleString('en-US')} ${currencyCode || ''}`.trim()
  }
}

export function formatDate(value) {
  if (!value) return '—'
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  // Prefer shared hired-on display (DD MMM YYYY, UTC calendar day).
  const day = String(date.getUTCDate()).padStart(2, '0')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${day} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`
}

export function employeeName(employee) {
  return `${employee.first_name || ''} ${employee.last_name || ''}`.trim()
}
