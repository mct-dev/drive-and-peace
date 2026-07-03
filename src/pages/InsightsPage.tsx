import { useMemo } from 'react'
import { useApp } from '../app/AppContext'
import { Card } from '../components/Card'
import { EmptyState } from '../components/EmptyState'
import { computeInsights } from '../lib/insights'
import { getWeekStartISO } from '../lib/dates'

export function InsightsPage() {
  const { data } = useApp()
  const weekStart = getWeekStartISO()

  const insights = useMemo(
    () => computeInsights(data.dailyEntries, data.goals, data.weeklyReviews, weekStart),
    [data.dailyEntries, data.goals, data.weeklyReviews, weekStart],
  )

  const hasData = insights.totalEntries > 0

  return (
    <div className="space-y-5">
      <header>
        <p className="text-sm text-[var(--color-ink-muted)]">Insights</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Simple mirrors</h1>
        <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
          Humble observations — not diagnoses.
        </p>
      </header>

      {!hasData ? (
        <EmptyState
          title="Not enough to reflect on yet"
          description="A few honest entries will give this page something meaningful to show."
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <p className="text-2xl font-semibold text-[var(--color-ink)]">
                {insights.totalEntries}
              </p>
              <p className="text-xs text-[var(--color-ink-muted)]">Total entries</p>
            </Card>
            <Card>
              <p className="text-2xl font-semibold text-[var(--color-ink)]">
                {insights.entriesThisWeek}
              </p>
              <p className="text-xs text-[var(--color-ink-muted)]">This week</p>
            </Card>
          </div>

          {insights.mostSupportedGoalTitle && (
            <Card title="Most-supported goal">
              <p className="text-sm text-[var(--color-ink)]">{insights.mostSupportedGoalTitle}</p>
            </Card>
          )}

          {insights.recentMoods.length > 0 && (
            <Card title="Recent moods">
              <p className="text-sm text-[var(--color-ink-muted)]">
                {insights.recentMoods.join(' · ')}
              </p>
            </Card>
          )}

          {insights.commonWords.length > 0 && (
            <Card title="Common words lately">
              <div className="flex flex-wrap gap-2">
                {insights.commonWords.map((w) => (
                  <span
                    key={w}
                    className="rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-xs text-[var(--color-accent)]"
                  >
                    {w}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {insights.driftSignals.length > 0 && (
            <Card title="Recent drift signals">
              <ul className="space-y-1">
                {insights.driftSignals.map((s, i) => (
                  <li key={i} className="text-sm text-[var(--color-ink-muted)]">
                    · {s}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {insights.patternNotes.length > 0 && (
            <Card title="Pattern notes">
              <ul className="space-y-4">
                {insights.patternNotes.map((note) => (
                  <li key={note.id}>
                    <p className="text-sm font-medium text-[var(--color-ink)]">{note.label}</p>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                      {note.note}
                    </p>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
