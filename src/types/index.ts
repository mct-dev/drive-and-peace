export type GoalStatus = 'active' | 'paused' | 'retired'

export interface UserProfile {
  id: string
  name: string
  why: string
  vision: string
  legacy: string
  createdAt: string
  updatedAt: string
}

export interface Goal {
  id: string
  title: string
  description: string
  why: string
  status: GoalStatus
  createdAt: string
  updatedAt: string
  retiredAt?: string
}

export interface GoalVersion {
  id: string
  goalId: string
  title: string
  description: string
  why: string
  reasonForChange: string
  createdAt: string
}

export interface DailyEntry {
  id: string
  date: string
  energy?: number
  mood?: string
  onePercentAction: string
  goalId?: string
  possibleObstacle?: string
  tinyVersion?: string
  endOfDayResult?: string
  lesson?: string
  freeformText?: string
  createdAt: string
  updatedAt: string
}

export interface WeeklyReviewActionByGoal {
  goalId: string
  action: string
}

export interface WeeklyReview {
  id: string
  weekStart: string
  wins: string
  misses: string
  patterns: string
  livedVision: string
  drifted: string
  adjustment: string
  actionsByGoal: WeeklyReviewActionByGoal[]
  createdAt: string
  updatedAt: string
}

export type CoachRole = 'user' | 'assistant'

export interface CoachMessage {
  id: string
  role: CoachRole
  content: string
  createdAt: string
  linkedDailyEntryId?: string
  linkedWeeklyReviewId?: string
}

export interface AppStorage {
  version: number
  profile: UserProfile
  goals: Goal[]
  goalVersions: GoalVersion[]
  dailyEntries: DailyEntry[]
  weeklyReviews: WeeklyReview[]
  coachMessages: CoachMessage[]
}

export interface CoachProvider {
  generateResponse(input: string, context?: CoachContext): Promise<string>
}

export interface CoachContext {
  profile?: UserProfile
  goals?: Goal[]
  latestEntry?: DailyEntry
}
