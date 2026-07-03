import { useState } from 'react'
import { useApp } from '../app/AppContext'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { TextField } from '../components/TextField'
import { TextArea } from '../components/TextArea'
import { EmptyState } from '../components/EmptyState'
import type { Goal } from '../types'
import { formatShortDate } from '../lib/dates'

function GoalForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<Goal>
  onSave: (data: { title: string; description: string; why: string; reasonForChange?: string }) => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [why, setWhy] = useState(initial?.why ?? '')
  const [reasonForChange, setReasonForChange] = useState('')

  const isEdit = Boolean(initial?.id)

  return (
    <div className="space-y-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <TextArea
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <TextArea label="Why this matters" value={why} onChange={(e) => setWhy(e.target.value)} />
      {isEdit && (
        <TextField
          label="Reason for change"
          value={reasonForChange}
          onChange={(e) => setReasonForChange(e.target.value)}
          hint="Required to preserve history when editing"
        />
      )}
      <div className="flex gap-2">
        <Button
          onClick={() =>
            onSave({
              title: title.trim(),
              description: description.trim(),
              why: why.trim(),
              reasonForChange: reasonForChange.trim() || undefined,
            })
          }
          disabled={!title.trim()}
        >
          Save goal
        </Button>
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  )
}

function GoalCard({
  goal,
  versions,
  onEdit,
  onPause,
  onReactivate,
  onRetire,
}: {
  goal: Goal
  versions: ReturnType<ReturnType<typeof useApp>['getGoalVersions']>
  onEdit: () => void
  onPause: () => void
  onReactivate: () => void
  onRetire: () => void
}) {
  const [showHistory, setShowHistory] = useState(false)

  return (
    <li className="rounded-xl border border-[var(--color-border)] bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-medium text-[var(--color-ink)]">{goal.title}</h3>
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{goal.description}</p>
          <p className="mt-2 text-xs text-[var(--color-accent)]">{goal.why}</p>
          <p className="mt-2 text-xs text-[var(--color-ink-muted)]">
            Status: {goal.status}
            {goal.retiredAt && ` · retired ${formatShortDate(goal.retiredAt.slice(0, 10))}`}
          </p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button variant="secondary" className="!px-3 !py-1.5 !text-xs" onClick={onEdit}>
          Edit
        </Button>
        {goal.status === 'active' && (
          <Button variant="ghost" className="!px-3 !py-1.5 !text-xs" onClick={onPause}>
            Pause
          </Button>
        )}
        {goal.status === 'paused' && (
          <Button variant="ghost" className="!px-3 !py-1.5 !text-xs" onClick={onReactivate}>
            Reactivate
          </Button>
        )}
        {goal.status !== 'retired' && (
          <Button variant="ghost" className="!px-3 !py-1.5 !text-xs" onClick={onRetire}>
            Retire
          </Button>
        )}
        {versions.length > 0 && (
          <Button
            variant="ghost"
            className="!px-3 !py-1.5 !text-xs"
            onClick={() => setShowHistory(!showHistory)}
          >
            {showHistory ? 'Hide history' : `History (${versions.length})`}
          </Button>
        )}
      </div>
      {showHistory && versions.length > 0 && (
        <ul className="mt-3 space-y-2 border-t border-[var(--color-border)] pt-3">
          {versions.map((v) => (
            <li key={v.id} className="text-xs text-[var(--color-ink-muted)]">
              <span className="font-medium text-[var(--color-ink)]">{v.title}</span>
              <p className="mt-0.5">{v.description}</p>
              <p className="mt-0.5 italic">Change: {v.reasonForChange}</p>
              <p className="mt-0.5">{formatShortDate(v.createdAt.slice(0, 10))}</p>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

export function GoalsPage() {
  const { data, addGoal, updateGoal, setGoalStatus, getGoalVersions } = useApp()
  const [creating, setCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showInactive, setShowInactive] = useState(false)

  const active = data.goals.filter((g) => g.status === 'active')
  const inactive = data.goals.filter((g) => g.status !== 'active')
  const editingGoal = editingId ? data.goals.find((g) => g.id === editingId) : undefined

  return (
    <div className="space-y-5">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-[var(--color-ink-muted)]">Goals</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">What you're moving toward</h1>
          <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
            Changing a goal is data, not failure.
          </p>
        </div>
        {!creating && !editingId && (
          <Button variant="secondary" onClick={() => setCreating(true)}>
            New goal
          </Button>
        )}
      </header>

      {creating && (
        <GoalForm
          onSave={(form) => {
            addGoal(form)
            setCreating(false)
          }}
          onCancel={() => setCreating(false)}
        />
      )}

      {editingGoal && (
        <GoalForm
          initial={editingGoal}
          onSave={(form) => {
            updateGoal(editingGoal.id, form, form.reasonForChange)
            setEditingId(null)
          }}
          onCancel={() => setEditingId(null)}
        />
      )}

      <Card title="Active goals">
        {active.length === 0 ? (
          <EmptyState
            title="No active goals"
            description="Add a goal that reflects what matters — not what sounds impressive."
          />
        ) : (
          <ul className="space-y-3">
            {active.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                versions={getGoalVersions(goal.id)}
                onEdit={() => setEditingId(goal.id)}
                onPause={() => setGoalStatus(goal.id, 'paused')}
                onReactivate={() => setGoalStatus(goal.id, 'active')}
                onRetire={() => setGoalStatus(goal.id, 'retired')}
              />
            ))}
          </ul>
        )}
      </Card>

      {inactive.length > 0 && (
        <Card>
          <button
            type="button"
            className="flex w-full items-center justify-between text-left"
            onClick={() => setShowInactive(!showInactive)}
          >
            <span className="text-base font-semibold text-[var(--color-ink)]">
              Paused & retired ({inactive.length})
            </span>
            <span className="text-sm text-[var(--color-ink-muted)]">
              {showInactive ? 'Hide' : 'Show'}
            </span>
          </button>
          {showInactive && (
            <ul className="mt-3 space-y-3">
              {inactive.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  versions={getGoalVersions(goal.id)}
                  onEdit={() => setEditingId(goal.id)}
                  onPause={() => setGoalStatus(goal.id, 'paused')}
                  onReactivate={() => setGoalStatus(goal.id, 'active')}
                  onRetire={() => setGoalStatus(goal.id, 'retired')}
                />
              ))}
            </ul>
          )}
        </Card>
      )}
    </div>
  )
}
