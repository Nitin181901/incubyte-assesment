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
  return date.toLocaleDateString('en-CA')
}

export function employeeName(employee) {
  return `${employee.first_name || ''} ${employee.last_name || ''}`.trim()
}
