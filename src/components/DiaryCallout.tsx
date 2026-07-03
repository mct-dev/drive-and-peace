import type { ReactNode } from 'react'

interface DiaryCalloutProps {
  number?: number
  children: ReactNode
}

export function DiaryCallout({ number, children }: DiaryCalloutProps) {
  return (
    <div className="diary-callout flex gap-3 rounded-lg border border-[var(--color-diary-green)]/30 bg-[var(--color-diary-green-soft)] p-3 text-sm leading-relaxed text-[var(--color-ink)]">
      {number !== undefined && (
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[var(--color-diary-green)] text-xs font-bold text-white">
          {number}
        </span>
      )}
      <div>{children}</div>
    </div>
  )
}
