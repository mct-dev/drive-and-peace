import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../app/AppContext'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { ChecklistField } from '../components/ChecklistField'
import { DiaryCallout } from '../components/DiaryCallout'
import { DiarySection } from '../components/DiarySection'
import { ScheduleEditor } from '../components/ScheduleEditor'
import { Select } from '../components/Select'
import { TextArea } from '../components/TextArea'
import { TextField } from '../components/TextField'
import { VerticalRating } from '../components/VerticalRating'
import { formatDisplayDate, todayISO } from '../lib/dates'
import { createId } from '../lib/id'
import {
  generateDefaultSchedule,
  generateDriverSchedule,
  getDayInWeek,
  getDayNumber,
  getWeekNumber,
} from '../lib/program'
import type { DayType, MissionItem, ScheduleSlot } from '../types'

function initializeMissions(existing?: MissionItem[]): MissionItem[] {
  const items = existing ?? []
  const result = [...items]
  while (result.length < 10) {
    result.push({ id: createId(), text: '', done: false })
  }
  return result.slice(0, 10)
}

function initializeSchedule(
  existing: { schedule?: ScheduleSlot[]; dayType?: DayType } | undefined,
  dayType: DayType,
): ScheduleSlot[] {
  if (existing?.schedule?.length) {
    return existing.schedule
  }
  return dayType === 'driver' ? generateDriverSchedule() : generateDefaultSchedule()
}

function firstMissionText(missions: MissionItem[]): string {
  return missions.find((m) => m.text.trim())?.text.trim() ?? ''
}

