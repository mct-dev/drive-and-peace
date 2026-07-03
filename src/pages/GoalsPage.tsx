import { useState } from 'react'
import { useApp } from '../app/AppContext'
import { Button } from '../components/Button'
import { TextField } from '../components/TextField'
import { TextArea } from '../components/TextArea'
import { ChecklistField } from '../components/ChecklistField'
import { DiarySection } from '../components/DiarySection'
import { DiaryCallout } from '../components/DiaryCallout'
import { Card } from '../components/Card'
import { EmptyState } from '../components/EmptyState'
import type { Goal, GoalMilestone } from '../types'
import { formatShortDate, todayISO } from '../lib/dates'
import { createId } from '../lib/id'

type GoalFormData = {
  title: string
  description: string
  why: string
  dailyAction: string
  milestones: GoalMilestone[]
  sortOrder: number
  reasonForChange?: string
}

function MilestonesEditor({
  milestones,
  onChange,
}: {
  milestones: GoalMilestone[]
  onChange: (milestones: GoalMilestone[]) => void
}) {
  const addMilestone = () => {
    onChange([...milestones, { id: createId(), text: '', done: false }])
  }

  const removeMilestone = (id: string) => {
    onChange(milestones.filter((m) => m.id !== id))
  }

  return (
    <div className="space-y-2">
      <ChecklistField
        label="Milestones"
        items={milestones}
        onChange={onChange}
        placeholder="A checkpoint on the way to your 3-month goal"
      />
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="ghost" className="!px-3 !py-1.5 !text-xs" onClick={addMilestone}>
          Add milestone
        </Button>
        {milestones.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            className="!px-3 !py-1.5 !text-xs"
            onClick={() => removeMilestone(milestones[milestones.length - 1].id)}
          >
            Remove last
          </Button>
        )}
      </div>
    </div>
  )
}

function GoalForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<Goal>
  onSave: (data: GoalFormData) => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [why, setWhy] = useState(initial?.why ?? '')
  const [dailyAction, setDailyAction] = useState(initial?.dailyAction ?? '')
  const [milestones, setMilestones] = useState<GoalMilestone[]>(initial?.milestones ?? [])
  const [sortOrder, setSortOrder] = useState(initial?.sortOrder ?? 1)
  const [reasonForChange, setReasonForChange] = useState('')

  const isEdit = Boolean(initial?.id)

  const handleSave = () => {
    onSave({
      title: title.trim(),
      description: description.trim(),
      why: why.trim(),
      dailyAction: dailyAction.trim(),
      milestones,
      sortOrder: Math.min(3, Math.max(1, sortOrder)),
      reasonForChange: reasonForChange.trim() || undefined,
    })
  }

  return (
    <div className="space-y-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <TextArea
        label="3-month goal"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        hint="What you want to achieve in the next quarter"
      />
      <TextArea label="Why this matters" value={why} onChange={(e) => setWhy(e.target.value)} />
      <TextArea
        label="Daily 1% action"
        value={dailyAction}
        onChange={(e) => setDailyAction(e.target.value)}
        placeholder="One small thing you can do every day"
      />
      <MilestonesEditor milestones={milestones} onChange={setMilestones} />
      <TextField
        label="Grid position"
        type="number"
        min={1}
        max={3}
        value={sortOrder}
        onChange={(e) => setSortOrder(Number(e.target.value) || 1)}
        hint="Position 1–3 on your goals spread"
      />
      {isEdit && (
        <TextField
          label="Reason for change"
          value={reasonForChange}
          onChange={(e) => setReasonForChange(e.target.value)}
          hint="Required to preserve history when editing title, description, why, daily action, or milestones"
        />
      )}
      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={!title.trim()}>
          Save goal
        </Button>
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  )
}

