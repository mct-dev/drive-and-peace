import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  title?: string
  subtitle?: string
}

export function Card({ children, className = '', title, subtitle }: CardProps) {
  return (
    <section
      className={`rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-4 shadow-sm ${className}`}
    >
      {(title || subtitle) && (
        <header className="mb-3">
          {title && <h2 className="text-base font-semibold text-[var(--color-ink)]">{title}</h2>}
          {subtitle && (
            <p className="mt-0.5 text-sm text-[var(--color-ink-muted)]">{subtitle}</p>
          )}
        </header>
      )}
      {children}
    </section>
  )
}
