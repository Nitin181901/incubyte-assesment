import { colors, departmentColors, departmentFallback } from '../theme/tokens'

const AVATAR_PALETTE = [
  colors.indigo,
  colors.violet,
  colors.pink,
  colors.cyan,
  colors.teal,
  colors.orange,
  colors.coral,
]

export function hashString(input) {
  const s = String(input || '')
  let hash = 0
  for (let i = 0; i < s.length; i += 1) {
    hash = (hash << 5) - hash + s.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export function avatarColor(name) {
  const idx = hashString(name) % AVATAR_PALETTE.length
  return AVATAR_PALETTE[idx]
}

export function initials(name) {
  const parts = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase()
}

export function formatMoney(value, currency = 'USD') {
  if (value == null || value === '' || Number.isNaN(Number(value))) return '—'
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: 0,
    }).format(Number(value))
  } catch {
    return `${Number(value).toLocaleString('en-US')} ${currency || ''}`.trim()
  }
}

export function formatCompactPayroll(value) {
  if (value == null || value === '' || Number.isNaN(Number(value))) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(Number(value))
}

export function greetingForHour(hour = new Date().getHours()) {
  const h = Number(hour)
  if (h >= 5 && h < 12) return 'Good morning'
  if (h >= 12 && h < 17) return 'Good afternoon'
  return 'Good evening'
}

export function firstNameFromUser(user) {
  if (!user) return 'there'
  if (user.name) return String(user.name).trim().split(/\s+/)[0] || 'there'
  if (user.email) return String(user.email).split('@')[0]
  return 'there'
}

export function departmentStyle(department) {
  return departmentColors[department] || departmentFallback
}

export function peopleMatchLabel(count) {
  const n = Number(count) || 0
  const formatted = n.toLocaleString('en-US')
  if (n === 1) return '1 person matches your filters'
  return `${formatted} people match your filters`
}

const FLAG_OFFSET = 127397

export function countryFlag(code) {
  const c = String(code || '').toUpperCase()
  if (!/^[A-Z]{2}$/.test(c)) return '🏳️'
  return String.fromCodePoint(...[...c].map((ch) => FLAG_OFFSET + ch.charCodeAt(0)))
}

export function safeNumber(value, fallback = null) {
  if (value == null || value === '') return fallback
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}
