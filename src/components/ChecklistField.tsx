import type { MissionItem } from '../types'

interface ChecklistFieldProps {
  label: string
  items: MissionItem[]
  onChange: (items: MissionItem[]) => void
  numbered?: boolean
  maxItems?: number
  placeholder?: string
}

export function ChecklistField({
  label,
  items,
  onChange,
  numbered = false,
  maxItems,
  placeholder = '',
}: ChecklistFieldProps) {
  const displayItems = maxItems ? items.slice(0, maxItems) : items

  const updateItem = (index: number, patch: Partial<MissionItem>) => {
    const next = displayItems.map((item, i) => (i === index ? { ...item, ...patch } : item))
    onChange(next)
  }

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="diary-label">{label}</legend>
      <ul className="space-y-2">
        {displayItems.map((item, index) => (
          <li key={item.id} className="flex items-center gap-2">
            {numbered && (
              <span className="w-5 shrink-0 text-right text-xs font-medium text-[var(--color-ink-muted)]">
                {index + 1}
              </span>
            )}
            <input
              type="checkbox"
              checked={item.done}
              onChange={(e) => updateItem(index, { done: e.target.checked })}
              className="h-4 w-4 shrink-0 rounded border-[var(--color-border)] accent-[var(--color-accent)]"
              aria-label={`Mark item ${index + 1} done`}
            />
            <input
              type="text"
              value={item.text}
              onChange={(e) => updateItem(index, { text: e.target.value })}
              placeholder={placeholder}
              className="diary-lined-input flex-1 border-0 border-b border-[var(--color-border)] bg-transparent py-1 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)]"
            />
          </li>
        ))}
      </ul>
    </fieldset>
  )
}
