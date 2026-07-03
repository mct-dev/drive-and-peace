import { Card } from '../components/Card'

export function CoachPage() {
  return (
    <div className="space-y-5">
      <header>
        <p className="text-sm text-[var(--color-ink-muted)]">Coach</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">A quiet second voice</h1>
        <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
          An AI-guided reflection space — thoughtful prompts, not prescriptions.
        </p>
      </header>

      <Card className="flex flex-col items-center gap-4 py-12 text-center">
        <span className="inline-flex items-center rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-xs font-medium text-[var(--color-accent)]">
          Coming soon
        </span>
        <div className="max-w-md space-y-3">
          <h2 className="text-lg font-semibold text-[var(--color-ink)]">The Coach is on its way</h2>
          <p className="text-sm leading-relaxed text-[var(--color-ink-muted)]">
            We're building a gentle, LLM-guided coach that reflects your goals and entries back to
            you — pattern-aware questions, never pressure. It isn't ready yet, so we've paused it
            until it's something worth your time.
          </p>
          <p className="text-sm leading-relaxed text-[var(--color-ink-muted)]">
            In the meantime, keep writing on{' '}
            <span className="text-[var(--color-ink)]">Today</span> and noticing patterns in{' '}
            <span className="text-[var(--color-ink)]">Insights</span>.
          </p>
        </div>
      </Card>
    </div>
  )
}
