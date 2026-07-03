import { describe, expect, it } from 'vitest'
import { migrateToCurrent } from '../data/migrate'
import { createSeedData } from '../data/seed'

describe('migrate v1 to v2', () => {
  it('migrates legacy storage shape', () => {
    const legacy = {
      version: 1,
      profile: {
        id: 'p1',
        name: 'Test',
        why: 'why',
        vision: 'vision text',
        legacy: 'legacy',
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
      goals: [
        {
          id: 'g1',
          title: 'Goal',
          description: 'desc',
          why: 'why',
          status: 'active',
          createdAt: '2026-01-01',
          updatedAt: '2026-01-01',
        },
      ],
      goalVersions: [],
      dailyEntries: [
        {
          id: 'e1',
          date: '2026-06-01',
          onePercentAction: 'walk',
          energy: 4,
          mood: 'calm',
          createdAt: '2026-01-01',
          updatedAt: '2026-01-01',
        },
      ],
      weeklyReviews: [],
      coachMessages: [],
    }

    const migrated = migrateToCurrent(legacy)
    expect(migrated.version).toBe(2)
    expect(migrated.program.startDate).toBe('2026-06-01')
    expect(migrated.profile.mission).toBe('vision text')
    expect(migrated.goals[0].dailyAction).toBe('')
    expect(migrated.goals[0].sortOrder).toBe(1)
    expect(migrated.dailyEntries[0].dayRating).toBe(8)
    expect(migrated.dailyEntries[0].missions).toHaveLength(10)
    expect(migrated.dailyEntries[0].missions[0].text).toBe('walk')
  })

  it('preserves v2 seed data', () => {
    const seed = createSeedData()
    const migrated = migrateToCurrent(seed as unknown as Record<string, unknown>)
    expect(migrated.goals).toHaveLength(3)
    expect(migrated.goals[0].dailyAction).toBeTruthy()
  })
})
