import { describe, expect, it } from 'vitest'
import { computeInsights, generatePatternNotes } from './insights'
import type { DailyEntry } from '../types'

const entry = (overrides: Partial<DailyEntry> & Pick<DailyEntry, 'date'>): DailyEntry => ({
  id: overrides.id ?? '1',
  onePercentAction: overrides.onePercentAction ?? 'action',
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
  ...overrides,
})

describe('insights', () => {
  it('computes totals', () => {
    const entries = [
      entry({ date: '2026-07-01', freeformText: 'felt trapped and stuck' }),
      entry({ date: '2026-07-02', mood: 'calm' }),
    ]
    const result = computeInsights(entries, [], [], '2026-06-29')
    expect(result.totalEntries).toBe(2)
    expect(result.entriesThisWeek).toBe(2)
    expect(result.recentMoods).toContain('calm')
  })

  it('generates freedom-loss pattern note', () => {
    const entries = [
      entry({ date: '2026-07-01', freeformText: 'I feel trapped, no freedom' }),
      entry({ date: '2026-07-02', lesson: 'time keeps slipping' }),
    ]
    const notes = generatePatternNotes(entries, [])
    expect(notes.some((n) => n.id === 'freedom-loss')).toBe(true)
  })

  it('generates family pattern note', () => {
    const entries = [entry({ date: '2026-07-01', freeformText: 'Jamie and the kids need me' })]
    const notes = generatePatternNotes(entries, [])
    expect(notes.some((n) => n.id === 'family-load')).toBe(true)
  })
})
