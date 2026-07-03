import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  children: ReactNode
  loading?: boolean
}

const variants: Record<Variant, string> = {
  primary:
    'bg-[var(--color-accent)] text-white hover:opacity-90 disabled:opacity-50',
  secondary:
    'bg-[var(--color-accent-soft)] text-[var(--color-accent)] hover:opacity-90 disabled:opacity-50',
  ghost:
    'bg-transparent text-[var(--color-ink-muted)] hover:bg-[var(--color-border)]/50 disabled:opacity-50',
  danger:
    'bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50',
}

export function Button({
  variant = 'primary',
  children,
  loading,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-opacity ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Saving…' : children}
    </button>
  )
}
