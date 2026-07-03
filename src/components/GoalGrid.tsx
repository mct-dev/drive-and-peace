import type { Goal, GoalGridRow } from '../types'

interface GoalGridProps {
  goals: Goal[]
  grid: GoalGridRow[]
  onChange: (grid: GoalGridRow[]) => void
}

export function GoalGrid({ goals, grid, onChange }: GoalGridProps) {
  const rows = grid.filter((row) => goals.some((g) => g.id === row.goalId))

  const updateCell = (rowIndex: number, dayIndex: number, value: string) => {
    const next = rows.map((row, ri) => {
      if (ri !== rowIndex) return row
      const days = [...row.days] as GoalGridRow['days']
      days[dayIndex] = value
      return { ...row, days }
    })
    onChange(next)
  }

  if (rows.length === 0) {
    return (
      <p className="text-sm text-[var(--color-ink-muted)]">
        Add up to 3 active goals to fill the weekly grid.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] border-collapse text-sm">
        <thead>
          <tr>
            <th className="border border-[var(--color-border)] bg-[var(--color-surface)] p-2 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
              Goal
            </th>
            {Array.from({ length: 7 }, (_, i) => (
              <th
                key={i}
                className="border border-[var(--color-border)] bg-[var(--color-surface)] p-2 text-center text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]"
              >
                Day {i + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => {
            const goal = goals.find((g) => g.id === row.goalId)
            return (
              <tr key={row.goalId}>
                <td className="border border-[var(--color-border)] p-2 align-top text-xs font-medium text-[var(--color-ink)]">
                  {goal?.title ?? 'Goal'}
                </td>
                {row.days.map((cell, dayIndex) => (
                  <td key={dayIndex} className="border border-[var(--color-border)] p-1 align-top">
                    <textarea
                      value={cell}
                      onChange={(e) => updateCell(rowIndex, dayIndex, e.target.value)}
                      rows={2}
                      className="diary-lined-input w-full resize-none border-0 bg-transparent p-1 text-xs text-[var(--color-ink)] outline-none"
                      placeholder="—"
                    />
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
