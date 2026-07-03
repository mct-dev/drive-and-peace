import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-raised)]/50 px-6 py-12 text-center">
      <h3 className="text-base font-medium text-[var(--color-ink)]">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-[var(--color-ink-muted)]">
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
