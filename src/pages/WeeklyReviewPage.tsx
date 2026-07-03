import { useEffect, useState } from 'react'
import { useApp } from '../app/AppContext'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { TextArea } from '../components/TextArea'
import { TextField } from '../components/TextField'
import { formatWeekRange, getWeekStartISO } from '../lib/dates'

export function WeeklyReviewPage() {
  const { data, upsertWeeklyReview } = useApp()
  const weekStart = getWeekStartISO()
  const existing = data.weeklyReviews.find((r) => r.weekStart === weekStart)
  const activeGoals = data.goals.filter((g) => g.status === 'active')

  const [wins, setWins] = useState(existing?.wins ?? '')
  const [misses, setMisses] = useState(existing?.misses ?? '')
  const [patterns, setPatterns] = useState(existing?.patterns ?? '')
  const [livedVision, setLivedVision] = useState(existing?.livedVision ?? '')
  const [drifted, setDrifted] = useState(existing?.drifted ?? '')
  const [adjustment, setAdjustment] = useState(existing?.adjustment ?? '')
  const [actionsByGoal, setActionsByGoal] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {}
    for (const a of existing?.actionsByGoal ?? []) {
      map[a.goalId] = a.action
    }
    return map
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setWins(existing?.wins ?? '')
    setMisses(existing?.misses ?? '')
    setPatterns(existing?.patterns ?? '')
    setLivedVision(existing?.livedVision ?? '')
    setDrifted(existing?.drifted ?? '')
    setAdjustment(existing?.adjustment ?? '')
    const map: Record<string, string> = {}
    for (const a of existing?.actionsByGoal ?? []) {
      map[a.goalId] = a.action
    }
    setActionsByGoal(map)
  }, [existing])

  const previous = [...data.weeklyReviews]
    .filter((r) => r.weekStart !== weekStart)
    .sort((a, b) => b.weekStart.localeCompare(a.weekStart))

  const handleSave = () => {
    upsertWeeklyReview({
      id: existing?.id,
      weekStart,
      wins,
      misses,
      patterns,
      livedVision,
      drifted,
      adjustment,
      actionsByGoal: activeGoals
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
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          {formatWeekRange(weekStart)}
        </h1>
        <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
          Honest reflection — not a performance review.
        </p>
      </header>

      <Card title="This week">
        <div className="space-y-4">
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

          {activeGoals.length > 0 && (
            <div className="space-y-3 border-t border-[var(--color-border)] pt-4">
              <p className="text-sm font-medium text-[var(--color-ink)]">
                One 1% action per active goal
              </p>
              {activeGoals.map((g) => (
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
          )}

          <div className="flex items-center gap-3">
            <Button onClick={handleSave}>{existing ? 'Update review' : 'Save review'}</Button>
            {saved && (
              <span className="text-sm text-[var(--color-accent)]" role="status">
                Saved
              </span>
            )}
          </div>
        </div>
      </Card>

      {previous.length > 0 && (
        <Card title="Previous reviews">
          <ul className="space-y-4">
            {previous.map((review) => (
              <li
                key={review.id}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3"
              >
                <p className="text-xs font-medium text-[var(--color-ink-muted)]">
                  {formatWeekRange(review.weekStart)}
                </p>
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
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}
