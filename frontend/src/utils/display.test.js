import { describe, expect, it } from 'vitest'
import {
  avatarColor,
  formatCompactPayroll,
  formatMoney,
  greetingForHour,
  initials,
  peopleMatchLabel,
} from './display'

describe('display helpers', () => {
  it('returns stable avatar colors for the same name', () => {
    expect(avatarColor('Alice Anderson')).toBe(avatarColor('Alice Anderson'))
    expect(avatarColor('Alice Anderson')).not.toBe(avatarColor('Bob Baker'))
  })

  it('builds initials', () => {
    expect(initials('Alice Anderson')).toBe('AA')
    expect(initials('Prince')).toBe('PR')
    expect(initials('')).toBe('?')
  })

  it('formats money and compact payroll safely', () => {
    expect(formatMoney(100000, 'USD')).toMatch(/\$100,000/)
    expect(formatMoney(null)).toBe('—')
    expect(formatCompactPayroll(678600000)).toMatch(/\$678\.6M/)
    expect(formatCompactPayroll(NaN)).toBe('—')
  })

  it('greets by hour', () => {
    expect(greetingForHour(9)).toBe('Good morning')
    expect(greetingForHour(14)).toBe('Good afternoon')
    expect(greetingForHour(21)).toBe('Good evening')
  })

  it('labels people matches', () => {
    expect(peopleMatchLabel(1)).toBe('1 person matches your filters')
    expect(peopleMatchLabel(10000)).toBe('10,000 people match your filters')
  })
})
