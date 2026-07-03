import type { CoachContext, CoachProvider } from '../types'

const SELF_ERASURE_TERMS = ['trapped', 'freedom', 'lost', 'self', 'erase', 'disappear', 'invisible']
const FAMILY_TERMS = ['family', 'kids', 'marriage', 'wife', 'jamie', 'child', 'children', 'spouse', 'partner']
const BUILD_TERMS = ['money', 'income', 'build', 'building', 'financial', 'business', 'revenue', 'product']
const STRESS_TERMS = ['stress', 'anxiety', 'spiral', 'overwhelm', 'panic', 'worried', 'exhausted']

function matchesAny(text: string, terms: string[]): boolean {
  const lower = text.toLowerCase()
  return terms.some((t) => lower.includes(t))
}

function pickGoalTitle(context: CoachContext | undefined, terms: string[]): string | undefined {
  const goals = context?.goals?.filter((g) => g.status === 'active') ?? []
  for (const goal of goals) {
    const hay = `${goal.title} ${goal.why} ${goal.description}`.toLowerCase()
    if (terms.some((t) => hay.includes(t))) return goal.title
  }
  return goals[0]?.title
}

export function generateMockCoachResponse(input: string, context?: CoachContext): string {
  const text = input.trim()
  if (!text) {
    return [
      '**Core signal** — You opened the space. That counts.',
      '**Value** — Honesty before action.',
      '**Pattern** — Sometimes silence is avoidance wearing a calm face.',
      '**One 1% action** — Name one thing on your mind in a single sentence.',
      '**Question** — What would "enough for today" look like?',
    ].join('\n\n')
  }

  if (matchesAny(text, STRESS_TERMS)) {
    return [
      '**Core signal** — The spiral is loud right now.',
      `**Value** — ${context?.profile?.vision?.split('.')[0] ?? 'Presence without self-erasure'}.`,
      '**Pattern** — Stress often asks for a ten-step plan when one small step would do.',
      '**One 1% action** — Pick the next right action you can finish in 15 minutes. Do only that.',
      '**Question** — What are you trying to control that isn\'t yours to control today?',
    ].join('\n\n')
  }

  if (matchesAny(text, SELF_ERASURE_TERMS)) {
    return [
      '**Core signal** — Something in you feels cornered or fading.',
      `**Goal** — ${pickGoalTitle(context, ['connection', 'present', 'peace']) ?? 'Show up without disappearing'}.`,
      '**Pattern** — Self-erasure often shows up as over-giving, over-performing, or going quiet.',
      '**One 1% action** — Name one need of yours out loud (even just here) before you solve anyone else\'s problem.',
      '**Question** — Where did you last say "it\'s fine" when it wasn\'t?',
    ].join('\n\n')
  }

  if (matchesAny(text, FAMILY_TERMS)) {
    return [
      '**Core signal** — Family is on your heart.',
      `**Goal** — ${pickGoalTitle(context, ['family', 'marriage', 'present']) ?? 'Show up fully for family and marriage'}.`,
      '**Pattern** — Presence without self-abandonment means caring deeply without erasing your own edges.',
      '**One 1% action** — One undistracted moment today: eye contact, one real question, phones away.',
      '**Question** — What would your kids remember about today — your mood or your attention?',
    ].join('\n\n')
  }

  if (matchesAny(text, BUILD_TERMS)) {
    return [
      '**Core signal** — Building energy is active.',
      `**Goal** — ${pickGoalTitle(context, ['build', 'financial', 'useful']) ?? 'Build financial independence by building useful things'}.`,
      '**Pattern** — Drive is good; overcomplication is often fear dressed as strategy.',
      '**One 1% action** — Ship or touch one useful thing today — a draft, a call, a small fix.',
      '**Question** — Is this action building, or is it avoiding something harder?',
    ].join('\n\n')
  }

  const latest = context?.latestEntry
  if (latest?.lesson) {
    return [
      '**Core signal** — You\'re reflecting, not just reacting.',
      `**Value** — ${context?.profile?.why?.split('.')[0] ?? 'Live fully'}.`,
      '**Pattern** — Lessons repeat until they\'re integrated, not until they\'re perfect.',
      `**One 1% action** — Revisit your lesson: "${latest.lesson.slice(0, 80)}${latest.lesson.length > 80 ? '…' : ''}" — what\'s one small way to live it today?`,
      '**Question** — What would change if you trusted yesterday\'s lesson for just today?',
    ].join('\n\n')
  }

  return [
    '**Core signal** — You\'re thinking clearly enough to ask.',
    `**Value** — ${context?.profile?.vision?.split('.')[0] ?? 'Drive and peace together'}.`,
    '**Pattern** — Not every tension needs solving; some need naming.',
    '**One 1% action** — Write one sentence: "Today I will ___" — small enough to finish.',
    '**Question** — What are you avoiding by making this bigger than it needs to be?',
  ].join('\n\n')
}

export const mockCoachProvider: CoachProvider = {
  async generateResponse(input, context) {
    await new Promise((r) => setTimeout(r, 400))
    return generateMockCoachResponse(input, context)
  },
}

export function summarizeEntryForCoach(entry: {
  date: string
  energy?: number
  mood?: string
  onePercentAction: string
  lesson?: string
  endOfDayResult?: string
}): string {
  const parts = [`Entry from ${entry.date}:`]
  if (entry.energy) parts.push(`Energy: ${entry.energy}/5`)
  if (entry.mood) parts.push(`Mood: ${entry.mood}`)
  parts.push(`1% action: ${entry.onePercentAction}`)
  if (entry.endOfDayResult) parts.push(`Result: ${entry.endOfDayResult}`)
  if (entry.lesson) parts.push(`Lesson: ${entry.lesson}`)
  return parts.join('\n')
}
