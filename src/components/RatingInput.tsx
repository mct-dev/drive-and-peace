interface RatingInputProps {
  label: string
  value?: number
  onChange: (value: number | undefined) => void
  max?: number
}

export function RatingInput({ label, value, onChange, max = 5 }: RatingInputProps) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-sm font-medium text-[var(--color-ink)]">{label}</legend>
      <div className="flex gap-2" role="radiogroup" aria-label={label}>
        {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            onClick={() => onChange(value === n ? undefined : n)}
            className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-medium transition-colors ${
              value === n
                ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white'
                : 'border-[var(--color-border)] bg-white text-[var(--color-ink-muted)] hover:border-[var(--color-accent)]/40'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <p className="text-xs text-[var(--color-ink-muted)]">Optional — tap again to clear</p>
    </fieldset>
  )
}
