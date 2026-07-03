interface VerticalRatingProps {
  label: string
  value?: number
  onChange: (value: number | undefined) => void
  max?: number
}

export function VerticalRating({ label, value, onChange, max = 10 }: VerticalRatingProps) {
  return (
    <fieldset className="flex flex-col items-center gap-1">
      <legend className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
        {label}
      </legend>
      <div className="flex flex-col-reverse gap-0.5" role="radiogroup" aria-label={label}>
        {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            onClick={() => onChange(value === n ? undefined : n)}
            className={`flex h-7 w-7 items-center justify-center rounded border text-xs font-medium transition-colors ${
              value === n
                ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white'
                : 'border-[var(--color-border)] bg-white text-[var(--color-ink-muted)] hover:border-[var(--color-accent)]/40'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
