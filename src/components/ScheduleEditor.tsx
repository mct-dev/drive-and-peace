import type { ScheduleSlot } from '../types'

interface ScheduleEditorProps {
  slots: ScheduleSlot[]
  onChange: (slots: ScheduleSlot[]) => void
}

export function ScheduleEditor({ slots, onChange }: ScheduleEditorProps) {
  const updateSlot = (index: number, note: string) => {
    onChange(slots.map((s, i) => (i === index ? { ...s, note } : s)))
  }

  return (
    <div className="space-y-0">
      {slots.map((slot, index) => (
        <div
          key={`${slot.hour}-${index}`}
          className="flex items-baseline gap-3 border-b border-[var(--color-border)]/60 py-1.5"
        >
          <span className="w-24 shrink-0 text-xs font-medium tabular-nums text-[var(--color-ink-muted)]">
            {slot.hour}
          </span>
          <input
            type="text"
            value={slot.note}
            onChange={(e) => updateSlot(index, e.target.value)}
            placeholder="—"
            className="diary-lined-input flex-1 border-0 bg-transparent py-0.5 text-sm text-[var(--color-ink)] outline-none"
          />
        </div>
      ))}
    </div>
  )
}
