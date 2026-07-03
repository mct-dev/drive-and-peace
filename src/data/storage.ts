import { createSeedData, STORAGE_VERSION } from './seed'
import type { AppStorage } from '../types'

const STORAGE_KEY = 'drive-peace-data'

export function isAppStorage(value: unknown): value is AppStorage {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  return (
    typeof v.version === 'number' &&
    typeof v.profile === 'object' &&
    v.profile !== null &&
    Array.isArray(v.goals) &&
    Array.isArray(v.goalVersions) &&
    Array.isArray(v.dailyEntries) &&
    Array.isArray(v.weeklyReviews) &&
    Array.isArray(v.coachMessages)
  )
}

function migrate(data: AppStorage): AppStorage {
  if (data.version < STORAGE_VERSION) {
    return { ...data, version: STORAGE_VERSION }
  }
  return data
}

export function loadStorage(): AppStorage {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const seed = createSeedData()
      saveStorage(seed)
      return seed
    }
    const parsed: unknown = JSON.parse(raw)
    if (!isAppStorage(parsed)) {
      console.warn('Drive + Peace: corrupted storage, resetting.')
      const seed = createSeedData()
      saveStorage(seed)
      return seed
    }
    return migrate(parsed)
  } catch {
    console.warn('Drive + Peace: failed to read storage, resetting.')
    const seed = createSeedData()
    saveStorage(seed)
    return seed
  }
}

export function saveStorage(data: AppStorage): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function exportStorageJSON(data: AppStorage): string {
  return JSON.stringify(data, null, 2)
}

export function importStorageJSON(json: string): AppStorage {
  const parsed: unknown = JSON.parse(json)
  if (!isAppStorage(parsed)) {
    throw new Error('Invalid data format. Expected a Drive + Peace export file.')
  }
  return migrate(parsed)
}

export function resetStorage(): AppStorage {
  const seed = createSeedData()
  saveStorage(seed)
  return seed
}

export { STORAGE_KEY }
