import { describe, expect, it } from 'vitest'
import {
  formatDateISO,
  getWeekStartISO,
  isDateInWeek,
  parseISODate,
  todayISO,
} from './dates'

describe('dates', () => {
  it('formats ISO date', () => {
    expect(formatDateISO(new Date(2026, 6, 3))).toBe('2026-07-03')
  })

  it('parses ISO date', () => {
    const d = parseISODate('2026-07-03')
    expect(d.getFullYear()).toBe(2026)
    expect(d.getMonth()).toBe(6)
    expect(d.getDate()).toBe(3)
  })

  it('returns today in ISO format', () => {
    expect(todayISO()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('computes week start as Monday', () => {
    const friday = new Date(2026, 6, 3)
    expect(getWeekStartISO(friday)).toBe('2026-06-29')
  })

  it('checks date in week', () => {
    expect(isDateInWeek('2026-07-01', '2026-06-29')).toBe(true)
    expect(isDateInWeek('2026-07-05', '2026-06-29')).toBe(true)
    expect(isDateInWeek('2026-07-07', '2026-06-29')).toBe(false)
  })
})
