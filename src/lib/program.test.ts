import { describe, expect, it } from 'vitest'
import {
  getDayInWeek,
  getDayNumber,
  getProgramWeekStart,
  getWeekNumber,
} from './program'

describe('program dates', () => {
  const start = '2026-06-29'

  it('computes day number from start', () => {
    expect(getDayNumber(start, '2026-06-29')).toBe(1)
    expect(getDayNumber(start, '2026-07-05')).toBe(7)
    expect(getDayNumber(start, '2026-07-06')).toBe(8)
  })

  it('computes week number', () => {
    expect(getWeekNumber(start, '2026-06-29')).toBe(1)
    expect(getWeekNumber(start, '2026-07-06')).toBe(2)
  })

  it('computes day in week', () => {
    expect(getDayInWeek(start, '2026-06-29')).toBe(1)
    expect(getDayInWeek(start, '2026-07-05')).toBe(7)
  })

  it('gets program week start', () => {
    expect(getProgramWeekStart(start, 2)).toBe('2026-07-06')
  })
})
