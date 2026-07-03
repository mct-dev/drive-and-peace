export type GoalStatus = 'active' | 'paused' | 'retired'
export type DayType = 'driver' | 'passenger'

export interface GoalMilestone {
  id: string
  text: string
  done: boolean
}

export interface MissionItem {
  id: string
  text: string
  done: boolean
}

export interface ScheduleSlot {
  hour: string
  note: string
}

export interface GoalGridRow {
  goalId: string
  days: [string, string, string, string, string, string, string]
}

export interface ProgramSettings {
  startDate: string
}

export interface UserProfile {
  id: string
  name: string
  why: string
  vision: string
  legacy: string
  mission: string
  coreValues: string
  personToBecome: string
  goals1yr: string
  goals3yr: string
  goals5yr: string
  goals10yr: string
  createdAt: string
  updatedAt: string
}

export interface Goal {
  id: string
  title: string
  description: string
  why: string
  dailyAction: string
  milestones: GoalMilestone[]
  quarterStart: string
  sortOrder: number
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
  dailyAction: string
  milestones: GoalMilestone[]
  reasonForChange: string
  createdAt: string
}

export interface DailyEntry {
  id: string
  date: string
  dayNumber?: number
  dayType?: DayType
  wakeTime?: string
  sleepTime?: string
  bodyNote?: string
  mindNote?: string
  dayRating?: number
  energy?: number
  mood?: string
  onePercentAction: string
  missions: MissionItem[]
  tasks: MissionItem[]
  nonNegotiables: MissionItem[]
  planning?: string
  wins?: string
  schedule: ScheduleSlot[]
  reflection?: string
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
  weekNumber?: number
  wins: string
  misses: string
  patterns: string
  livedVision: string
  drifted: string
  adjustment: string
  reflection?: string
  nextWeekMainGoal?: string
  dailyMainGoal?: string
  daysOnTrack?: number
  goalReached?: string
  weekScore?: number
  actionsByGoal: WeeklyReviewActionByGoal[]
  goalGrid: GoalGridRow[]
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
  program: ProgramSettings
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
  program?: ProgramSettings
}