export function TodayPage() {
  const { data, upsertDailyEntry } = useApp()
  const today = todayISO()
  const startDate = data.program.startDate
  const existing = data.dailyEntries.find((e) => e.date === today)
  const activeGoals = data.goals.filter((g) => g.status === 'active')

  const dayNumber = useMemo(() => getDayNumber(startDate, today), [startDate, today])
  const weekNumber = useMemo(() => getWeekNumber(startDate, today), [startDate, today])
  const dayInWeek = useMemo(() => getDayInWeek(startDate, today), [startDate, today])

  const initialDayType: DayType = existing?.dayType ?? 'passenger'

  const [dayType, setDayType] = useState<DayType>(initialDayType)
  const [wakeTime, setWakeTime] = useState(existing?.wakeTime ?? '')
  const [sleepTime, setSleepTime] = useState(existing?.sleepTime ?? '')
  const [bodyNote, setBodyNote] = useState(existing?.bodyNote ?? '')
  const [mindNote, setMindNote] = useState(existing?.mindNote ?? '')
  const [dayRating, setDayRating] = useState<number | undefined>(existing?.dayRating)
  const [missions, setMissions] = useState<MissionItem[]>(() => initializeMissions(existing?.missions))
  const [tasks, setTasks] = useState<MissionItem[]>(existing?.tasks ?? [])
  const [nonNegotiables, setNonNegotiables] = useState<MissionItem[]>(existing?.nonNegotiables ?? [])
  const [planning, setPlanning] = useState(existing?.planning ?? '')
  const [wins, setWins] = useState(existing?.wins ?? '')
  const [schedule, setSchedule] = useState<ScheduleSlot[]>(() =>
    initializeSchedule(existing, initialDayType),
  )
  const [lesson, setLesson] = useState(existing?.lesson ?? '')
  const [reflection, setReflection] = useState(existing?.reflection ?? '')
  const [endOfDayResult, setEndOfDayResult] = useState(existing?.endOfDayResult ?? '')
  const [tinyVersion, setTinyVersion] = useState(existing?.tinyVersion ?? '')
  const [goalId, setGoalId] = useState(existing?.goalId ?? '')
  const [possibleObstacle, setPossibleObstacle] = useState(existing?.possibleObstacle ?? '')
  const [onePercentAction, setOnePercentAction] = useState(existing?.onePercentAction ?? '')
  const [saved, setSaved] = useState(false)

  const recent = [...data.dailyEntries]
    .filter((e) => e.date !== today)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3)

  const hasMission = missions.some((m) => m.text.trim())
  const canSave = Boolean(onePercentAction.trim() || hasMission)

  const handleSave = () => {
    const resolvedOnePercent = onePercentAction.trim() || firstMissionText(missions)
    if (!resolvedOnePercent) return

    upsertDailyEntry({
      id: existing?.id,
      date: today,
      dayNumber,
      dayType,
      wakeTime: wakeTime || undefined,
      sleepTime: sleepTime || undefined,
      bodyNote: bodyNote || undefined,
      mindNote: mindNote || undefined,
      dayRating,
      onePercentAction: resolvedOnePercent,
      missions,
      tasks,
      nonNegotiables,
      planning: planning || undefined,
      wins: wins || undefined,
      schedule,
      reflection: reflection || undefined,
      goalId: goalId || undefined,
      possibleObstacle: possibleObstacle || undefined,
      tinyVersion: tinyVersion || undefined,
      endOfDayResult: endOfDayResult || undefined,
      lesson: lesson || undefined,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ink-muted)]">
              Week {weekNumber} · Day {dayInWeek} of 7
            </p>
            <h1 className="diary-day-heading mt-1">Day {dayNumber}</h1>
            <p className="mt-1 text-sm font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
              {dayType === 'driver' ? "Driver's day" : 'Passenger day'} · {formatDisplayDate(today)}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={dayType === 'driver' ? 'primary' : 'secondary'}
              onClick={() => setDayType('driver')}
              aria-pressed={dayType === 'driver'}
            >
              Driver
            </Button>
            <Button
              variant={dayType === 'passenger' ? 'primary' : 'secondary'}
              onClick={() => setDayType('passenger')}
              aria-pressed={dayType === 'passenger'}
            >
              Passenger
            </Button>
          </div>
        </div>
      </header>

      <div className="diary-spread">
        <DiarySection title="Plan" subtitle="Morning intentions">
          <div className="space-y-5">
            <ChecklistField
              label="Today's mission"
              items={missions}
              onChange={setMissions}
              numbered
              maxItems={10}
              placeholder="One step toward your goals"
            />

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-[var(--color-ink)]">Date</span>
                <p className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-ink-muted)]">
                  {formatDisplayDate(today)}
                </p>
              </div>
              <TextField
                label="Wake time"
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
              />
              <TextField
                label="Sleep time"
                type="time"
                value={sleepTime}
                onChange={(e) => setSleepTime(e.target.value)}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-start">
              <TextArea
                label="My body"
                value={bodyNote}
                onChange={(e) => setBodyNote(e.target.value)}
                placeholder="How does your body feel today?"
                className="diary-lined-textarea"
              />
              <div className="flex justify-center md:pt-6">
                <VerticalRating label="Day rating" value={dayRating} onChange={setDayRating} />
              </div>
              <TextArea
                label="My mind"
                value={mindNote}
                onChange={(e) => setMindNote(e.target.value)}
                placeholder="What's on your mind?"
                className="diary-lined-textarea"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant={dayType === 'driver' ? 'primary' : 'ghost'}
                onClick={() => setDayType('driver')}
                aria-pressed={dayType === 'driver'}
              >
                Driver&apos;s day
              </Button>
              <Button
                variant={dayType === 'passenger' ? 'primary' : 'ghost'}
                onClick={() => setDayType('passenger')}
                aria-pressed={dayType === 'passenger'}
              >
                Passenger day
              </Button>
            </div>

            {dayType === 'driver' && (
              <div className="space-y-4 border-t border-[var(--color-border)] pt-4">
                <ChecklistField
                  label="Tasks"
                  items={tasks}
                  onChange={setTasks}
                  placeholder="What needs doing today?"
                />
                <ChecklistField
                  label="Non-negotiables"
                  items={nonNegotiables}
                  onChange={setNonNegotiables}
                  placeholder="What must happen no matter what?"
                />
                <TextArea
                  label="Planning"
                  value={planning}
                  onChange={(e) => setPlanning(e.target.value)}
                  placeholder="How will you structure the day?"
                />
                <TextArea
                  label="Wins"
                  value={wins}
                  onChange={(e) => setWins(e.target.value)}
                  placeholder="What would make today a win?"
                />
              </div>
            )}

            <DiaryCallout>
              <strong>Driver days</strong> are for pushing forward — tasks, structure, and momentum.
              <strong className="mt-1 block">Passenger days</strong> are for rest, recovery, and
              gentle progress. Both count. Choose what today needs.
            </DiaryCallout>
          </div>
        </DiarySection>

        <Card title="Schedule" subtitle="How the day unfolded">
          <div className="space-y-5">
            <ScheduleEditor slots={schedule} onChange={setSchedule} />

            <TextArea
              label="What did I learn today?"
              value={lesson}
              onChange={(e) => setLesson(e.target.value)}
              placeholder="One insight worth keeping"
            />
            <TextArea
              label="Daily reflection"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="How did today feel?"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <TextArea
                label="End-of-day result"
                value={endOfDayResult}
                onChange={(e) => setEndOfDayResult(e.target.value)}
                placeholder="What actually happened?"
              />
              <TextArea
                label="Tiny version"
                value={tinyVersion}
                onChange={(e) => setTinyVersion(e.target.value)}
                placeholder="The smallest version that still counts"
              />
            </div>

            <Select
              label="Goal supported"
              value={goalId}
              onChange={(e) => setGoalId(e.target.value)}
              options={[
                { value: '', label: 'None / general' },
                ...activeGoals.map((g) => ({ value: g.id, label: g.title })),
              ]}
            />
            <TextArea
              label="Possible obstacle"
              value={possibleObstacle}
              onChange={(e) => setPossibleObstacle(e.target.value)}
              placeholder="What might get in the way?"
            />
            <TextArea
              label="Today's 1% action"
              value={onePercentAction}
              onChange={(e) => setOnePercentAction(e.target.value)}
              placeholder={
                firstMissionText(missions)
                  ? `Auto-fills from mission: "${firstMissionText(missions)}"`
                  : 'One small thing — or fill in mission #1 above'
              }
              hint={
                !onePercentAction.trim() && hasMission
                  ? 'Will save from your first mission if left blank.'
                  : undefined
              }
            />
          </div>
        </Card>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={!canSave}>
          {existing ? 'Update entry' : 'Save entry'}
        </Button>
        {!canSave && (
          <span className="text-sm text-[var(--color-ink-muted)]">
            Add at least one mission or a 1% action to save.
          </span>
        )}
        {saved && (
          <span className="text-sm font-medium text-[var(--color-accent)]" role="status" aria-live="polite">
            Saved ✓
          </span>
        )}
      </div>

      {recent.length > 0 && (
        <Card title="Recent entries" subtitle="A quick look back">
          <ul className="space-y-3">
            {recent.map((entry) => {
              const goal = data.goals.find((g) => g.id === entry.goalId)
              return (
                <li
                  key={entry.id}
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xs font-medium text-[var(--color-ink-muted)]">
                      {entry.date}
                      {entry.dayNumber != null && ` · Day ${entry.dayNumber}`}
                    </span>
                    {entry.dayType && (
                      <span className="text-xs capitalize text-[var(--color-ink-muted)]">
                        {entry.dayType}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-[var(--color-ink)]">{entry.onePercentAction}</p>
                  {goal && (
                    <p className="mt-1 text-xs text-[var(--color-accent)]">{goal.title}</p>
                  )}
                </li>
              )
            })}
          </ul>
          <Link
            to="/entries"
            className="mt-3 inline-block text-sm font-medium text-[var(--color-accent)]"
          >
            View all entries →
          </Link>
        </Card>
      )}
    </div>
  )
}
