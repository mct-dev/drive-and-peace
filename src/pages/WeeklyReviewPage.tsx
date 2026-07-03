import { useEffect, useMemo, useState } from 'react'
import { useApp } from '../app/AppContext'
import { buildGoalGrid } from '../data/migrate'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { TextArea } from '../components/TextArea'
import { TextField } from '../components/TextField'
import { RatingInput } from '../components/RatingInput'
import { GoalGrid } from '../components/GoalGrid'
import { DiarySection } from '../components/DiarySection'
import { DiaryCallout } from '../components/DiaryCallout'
import { formatWeekRange, todayISO } from '../lib/dates'
import {
  getProgramWeekStart,
  getWeekNumber,
  PROGRAM_WEEKS,
} from '../lib/program'
import type { GoalGridRow } from '../types'

export function WeeklyReviewPage() {
  const { data, upsertWeeklyReview } = useApp()
  const startDate = data.program.startDate
  const currentWeekNumber = getWeekNumber(startDate, todayISO())

  const [selectedWeekNumber, setSelectedWeekNumber] = useState(currentWeekNumber)
  const weekStart = getProgramWeekStart(startDate, selectedWeekNumber)
  const existing = data.weeklyReviews.find((r) => r.weekStart === weekStart)

  const topGoals = useMemo(
    () =>
      data.goals
        .filter((g) => g.status === 'active')
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .slice(0, 3),
    [data.goals],
  )

  const [goalGrid, setGoalGrid] = useState<GoalGridRow[]>(() =>
    buildGoalGrid(data.goals, existing?.goalGrid ?? []),
  )
  const [reflection, setReflection] = useState(existing?.reflection ?? '')
  const [wins, setWins] = useState(existing?.wins ?? '')
  const [misses, setMisses] = useState(existing?.misses ?? '')
  const [patterns, setPatterns] = useState(existing?.patterns ?? '')
  const [livedVision, setLivedVision] = useState(existing?.livedVision ?? '')
  const [drifted, setDrifted] = useState(existing?.drifted ?? '')
  const [adjustment, setAdjustment] = useState(existing?.adjustment ?? '')
  const [nextWeekMainGoal, setNextWeekMainGoal] = useState(existing?.nextWeekMainGoal ?? '')
  const [dailyMainGoal, setDailyMainGoal] = useState(existing?.dailyMainGoal ?? '')
  const [daysOnTrack, setDaysOnTrack] = useState(
    existing?.daysOnTrack !== undefined ? String(existing.daysOnTrack) : '',
  )
  const [goalReached, setGoalReached] = useState(existing?.goalReached ?? '')
  const [weekScore, setWeekScore] = useState<number | undefined>(existing?.weekScore)
  const [actionsByGoal, setActionsByGoal] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {}
    for (const a of existing?.actionsByGoal ?? []) {
      map[a.goalId] = a.action
    }
    return map
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setGoalGrid(buildGoalGrid(data.goals, existing?.goalGrid ?? []))
    setReflection(existing?.reflection ?? '')
    setWins(existing?.wins ?? '')
    setMisses(existing?.misses ?? '')
    setPatterns(existing?.patterns ?? '')
    setLivedVision(existing?.livedVision ?? '')
    setDrifted(existing?.drifted ?? '')
    setAdjustment(existing?.adjustment ?? '')
    setNextWeekMainGoal(existing?.nextWeekMainGoal ?? '')
    setDailyMainGoal(existing?.dailyMainGoal ?? '')
    setDaysOnTrack(existing?.daysOnTrack !== undefined ? String(existing.daysOnTrack) : '')
    setGoalReached(existing?.goalReached ?? '')
    setWeekScore(existing?.weekScore)
    const map: Record<string, string> = {}
    for (const a of existing?.actionsByGoal ?? []) {
      map[a.goalId] = a.action
    }
    setActionsByGoal(map)
  }, [existing, data.goals])

  const previous = [...data.weeklyReviews]
    .filter((r) => r.weekStart !== weekStart)
    .sort((a, b) => b.weekStart.localeCompare(a.weekStart))

  const parsedDaysOnTrack = daysOnTrack.trim() === '' ? undefined : Number(daysOnTrack)

  const handleSave = () => {
    upsertWeeklyReview({
      id: existing?.id,
      weekStart,
      weekNumber: selectedWeekNumber,
      wins,
      misses,
      patterns,
      livedVision,
      drifted,
      adjustment,
      reflection: reflection || undefined,
      nextWeekMainGoal: nextWeekMainGoal || undefined,
      dailyMainGoal: dailyMainGoal || undefined,
      daysOnTrack:
        parsedDaysOnTrack !== undefined && !Number.isNaN(parsedDaysOnTrack)
          ? parsedDaysOnTrack
          : undefined,
      goalReached: goalReached || undefined,
      weekScore,
      goalGrid,
      actionsByGoal: topGoals
        .filter((g) => actionsByGoal[g.id]?.trim())
        .map((g) => ({ goalId: g.id, action: actionsByGoal[g.id].trim() })),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-5">
      <header>
        <p className="text-sm text-[var(--color-ink-muted)]">Weekly review</p>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => setSelectedWeekNumber((n) => Math.max(1, n - 1))}
            disabled={selectedWeekNumber <= 1}
            aria-label="Previous week"
          >
            ←
          </Button>
          <div>
            <h1 className="diary-week-heading">Week {selectedWeekNumber}</h1>
            <p className="text-sm text-[var(--color-ink-muted)]">{formatWeekRange(weekStart)}</p>
          </div>
          <Button
            variant="ghost"
            onClick={() => setSelectedWeekNumber((n) => Math.min(PROGRAM_WEEKS, n + 1))}
            disabled={selectedWeekNumber >= PROGRAM_WEEKS}
            aria-label="Next week"
          >
            →
          </Button>
        </div>
        <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
          Honest reflection — not a performance review.
        </p>
      </header>

      <Card>
        <DiarySection title="Weekly goal grid" subtitle="Top 3 active goals — Day 1 through Day 7">
          <GoalGrid goals={topGoals} grid={goalGrid} onChange={setGoalGrid} />
        </DiarySection>
      </Card>

      <Card>
        <DiarySection title="Weekly reflection">
          <div className="space-y-4">
            <TextArea
              label="Reflection"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="What stood out this week? What did you learn about yourself?"
              rows={6}
            />

            <DiaryCallout>
              Weekly reflection is where patterns become visible. Take your time — honesty here
              shapes every week that follows.
            </DiaryCallout>

            <TextArea label="Wins" value={wins} onChange={(e) => setWins(e.target.value)} />
            <TextArea label="Misses" value={misses} onChange={(e) => setMisses(e.target.value)} />
            <TextArea
              label="Patterns noticed"
              value={patterns}
              onChange={(e) => setPatterns(e.target.value)}
            />
            <TextArea
              label="Where I lived my vision"
              value={livedVision}
              onChange={(e) => setLivedVision(e.target.value)}
            />
            <TextArea
              label="Where I drifted"
              value={drifted}
              onChange={(e) => setDrifted(e.target.value)}
            />
            <TextArea
              label="One adjustment for next week"
              value={adjustment}
              onChange={(e) => setAdjustment(e.target.value)}
            />

            <TextField
              label="Next week's main goal"
              value={nextWeekMainGoal}
              onChange={(e) => setNextWeekMainGoal(e.target.value)}
              placeholder="The one thing that matters most next week"
            />
            <TextField
              label="Daily main goal"
              value={dailyMainGoal}
              onChange={(e) => setDailyMainGoal(e.target.value)}
              placeholder="What you'll focus on each day"
            />

            <div className="space-y-4 border-t border-[var(--color-border)] pt-4">
              <p className="text-sm font-medium text-[var(--color-ink)]">Weekly summary</p>
              <TextField
                label="Days on track"
                type="number"
                min={0}
                max={7}
                value={daysOnTrack}
                onChange={(e) => setDaysOnTrack(e.target.value)}
                placeholder="0–7"
              />
              <TextField
                label="Goal reached"
                value={goalReached}
                onChange={(e) => setGoalReached(e.target.value)}
                placeholder="Did you reach your main goal?"
              />
              <RatingInput label="Week score" value={weekScore} onChange={setWeekScore} max={10} />
            </div>
          </div>
        </DiarySection>
      </Card>

      {topGoals.length > 0 && (
        <Card>
          <DiarySection
            title="Per-goal actions"
            subtitle="One 1% action per active goal for next week"
          >
            <div className="space-y-3">
              {topGoals.map((g) => (
                <TextField
                  key={g.id}
                  label={g.title}
                  value={actionsByGoal[g.id] ?? ''}
                  onChange={(e) =>
                    setActionsByGoal((prev) => ({ ...prev, [g.id]: e.target.value }))
                  }
                  placeholder="Small action for next week"
                />
              ))}
            </div>
          </DiarySection>
        </Card>
      )}

      <div className="flex items-center gap-3">
        <Button onClick={handleSave}>{existing ? 'Update review' : 'Save review'}</Button>
        {saved && (
          <span className="text-sm text-[var(--color-accent)]" role="status">
            Saved
          </span>
        )}
      </div>

      {previous.length > 0 && (
        <Card title="Previous reviews">
          <ul className="space-y-4">
            {previous.map((review) => {
              const weekNum =
                review.weekNumber ?? getWeekNumber(startDate, review.weekStart)
              return (
                <li
                  key={review.id}
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3"
                >
                  <p className="text-xs font-medium text-[var(--color-ink-muted)]">
                    Week {weekNum} · {formatWeekRange(review.weekStart)}
                  </p>
                  {review.reflection && (
                    <p className="mt-2 text-sm text-[var(--color-ink)]">
                      <span className="font-medium">Reflection:</span> {review.reflection}
                    </p>
                  )}
                  {review.wins && (
                    <p className="mt-2 text-sm text-[var(--color-ink)]">
                      <span className="font-medium">Wins:</span> {review.wins}
                    </p>
                  )}
                  {review.drifted && (
                    <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
                      <span className="font-medium">Drifted:</span> {review.drifted}
                    </p>
                  )}
                  {review.adjustment && (
                    <p className="mt-1 text-sm text-[var(--color-accent)]">
                      <span className="font-medium">Adjustment:</span> {review.adjustment}
                    </p>
                  )}
                </li>
              )
            })}
          </ul>
        </Card>
      )}
    </div>
  )
}
