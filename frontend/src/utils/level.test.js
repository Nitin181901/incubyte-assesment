import { describe, expect, it } from 'vitest'
import { levelFromJobTitle } from './level'

describe('levelFromJobTitle', () => {
  it('maps seeded titles to L1–L6', () => {
    expect(levelFromJobTitle('Software Engineer I')).toBe('L1')
    expect(levelFromJobTitle('Software Engineer II')).toBe('L2')
    expect(levelFromJobTitle('Account Manager')).toBe('L3')
    expect(levelFromJobTitle('Senior Software Engineer')).toBe('L4')
    expect(levelFromJobTitle('Staff Engineer')).toBe('L5')
    expect(levelFromJobTitle('Sales Director')).toBe('L6')
  })

  it('falls back with a seniority heuristic', () => {
    expect(levelFromJobTitle('Senior Wizard')).toBe('L4')
    expect(levelFromJobTitle('Director of Magic')).toBe('L6')
    expect(levelFromJobTitle('')).toBe('—')
  })
})
