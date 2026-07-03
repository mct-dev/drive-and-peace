export function todayISO(): string {
  return formatDateISO(new Date())
}

export function formatDateISO(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function formatDisplayDate(iso: string): string {
  const date = parseISODate(iso)
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatShortDate(iso: string): string {
  const date = parseISODate(iso)
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

export function getWeekStartISO(date: Date = new Date()): string {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return formatDateISO(d)
}

export function getWeekEndISO(weekStart: string): string {
  const d = parseISODate(weekStart)
  d.setDate(d.getDate() + 6)
  return formatDateISO(d)
}

export function isDateInWeek(dateISO: string, weekStartISO: string): boolean {
  const date = parseISODate(dateISO).getTime()
  const start = parseISODate(weekStartISO).getTime()
  const end = parseISODate(getWeekEndISO(weekStartISO)).getTime()
  return date >= start && date <= end
}

export function formatWeekRange(weekStart: string): string {
  const start = parseISODate(weekStart)
  const end = parseISODate(getWeekEndISO(weekStart))
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
  const startStr = start.toLocaleDateString(undefined, opts)
  const endStr = end.toLocaleDateString(undefined, {
    ...opts,
    year: start.getFullYear() !== end.getFullYear() ? 'numeric' : undefined,
  })
  return `${startStr} – ${endStr}`
}
