import { useEffect, useRef, type TextareaHTMLAttributes } from 'react'

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  hint?: string
  autoSize?: boolean
}

export function TextArea({
  label,
  hint,
  id,
  className = '',
  autoSize = true,
  value,
  onChange,
  ...props
}: TextAreaProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!autoSize || !ref.current) return
    ref.current.style.height = 'auto'
    ref.current.style.height = `${ref.current.scrollHeight}px`
  }, [value, autoSize])

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={inputId} className="text-sm font-medium text-[var(--color-ink)]">
        {label}
      </label>
      <textarea
        ref={ref}
        id={inputId}
        value={value}
        onChange={onChange}
        rows={3}
        className="w-full resize-none rounded-xl border border-[var(--color-border)] bg-white px-3 py-2.5 text-sm leading-relaxed text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)]/60 focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
        {...props}
      />
      {hint && <p className="text-xs text-[var(--color-ink-muted)]">{hint}</p>}
    </div>
  )
}
