import { createId } from '../lib/id'
import { todayISO } from '../lib/dates'
import { generateDefaultSchedule } from '../lib/program'
import type {
  AppStorage,
  DailyEntry,
  Goal,
  GoalGridRow,
  GoalVersion,
  MissionItem,
  UserProfile,
  WeeklyReview,
} from '../types'

function ensureMissions(missions?: MissionItem[], count = 10): MissionItem[] {
  const items = missions ?? []
  const result = [...items]
  while (result.length < count) {
    result.push({ id: createId(), text: '', done: false })
  }
  return result.slice(0, count)
}

function migrateGoal(goal: Partial<Goal>, index: number, t: string): Goal {
  return {
    id: goal.id ?? createId(),
    title: goal.title ?? '',
    description: goal.description ?? '',
    why: goal.why ?? '',
    dailyAction: goal.dailyAction ?? '',
    milestones: goal.milestones ?? [],
    quarterStart: goal.quarterStart ?? t.slice(0, 10),
    sortOrder: goal.sortOrder ?? index + 1,
    status: goal.status ?? 'active',
    createdAt: goal.createdAt ?? t,
    updatedAt: goal.updatedAt ?? t,
    retiredAt: goal.retiredAt,
  }
}

function migrateProfile(profile: Partial<UserProfile>, t: string): UserProfile {
  const vision = profile.vision ?? ''
  return {
    id: profile.id ?? createId(),
    name: profile.name ?? '',
    why: profile.why ?? '',
    vision,
    legacy: profile.legacy ?? '',
    mission: profile.mission ?? vision,
    coreValues: profile.coreValues ?? '',
    personToBecome: profile.personToBecome ?? '',
    goals1yr: profile.goals1yr ?? '',
    goals3yr: profile.goals3yr ?? '',
    goals5yr: profile.goals5yr ?? '',
    goals10yr: profile.goals10yr ?? '',
    createdAt: profile.createdAt ?? t,
    updatedAt: profile.updatedAt ?? t,
  }
}

function migrateDailyEntry(entry: Partial<DailyEntry> & { date: string }): DailyEntry {
  const t = entry.createdAt ?? new Date().toISOString()
  const missions = ensureMissions(entry.missions)
  if (entry.onePercentAction?.trim() && !missions[0]?.text.trim()) {
    missions[0] = { ...missions[0], text: entry.onePercentAction.trim() }
  }

  return {
    id: entry.id ?? createId(),
    date: entry.date,
    dayNumber: entry.dayNumber,
    dayType: entry.dayType,
    wakeTime: entry.wakeTime,
    sleepTime: entry.sleepTime,
    bodyNote: entry.bodyNote ?? entry.mood,
    mindNote: entry.mindNote,
    dayRating: entry.dayRating ?? (entry.energy ? entry.energy * 2 : undefined),
    energy: entry.energy,
    mood: entry.mood,
    onePercentAction:
      entry.onePercentAction?.trim() ||
      missions.find((m) => m.text.trim())?.text ||
      '',
    missions,
    tasks: entry.tasks ?? [],
    nonNegotiables: entry.nonNegotiables ?? [],
    planning: entry.planning ?? entry.possibleObstacle,
    wins: entry.wins,
    schedule: entry.schedule?.length ? entry.schedule : generateDefaultSchedule(),
    reflection: entry.reflection ?? entry.freeformText,
    goalId: entry.goalId,
    possibleObstacle: entry.possibleObstacle,
    tinyVersion: entry.tinyVersion,
    endOfDayResult: entry.endOfDayResult,
    lesson: entry.lesson,
    freeformText: entry.freeformText,
    createdAt: t,
    updatedAt: entry.updatedAt ?? t,
  }
}

function migrateWeeklyReview(review: Partial<WeeklyReview> & { weekStart: string }): WeeklyReview {
  const t = review.createdAt ?? new Date().toISOString()
  return {
    id: review.id ?? createId(),
    weekStart: review.weekStart,
    weekNumber: review.weekNumber,
    wins: review.wins ?? '',
    misses: review.misses ?? '',
    patterns: review.patterns ?? '',
    livedVision: review.livedVision ?? '',
    drifted: review.drifted ?? '',
    adjustment: review.adjustment ?? '',
    reflection: review.reflection,
    nextWeekMainGoal: review.nextWeekMainGoal,
    dailyMainGoal: review.dailyMainGoal,
    daysOnTrack: review.daysOnTrack,
    goalReached: review.goalReached,
    weekScore: review.weekScore,
    actionsByGoal: review.actionsByGoal ?? [],
    goalGrid: review.goalGrid ?? [],
    createdAt: t,
    updatedAt: review.updatedAt ?? t,
  }
}

function migrateGoalVersion(v: Partial<GoalVersion>): GoalVersion {
  return {
    id: v.id ?? createId(),
    goalId: v.goalId ?? '',
    title: v.title ?? '',
    description: v.description ?? '',
    why: v.why ?? '',
    dailyAction: v.dailyAction ?? '',
    milestones: v.milestones ?? [],
    reasonForChange: v.reasonForChange ?? '',
    createdAt: v.createdAt ?? new Date().toISOString(),
  }
}

export function buildGoalGrid(
  goals: Goal[],
  existing: GoalGridRow[] = [],
): GoalGridRow[] {
  const active = goals
    .filter((g) => g.status === 'active')
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, 3)

  return active.map((goal) => {
    const row = existing.find((r) => r.goalId === goal.id)
    return {
      goalId: goal.id,
      days: row?.days ?? ['', '', '', '', '', '', ''],
    }
  })
}

export function migrateToCurrent(data: Record<string, unknown>): AppStorage {
  const t = new Date().toISOString()
  const rawGoals = (data.goals as Partial<Goal>[]) ?? []
  const goals = rawGoals.map((g, i) => migrateGoal(g, i, t))
  const dailyEntries = ((data.dailyEntries as Partial<DailyEntry>[]) ?? []).map((e) =>
    migrateDailyEntry(e as Partial<DailyEntry> & { date: string }),
  )
  const weeklyReviews = ((data.weeklyReviews as Partial<WeeklyReview>[]) ?? []).map((r) =>
    migrateWeeklyReview(r as Partial<WeeklyReview> & { weekStart: string }),
  )

  const earliestEntry = dailyEntries
    .map((e) => e.date)
    .sort()[0]

  const program = (data.program as { startDate?: string }) ?? {}
  const startDate = program.startDate ?? earliestEntry ?? todayISO()

  return {
    version: 2,
    program: { startDate },
    profile: migrateProfile((data.profile as Partial<UserProfile>) ?? {}, t),
    goals,
    goalVersions: ((data.goalVersions as Partial<GoalVersion>[]) ?? []).map(migrateGoalVersion),
    dailyEntries,
    weeklyReviews: weeklyReviews.map((r) => ({
      ...r,
      goalGrid: r.goalGrid.length ? r.goalGrid : buildGoalGrid(goals, r.goalGrid),
    })),
    coachMessages: (data.coachMessages as AppStorage['coachMessages']) ?? [],
  }
}
