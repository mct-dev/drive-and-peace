import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../app/AppContext'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { TextField } from '../components/TextField'
import { TextArea } from '../components/TextArea'
import { Select } from '../components/Select'
import { RatingInput } from '../components/RatingInput'
import { formatDisplayDate, todayISO } from '../lib/dates'

export function TodayPage() {
  const { data, upsertDailyEntry } = useApp()
  const today = todayISO()
  const existing = data.dailyEntries.find((e) => e.date === today)
  const activeGoals = data.goals.filter((g) => g.status === 'active')

  const [energy, setEnergy] = useState<number | undefined>(existing?.energy)
  const [mood, setMood] = useState(existing?.mood ?? '')
  const [onePercentAction, setOnePercentAction] = useState(existing?.onePercentAction ?? '')
  const [goalId, setGoalId] = useState(existing?.goalId ?? '')
  const [possibleObstacle, setPossibleObstacle] = useState(existing?.possibleObstacle ?? '')
  const [tinyVersion, setTinyVersion] = useState(existing?.tinyVersion ?? '')
  const [endOfDayResult, setEndOfDayResult] = useState(existing?.endOfDayResult ?? '')
  const [lesson, setLesson] = useState(existing?.lesson ?? '')
  const [freeformText, setFreeformText] = useState(existing?.freeformText ?? '')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  const recent = [...data.dailyEntries]
    .filter((e) => e.date !== today)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3)

  const handleSave = () => {
    if (!onePercentAction.trim()) return
    setSaving(true)
    upsertDailyEntry({
      id: existing?.id,
      date: today,
      energy,
      mood: mood || undefined,
      onePercentAction: onePercentAction.trim(),
      goalId: goalId || undefined,
      possibleObstacle: possibleObstacle || undefined,
      tinyVersion: tinyVersion || undefined,
      endOfDayResult: endOfDayResult || undefined,
      lesson: lesson || undefined,
      freeformText: freeformText || undefined,
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const alignmentSnippet = data.profile.vision.split('.')[0]

  return (
    <div className="space-y-5">
      <header>
        <p className="text-sm text-[var(--color-ink-muted)]">Today</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
          {formatDisplayDate(today)}
        </h1>
      </header>

      <Card title="Today's alignment" subtitle="A quiet reminder — not a scoreboard">
        <p className="text-sm leading-relaxed text-[var(--color-ink-muted)]">{alignmentSnippet}.</p>
        {activeGoals.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {activeGoals.map((g) => (
              <li key={g.id} className="text-sm text-[var(--color-ink)]">
                <span className="text-[var(--color-accent)]">·</span> {g.title}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-xs text-[var(--color-ink-muted)]">
          {existing ? 'You have an entry for today.' : 'No entry yet — one small action is enough.'}
        </p>
      </Card>

      <Card title="Daily entry" subtitle="One honest step">
        <div className="space-y-4">
          <RatingInput label="Energy" value={energy} onChange={setEnergy} />
          <TextField
            label="Mood"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder="Calm, restless, focused…"
          />
          <TextArea
            label="Today's 1% action"
            value={onePercentAction}
            onChange={(e) => setOnePercentAction(e.target.value)}
            placeholder="One small thing you can actually do today"
            required
          />
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
            label="Tiny version if the day goes sideways"
            value={tinyVersion}
            onChange={(e) => setTinyVersion(e.target.value)}
            placeholder="The smallest version that still counts"
          />
          <TextArea
            label="End-of-day result"
            value={endOfDayResult}
            onChange={(e) => setEndOfDayResult(e.target.value)}
            placeholder="What actually happened?"
          />
          <TextArea
            label="Lesson"
            value={lesson}
            onChange={(e) => setLesson(e.target.value)}
            placeholder="What did today teach you?"
          />
          <TextArea
            label="Freeform note"
            value={freeformText}
            onChange={(e) => setFreeformText(e.target.value)}
            placeholder="Anything else on your mind"
          />
          <div className="flex items-center gap-3 pt-1">
            <Button onClick={handleSave} loading={saving} disabled={!onePercentAction.trim()}>
              {existing ? 'Update entry' : 'Save entry'}
            </Button>
            {saved && (
              <span className="text-sm text-[var(--color-accent)]" role="status">
                Saved
              </span>
            )}
          </div>
        </div>
      </Card>

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
                    </span>
                    {entry.mood && (
                      <span className="text-xs text-[var(--color-ink-muted)]">{entry.mood}</span>
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
