import { useMemo, useState } from 'react'
import { useApp } from '../app/AppContext'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { TextField } from '../components/TextField'
import { TextArea } from '../components/TextArea'
import { Select } from '../components/Select'
import { RatingInput } from '../components/RatingInput'
import { EmptyState } from '../components/EmptyState'
import { formatDisplayDate } from '../lib/dates'

export function EntriesPage() {
  const { data, upsertDailyEntry, deleteDailyEntry } = useApp()
  const [search, setSearch] = useState('')
  const [goalFilter, setGoalFilter] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  const entries = useMemo(() => {
    return [...data.dailyEntries]
      .sort((a, b) => b.date.localeCompare(a.date))
      .filter((e) => {
        const blob = [
          e.onePercentAction,
          e.mood,
          e.lesson,
          e.freeformText,
          e.endOfDayResult,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        const matchesSearch = !search || blob.includes(search.toLowerCase())
        const matchesGoal = !goalFilter || e.goalId === goalFilter
        return matchesSearch && matchesGoal
      })
  }, [data.dailyEntries, search, goalFilter])

  const editing = editingId ? data.dailyEntries.find((e) => e.id === editingId) : null

  const [form, setForm] = useState({
    energy: undefined as number | undefined,
    mood: '',
    onePercentAction: '',
    goalId: '',
    possibleObstacle: '',
    tinyVersion: '',
    endOfDayResult: '',
    lesson: '',
    freeformText: '',
  })

  const openEdit = (id: string) => {
    const entry = data.dailyEntries.find((e) => e.id === id)
    if (!entry) return
    setEditingId(id)
    setForm({
      energy: entry.energy,
      mood: entry.mood ?? '',
      onePercentAction: entry.onePercentAction,
      goalId: entry.goalId ?? '',
      possibleObstacle: entry.possibleObstacle ?? '',
      tinyVersion: entry.tinyVersion ?? '',
      endOfDayResult: entry.endOfDayResult ?? '',
      lesson: entry.lesson ?? '',
      freeformText: entry.freeformText ?? '',
    })
  }

  const handleSave = () => {
    if (!editing || !form.onePercentAction.trim()) return
    upsertDailyEntry({
      ...editing,
      energy: form.energy,
      mood: form.mood || undefined,
      onePercentAction: form.onePercentAction.trim(),
      goalId: form.goalId || undefined,
      possibleObstacle: form.possibleObstacle || undefined,
      tinyVersion: form.tinyVersion || undefined,
      endOfDayResult: form.endOfDayResult || undefined,
      lesson: form.lesson || undefined,
      freeformText: form.freeformText || undefined,
    })
    setEditingId(null)
  }

  const activeGoals = data.goals.filter((g) => g.status === 'active')

  return (
    <div className="space-y-5">
      <header>
        <p className="text-sm text-[var(--color-ink-muted)]">Entries</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Your daily record</h1>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row">
        <TextField
          label="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search text…"
          className="flex-1"
        />
        <Select
          label="Goal"
          value={goalFilter}
          onChange={(e) => setGoalFilter(e.target.value)}
          options={[
            { value: '', label: 'All goals' },
            ...data.goals.map((g) => ({ value: g.id, label: g.title })),
          ]}
          className="flex-1"
        />
      </div>

      {editing && (
        <Card title={`Edit — ${formatDisplayDate(editing.date)}`}>
          <div className="space-y-4">
            <RatingInput
              label="Energy"
              value={form.energy}
              onChange={(v) => setForm((f) => ({ ...f, energy: v }))}
            />
            <TextField
              label="Mood"
              value={form.mood}
              onChange={(e) => setForm((f) => ({ ...f, mood: e.target.value }))}
            />
            <TextArea
              label="1% action"
              value={form.onePercentAction}
              onChange={(e) => setForm((f) => ({ ...f, onePercentAction: e.target.value }))}
            />
            <Select
              label="Goal"
              value={form.goalId}
              onChange={(e) => setForm((f) => ({ ...f, goalId: e.target.value }))}
              options={[
                { value: '', label: 'None' },
                ...activeGoals.map((g) => ({ value: g.id, label: g.title })),
              ]}
            />
            <TextArea
              label="Lesson"
              value={form.lesson}
              onChange={(e) => setForm((f) => ({ ...f, lesson: e.target.value }))}
            />
            <TextArea
              label="Freeform"
              value={form.freeformText}
              onChange={(e) => setForm((f) => ({ ...f, freeformText: e.target.value }))}
            />
            <div className="flex gap-2">
              <Button onClick={handleSave}>Save</Button>
              <Button variant="ghost" onClick={() => setEditingId(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  deleteDailyEntry(editing.id)
                  setEditingId(null)
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </Card>
      )}

      {entries.length === 0 ? (
        <EmptyState
          title="No entries yet"
          description="Start on Today, or keep a physical journal if that feels better. This app is a mirror — not a mandate."
        />
      ) : (
        <ul className="space-y-3">
          {entries.map((entry) => {
            const goal = data.goals.find((g) => g.id === entry.goalId)
            return (
              <li key={entry.id}>
                <Card>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-[var(--color-ink-muted)]">
                        {formatDisplayDate(entry.date)}
                        {entry.energy && ` · Energy ${entry.energy}/5`}
                        {entry.mood && ` · ${entry.mood}`}
                      </p>
                      <p className="mt-1 text-sm text-[var(--color-ink)]">{entry.onePercentAction}</p>
                      {goal && (
                        <p className="mt-1 text-xs text-[var(--color-accent)]">{goal.title}</p>
                      )}
                      {entry.lesson && (
                        <p className="mt-2 text-xs text-[var(--color-ink-muted)]">
                          Lesson: {entry.lesson}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      className="shrink-0 !px-2 !py-1 !text-xs"
                      onClick={() => openEdit(entry.id)}
                    >
                      Edit
                    </Button>
                  </div>
                </Card>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