function GoalSpreadCard({
  slot,
  goal,
  versions,
  onEdit,
  onPause,
  onReactivate,
  onRetire,
  onMilestonesChange,
}: {
  slot: number
  goal: Goal | null
  versions: ReturnType<ReturnType<typeof useApp>['getGoalVersions']>
  onEdit: () => void
  onPause: () => void
  onReactivate: () => void
  onRetire: () => void
  onMilestonesChange: (milestones: GoalMilestone[]) => void
}) {
  const [showHistory, setShowHistory] = useState(false)

  if (!goal) {
    return (
      <div className="flex min-h-[12rem] flex-col rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)]/50 p-4">
        <p className="diary-label">Goal {slot}</p>
        <p className="mt-auto text-sm text-[var(--color-ink-muted)]">Open slot — add a goal to fill this space.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col rounded-xl border border-[var(--color-border)] bg-white p-4">
      <p className="diary-label">Goal {slot}</p>
      <h3 className="mt-2 text-base font-semibold text-[var(--color-ink)]">{goal.title}</h3>

      {goal.description && (
        <div className="mt-3">
          <p className="diary-label">3-month goal</p>
          <p className="mt-1 text-sm leading-relaxed text-[var(--color-ink)]">{goal.description}</p>
        </div>
      )}

      {goal.why && (
        <div className="mt-3">
          <p className="diary-label">Why</p>
          <p className="mt-1 text-sm leading-relaxed text-[var(--color-accent)]">{goal.why}</p>
        </div>
      )}

      {goal.dailyAction && (
        <div className="mt-3">
          <p className="diary-label">Daily 1% action</p>
          <p className="mt-1 text-sm leading-relaxed text-[var(--color-ink)]">{goal.dailyAction}</p>
        </div>
      )}

      {goal.milestones.length > 0 && (
        <div className="mt-3">
          <ChecklistField
            label="Milestones"
            items={goal.milestones}
            onChange={onMilestonesChange}
          />
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--color-border)] pt-3">
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
              {v.dailyAction && <p className="mt-0.5">Daily: {v.dailyAction}</p>}
              <p className="mt-0.5 italic">Change: {v.reasonForChange}</p>
              <p className="mt-0.5">{formatShortDate(v.createdAt.slice(0, 10))}</p>
            </li>
          ))}
        </ul>
      )}
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
  onMilestonesChange,
}: {
  goal: Goal
  versions: ReturnType<ReturnType<typeof useApp>['getGoalVersions']>
  onEdit: () => void
  onPause: () => void
  onReactivate: () => void
  onRetire: () => void
  onMilestonesChange: (milestones: GoalMilestone[]) => void
}) {
  const [showHistory, setShowHistory] = useState(false)

  return (
    <li className="rounded-xl border border-[var(--color-border)] bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-medium text-[var(--color-ink)]">{goal.title}</h3>
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{goal.description}</p>
          <p className="mt-2 text-xs text-[var(--color-accent)]">{goal.why}</p>
          {goal.dailyAction && (
            <p className="mt-2 text-xs text-[var(--color-ink)]">Daily: {goal.dailyAction}</p>
          )}
          <p className="mt-2 text-xs text-[var(--color-ink-muted)]">
            Status: {goal.status}
            {goal.retiredAt && ` · retired ${formatShortDate(goal.retiredAt.slice(0, 10))}`}
          </p>
        </div>
      </div>
      {goal.milestones.length > 0 && (
        <div className="mt-3">
          <ChecklistField
            label="Milestones"
            items={goal.milestones}
            onChange={onMilestonesChange}
          />
        </div>
      )}
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
  const sortedActive = [...active].sort((a, b) => a.sortOrder - b.sortOrder)
  const spreadGoals = [1, 2, 3].map((slot) => sortedActive[slot - 1] ?? null)
  const extraActive = sortedActive.slice(3)
  const inactive = data.goals.filter((g) => g.status !== 'active')
  const editingGoal = editingId ? data.goals.find((g) => g.id === editingId) : undefined

  const handleMilestonesChange = (goalId: string, milestones: GoalMilestone[]) => {
    updateGoal(goalId, { milestones })
  }

  return (
    <div className="space-y-5">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-[var(--color-ink-muted)]">Goals</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Find your 1%s</h1>
          <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
            Three 3-month goals — each with a daily 1% action. Changing a goal is data, not failure.
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
            addGoal({
              title: form.title,
              description: form.description,
              why: form.why,
              dailyAction: form.dailyAction,
              milestones: form.milestones,
              sortOrder: form.sortOrder,
              quarterStart: todayISO(),
            })
            setCreating(false)
          }}
          onCancel={() => setCreating(false)}
        />
      )}

      {editingGoal && (
        <GoalForm
          initial={editingGoal}
          onSave={(form) => {
            updateGoal(
              editingGoal.id,
              {
                title: form.title,
                description: form.description,
                why: form.why,
                dailyAction: form.dailyAction,
                milestones: form.milestones,
                sortOrder: form.sortOrder,
              },
              form.reasonForChange,
            )
            setEditingId(null)
          }}
          onCancel={() => setEditingId(null)}
        />
      )}

      <DiarySection
        title="Find your 1%s"
        subtitle="Your three focus goals for the next 3 months"
        className="diary-spread !block"
      >
        <DiaryCallout number={1}>
          Pick three goals that matter — not what sounds impressive. Each one needs a daily 1% action
          small enough to do on a hard day.
        </DiaryCallout>

        {active.length === 0 ? (
          <EmptyState
            title="No active goals"
            description="Add a goal that reflects what matters — not what sounds impressive."
          />
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {spreadGoals.map((goal, index) => (
              <GoalSpreadCard
                key={goal?.id ?? `slot-${index + 1}`}
                slot={index + 1}
                goal={goal}
                versions={goal ? getGoalVersions(goal.id) : []}
                onEdit={() => goal && setEditingId(goal.id)}
                onPause={() => goal && setGoalStatus(goal.id, 'paused')}
                onReactivate={() => goal && setGoalStatus(goal.id, 'active')}
                onRetire={() => goal && setGoalStatus(goal.id, 'retired')}
                onMilestonesChange={(milestones) => goal && handleMilestonesChange(goal.id, milestones)}
              />
            ))}
          </div>
        )}
      </DiarySection>

      {extraActive.length > 0 && (
        <Card title="Additional active goals">
          <ul className="space-y-3">
            {extraActive.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                versions={getGoalVersions(goal.id)}
                onEdit={() => setEditingId(goal.id)}
                onPause={() => setGoalStatus(goal.id, 'paused')}
                onReactivate={() => setGoalStatus(goal.id, 'active')}
                onRetire={() => setGoalStatus(goal.id, 'retired')}
                onMilestonesChange={(milestones) => handleMilestonesChange(goal.id, milestones)}
              />
            ))}
          </ul>
        </Card>
      )}

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
                  onMilestonesChange={(milestones) => handleMilestonesChange(goal.id, milestones)}
                />
              ))}
            </ul>
          )}
        </Card>
      )}
    </div>
  )
}
