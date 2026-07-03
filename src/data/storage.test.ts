import { describe, expect, it } from 'vitest'
import { createSeedData } from '../data/seed'
import { exportStorageJSON, importStorageJSON, isAppStorage } from '../data/storage'

describe('storage validation', () => {
  it('validates seed data', () => {
    expect(isAppStorage(createSeedData())).toBe(true)
  })

  it('rejects invalid data', () => {
    expect(isAppStorage(null)).toBe(false)
    expect(isAppStorage({ version: 1 })).toBe(false)
    expect(isAppStorage('string')).toBe(false)
  })

  it('round-trips export/import', () => {
    const seed = createSeedData()
    const json = exportStorageJSON(seed)
    const imported = importStorageJSON(json)
    expect(imported.profile.why).toBe(seed.profile.why)
    expect(imported.goals).toHaveLength(3)
  })

  it('throws on invalid import', () => {
    expect(() => importStorageJSON('{}')).toThrow()
  })
})
