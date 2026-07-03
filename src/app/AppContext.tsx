import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { loadStorage, saveStorage, resetStorage } from '../data/storage'
import type {
  AppStorage,
  CoachMessage,
  DailyEntry,
  Goal,
  GoalMilestone,
  GoalVersion,
  ProgramSettings,
  UserProfile,
  WeeklyReview,
} from '../types'
import { createId, nowISO } from '../lib/id'

type ProfileFields = Pick<
  UserProfile,
  | 'name'
  | 'why'
  | 'vision'
  | 'legacy'
  | 'mission'
  | 'coreValues'
  | 'personToBecome'
  | 'goals1yr'
  | 'goals3yr'
  | 'goals5yr'
  | 'goals10yr'
>

type GoalFields = Pick<
  Goal,
  'title' | 'description' | 'why' | 'dailyAction' | 'milestones' | 'quarterStart' | 'sortOrder'
>

interface AppContextValue {
  data: AppStorage
  updateProfile: (patch: Partial<ProfileFields>) => void
  updateProgram: (patch: Partial<ProgramSettings>) => void
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void
  updateGoal: (id: string, patch: Partial<GoalFields>, reasonForChange?: string) => void
  setGoalStatus: (id: string, status: Goal['status']) => void
  upsertDailyEntry: (entry: Omit<DailyEntry, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void
  deleteDailyEntry: (id: string) => void
  upsertWeeklyReview: (
    review: Omit<WeeklyReview, 'id' | 'createdAt' | 'updatedAt'> & { id?: string },
  ) => void
  addCoachMessage: (msg: Omit<CoachMessage, 'id' | 'createdAt'>) => void
  replaceAllData: (data: AppStorage) => void
  resetAllData: () => AppStorage
  getGoalVersions: (goalId: string) => GoalVersion[]
}

const AppContext = createContext<AppContextValue | null>(null)

function persist(data: AppStorage): AppStorage {
  saveStorage(data)
  return data
}

function goalChanged(goal: Goal, patch: Partial<GoalFields>): boolean {
  return (
    (patch.title !== undefined && patch.title !== goal.title) ||
    (patch.description !== undefined && patch.description !== goal.description) ||
    (patch.why !== undefined && patch.why !== goal.why) ||
    (patch.dailyAction !== undefined && patch.dailyAction !== goal.dailyAction) ||
    (patch.milestones !== undefined &&
      JSON.stringify(patch.milestones) !== JSON.stringify(goal.milestones))
  )
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppStorage>(() => loadStorage())

  const mutate = useCallback((fn: (prev: AppStorage) => AppStorage) => {
    setData((prev) => persist(fn(prev)))
  }, [])

  const updateProfile = useCallback(
    (patch: Partial<ProfileFields>) => {
      mutate((prev) => ({
        ...prev,
        profile: { ...prev.profile, ...patch, updatedAt: nowISO() },
      }))
    },
    [mutate],
  )

  const updateProgram = useCallback(
    (patch: Partial<ProgramSettings>) => {
      mutate((prev) => ({
        ...prev,
        program: { ...prev.program, ...patch },
      }))
    },
    [mutate],
  )

  const addGoal = useCallback(
    (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
      const t = nowISO()
      const activeCount = data.goals.filter((g) => g.status === 'active').length
      const newGoal: Goal = {
        ...goal,
        id: createId(),
        status: 'active',
        sortOrder: goal.sortOrder || activeCount + 1,
        milestones: goal.milestones ?? [],
        dailyAction: goal.dailyAction ?? '',
        quarterStart: goal.quarterStart ?? t.slice(0, 10),
        createdAt: t,
        updatedAt: t,
      }
      mutate((prev) => ({ ...prev, goals: [...prev.goals, newGoal] }))
    },
    [mutate, data.goals],
  )

  const updateGoal = useCallback(
    (id: string, patch: Partial<GoalFields>, reasonForChange?: string) => {
      mutate((prev) => {
        const goal = prev.goals.find((g) => g.id === id)
        if (!goal) return prev

        let goalVersions = prev.goalVersions
        if (goalChanged(goal, patch) && reasonForChange?.trim()) {
          const version: GoalVersion = {
            id: createId(),
            goalId: id,
            title: goal.title,
            description: goal.description,
            why: goal.why,
            dailyAction: goal.dailyAction,
            milestones: goal.milestones as GoalMilestone[],
            reasonForChange: reasonForChange.trim(),
            createdAt: nowISO(),
          }
          goalVersions = [...goalVersions, version]
        }

        const goals = prev.goals.map((g) =>
          g.id === id ? { ...g, ...patch, updatedAt: nowISO() } : g,
        )
        return { ...prev, goals, goalVersions }
      })
    },
    [mutate],
  )

  const setGoalStatus = useCallback(
    (id: string, status: Goal['status']) => {
      mutate((prev) => ({
        ...prev,
        goals: prev.goals.map((g) =>
          g.id === id
            ? {
                ...g,
                status,
                updatedAt: nowISO(),
                retiredAt: status === 'retired' ? nowISO() : g.retiredAt,
              }
            : g,
        ),
      }))
    },
    [mutate],
  )

  const upsertDailyEntry = useCallback(
    (entry: Omit<DailyEntry, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
      mutate((prev) => {
        const t = nowISO()
        const existing = entry.id
          ? prev.dailyEntries.find((e) => e.id === entry.id)
          : prev.dailyEntries.find((e) => e.date === entry.date)

        if (existing) {
          const updated: DailyEntry = {
            ...existing,
            ...entry,
            id: existing.id,
            updatedAt: t,
          }
          return {
            ...prev,
            dailyEntries: prev.dailyEntries.map((e) => (e.id === existing.id ? updated : e)),
          }
        }

        const created: DailyEntry = {
          ...entry,
          id: createId(),
          createdAt: t,
          updatedAt: t,
        }
        return { ...prev, dailyEntries: [...prev.dailyEntries, created] }
      })
    },
    [mutate],
  )

  const deleteDailyEntry = useCallback(
    (id: string) => {
      mutate((prev) => ({
        ...prev,
        dailyEntries: prev.dailyEntries.filter((e) => e.id !== id),
      }))
    },
    [mutate],
  )

  const upsertWeeklyReview = useCallback(
    (review: Omit<WeeklyReview, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
      mutate((prev) => {
        const t = nowISO()
        const existing = review.id
          ? prev.weeklyReviews.find((r) => r.id === review.id)
          : prev.weeklyReviews.find((r) => r.weekStart === review.weekStart)

        if (existing) {
          const updated: WeeklyReview = {
            ...existing,
            ...review,
            id: existing.id,
            updatedAt: t,
          }
          return {
            ...prev,
            weeklyReviews: prev.weeklyReviews.map((r) => (r.id === existing.id ? updated : r)),
          }
        }

        const created: WeeklyReview = {
          ...review,
          id: createId(),
          createdAt: t,
          updatedAt: t,
        }
        return { ...prev, weeklyReviews: [...prev.weeklyReviews, created] }
      })
    },
    [mutate],
  )

  const addCoachMessage = useCallback(
    (msg: Omit<CoachMessage, 'id' | 'createdAt'>) => {
      mutate((prev) => ({
        ...prev,
        coachMessages: [
          ...prev.coachMessages,
          { ...msg, id: createId(), createdAt: nowISO() },
        ],
      }))
    },
    [mutate],
  )

  const replaceAllData = useCallback(
    (newData: AppStorage) => {
      setData(persist(newData))
    },
    [],
  )

  const resetAllData = useCallback((): AppStorage => {
    const fresh = resetStorage()
    setData(fresh)
    return fresh
  }, [])

  const getGoalVersions = useCallback(
    (goalId: string) =>
      data.goalVersions
        .filter((v) => v.goalId === goalId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [data.goalVersions],
  )

  const value = useMemo(
    () => ({
      data,
      updateProfile,
      updateProgram,
      addGoal,
      updateGoal,
      setGoalStatus,
      upsertDailyEntry,
      deleteDailyEntry,
      upsertWeeklyReview,
      addCoachMessage,
      replaceAllData,
      resetAllData,
      getGoalVersions,
    }),
    [
      data,
      updateProfile,
      updateProgram,
      addGoal,
      updateGoal,
      setGoalStatus,
      upsertDailyEntry,
      deleteDailyEntry,
      upsertWeeklyReview,
      addCoachMessage,
      replaceAllData,
      resetAllData,
      getGoalVersions,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
