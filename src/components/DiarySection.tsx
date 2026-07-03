import type { ReactNode } from 'react'

interface DiarySectionProps {
  title: string
  subtitle?: string
  children: ReactNode
  className?: string
}

export function DiarySection({ title, subtitle, children, className = '' }: DiarySectionProps) {
  return (
    <section className={`diary-section ${className}`}>
      <header className="mb-3">
        <h2 className="diary-heading">{title}</h2>
        {subtitle && <p className="mt-1 text-xs text-[var(--color-ink-muted)]">{subtitle}</p>}
      </header>
      {children}
    </section>
  )
}
