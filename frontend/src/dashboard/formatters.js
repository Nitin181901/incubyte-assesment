import { formatUsd } from '../employees/formatters'

export { formatUsd }

export function formatCompactUsd(value) {
  if (value == null || value === '') return '—'
  const n = Number(value)
  if (Number.isNaN(n)) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(n)
}

export function formatPercent(value) {
  if (value == null || value === '') return '—'
  const n = Number(value) * 100
  const sign = n > 0 ? '+' : ''
  return `${sign}${n.toFixed(0)}%`
}

export function breakdownLabel(row, by) {
  if (by === 'country') {
    const key = row.key || {}
    return `${key.code || ''} — ${key.name || ''}`.replace(/^ — | — $/g, '') || 'Unknown'
  }
  return row.key || 'Unknown'
}
