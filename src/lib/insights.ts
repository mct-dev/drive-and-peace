import type { DailyEntry, Goal, WeeklyReview } from '../types'
import { isDateInWeek } from './dates'

export interface PatternNote {
  id: string
  label: string
  note: string
}

export interface InsightsSummary {
  totalEntries: number
  entriesThisWeek: number
  mostSupportedGoalId: string | null
  mostSupportedGoalTitle: string | null
  recentMoods: string[]
  commonWords: string[]
  driftSignals: string[]
  patternNotes: PatternNote[]
  driverDays: number
  passengerDays: number
  averageDayRating: number | null
  weeklyGridCellsFilled: number
  weeklyGridCellsTotal: number
}

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'is', 'it',
  'i', 'my', 'me', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'did',
  'that', 'this', 'with', 'from', 'not', 'are', 'am', 'as', 'so', 'if', 'when', 'what',
  'how', 'all', 'just', 'very', 'can', 'will', 'would', 'could', 'should', 'about', 'into',
  'than', 'then', 'them', 'they', 'their', 'there', 'been', 'also', 'too', 'out', 'up',
])

const DRIFT_TERMS = ['avoid', 'resent', 'perfection', 'overcomplicat', 'distract', 'numb', 'scroll', 'procrastin']

const PATTERN_RULES: Array<{
  id: string
  terms: string[]
  label: string
  note: string
}> = [
  {
    id: 'freedom-loss',
    terms: ['trapped', 'time', 'freedom', 'stuck', 'cornered'],
    label: 'Possible pattern: freedom-loss',
    note: 'Repeated language around being trapped or losing freedom may point to self-erasure or over-commitment. What is one boundary you could hold this week?',
  },
  {
    id: 'family-load',
    terms: ['jamie', 'kids', 'family', 'marriage', 'wife', 'children'],
    label: 'Possible pattern: family-load / presence',
    note: 'Family themes are showing up often. Presence matters — but so does not disappearing inside the role. Where did you show up, and where did you go quiet?',
  },
  {
    id: 'building-energy',
    terms: ['build', 'income', 'money', 'product', 'ship', 'business'],
    label: 'Possible pattern: building-energy',
    note: 'Building and financial language is recurring. Useful drive — watch for overcomplication or using work to avoid harder conversations.',
  },
  {
    id: 'stress-spiral',
    terms: ['stress', 'anxiety', 'spiral', 'overwhelm', 'exhausted'],
    label: 'Possible pattern: stress-spiral',
    note: 'Stress language is clustering. Return to the next right action — one small step, not a full life redesign.',
  },
  {
    id: 'passenger-streak',
    terms: ['passenger'],
    label: 'Possible pattern: passenger days',
    note: 'Several passenger days in a row may mean life has the wheel. Protect non-negotiables and lower the bar — progress still counts.',
  },
]

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w))
}

function entryTextBlob(entry: DailyEntry): string {
  return [
    entry.freeformText,
    entry.reflection,
    entry.lesson,
    entry.onePercentAction,
    entry.possibleObstacle,
    entry.planning,
    entry.wins,
    entry.bodyNote,
    entry.mindNote,
    ...entry.missions.map((m) => m.text),
  ]
    .filter(Boolean)
    .join(' ')
}

export function extractCommonWords(entries: DailyEntry[], limit = 8): string[] {
  const counts = new Map<string, number>()
  const recent = entries.slice(0, 14)
  for (const entry of recent) {
    for (const word of tokenize(entryTextBlob(entry))) {
      counts.set(word, (counts.get(word) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([w]) => w)
}

export function generatePatternNotes(entries: DailyEntry[], reviews: WeeklyReview[]): PatternNote[] {
  const blob = [
    ...entries.slice(0, 20).map((e) => entryTextBlob(e)),
    ...entries
      .slice(0, 10)
      .filter((e) => e.dayType === 'passenger')
      .map(() => 'passenger'),
    ...reviews.slice(0, 5).map((r) => [r.patterns, r.drifted, r.misses, r.reflection].join(' ')),
  ]
    .join(' ')
    .toLowerCase()

  return PATTERN_RULES.filter((rule) => rule.terms.some((t) => blob.includes(t))).map((rule) => ({
    id: rule.id,
    label: rule.label,
    note: rule.note,
  }))
}

export function extractDriftSignals(entries: DailyEntry[], reviews: WeeklyReview[]): string[] {
  const signals: string[] = []
  for (const entry of entries.slice(0, 10)) {
    const blob = entryTextBlob(entry).toLowerCase()
    for (const term of DRIFT_TERMS) {
      if (blob.includes(term)) signals.push(`"${term}" in entry ${entry.date}`)
    }
  }
  for (const review of reviews.slice(0, 3)) {
    if (review.drifted.trim()) {
      signals.push(`Drift noted: week of ${review.weekStart}`)
    }
  }
  return [...new Set(signals)].slice(0, 6)
}

function countGridCells(reviews: WeeklyReview[]): { filled: number; total: number } {
  let filled = 0
  let total = 0
  for (const review of reviews) {
    for (const row of review.goalGrid ?? []) {
      for (const cell of row.days) {
        total++
        if (cell.trim()) filled++
      }
    }
  }
  return { filled, total }
}

export function computeInsights(
  entries: DailyEntry[],
  goals: Goal[],
  reviews: WeeklyReview[],
  weekStart: string,
): InsightsSummary {
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date))
  const entriesThisWeek = sorted.filter((e) => isDateInWeek(e.date, weekStart)).length

  const goalCounts = new Map<string, number>()
  for (const entry of sorted) {
    if (entry.goalId) {
      goalCounts.set(entry.goalId, (goalCounts.get(entry.goalId) ?? 0) + 1)
    }
  }
  let mostSupportedGoalId: string | null = null
  let maxCount = 0
  for (const [id, count] of goalCounts) {
    if (count > maxCount) {
      maxCount = count
      mostSupportedGoalId = id
    }
  }
  const mostSupportedGoal = goals.find((g) => g.id === mostSupportedGoalId)

  const recentMoods = sorted
    .map((e) => e.mindNote?.trim() || e.mood?.trim())
    .filter((m): m is string => Boolean(m))
    .slice(0, 5)

  const driverDays = sorted.filter((e) => e.dayType === 'driver').length
  const passengerDays = sorted.filter((e) => e.dayType === 'passenger').length

  const ratings = sorted.map((e) => e.dayRating).filter((r): r is number => r !== undefined)
  const averageDayRating =
    ratings.length > 0 ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10 : null

  const grid = countGridCells(reviews)

  return {
    totalEntries: sorted.length,
    entriesThisWeek,
    mostSupportedGoalId,
    mostSupportedGoalTitle: mostSupportedGoal?.title ?? null,
    recentMoods,
    commonWords: extractCommonWords(sorted),
    driftSignals: extractDriftSignals(sorted, reviews),
    patternNotes: generatePatternNotes(sorted, reviews),
    driverDays,
    passengerDays,
    averageDayRating,
    weeklyGridCellsFilled: grid.filled,
    weeklyGridCellsTotal: grid.total,
  }
}
