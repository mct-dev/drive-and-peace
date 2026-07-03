import { useState } from 'react'
import { useApp } from '../app/AppContext'
import { Button } from '../components/Button'
import { TextArea } from '../components/TextArea'
import { DiarySection } from '../components/DiarySection'

export function VisionPage() {
  const { data, updateProfile } = useApp()
  const profile = data.profile

  const [vision, setVision] = useState(profile.vision)
  const [why, setWhy] = useState(profile.why)
  const [mission, setMission] = useState(profile.mission)
  const [coreValues, setCoreValues] = useState(profile.coreValues)
  const [personToBecome, setPersonToBecome] = useState(profile.personToBecome)
  const [goals1yr, setGoals1yr] = useState(profile.goals1yr)
  const [goals3yr, setGoals3yr] = useState(profile.goals3yr)
  const [goals5yr, setGoals5yr] = useState(profile.goals5yr)
  const [goals10yr, setGoals10yr] = useState(profile.goals10yr)
  const [legacy, setLegacy] = useState(profile.legacy)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    updateProfile({
      vision,
      why,
      mission,
      coreValues,
      personToBecome,
      goals1yr,
      goals3yr,
      goals5yr,
      goals10yr,
      legacy,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-5">
      <header className="flex gap-4">
        <div className="hidden shrink-0 sm:block">
          <span className="diary-vertical-title">My Vision</span>
        </div>
        <div>
          <h1 className="diary-day-heading sm:hidden">My Vision</h1>
          <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
            The north star for your drive — and your peace.
          </p>
        </div>
      </header>

      <div className="diary-spread">
        <DiarySection title="My vision" className="flex flex-col">
          <h2 className="diary-day-heading mb-4">My Vision</h2>
          <div className="flex flex-1 flex-col gap-1.5">
            <label htmlFor="vision-text" className="sr-only">
              Vision statement
            </label>
            <textarea
              id="vision-text"
              value={vision}
              onChange={(e) => setVision(e.target.value)}
              rows={14}
              placeholder="Who you are becoming, and the life you are building toward…"
              className="diary-lined-textarea min-h-[20rem] w-full flex-1 resize-none rounded-xl border border-[var(--color-border)] bg-white px-3 py-2.5 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)]/60 focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
            />
          </div>
        </DiarySection>

        <div className="space-y-4">
          <DiarySection title="Prompts to get you started">
            <div className="space-y-4">
              <TextArea label="Why" value={why} onChange={(e) => setWhy(e.target.value)} />
              <TextArea label="Mission" value={mission} onChange={(e) => setMission(e.target.value)} />
              <TextArea
                label="Core values"
                value={coreValues}
                onChange={(e) => setCoreValues(e.target.value)}
              />
              <TextArea
                label="Person I want to become"
                value={personToBecome}
                onChange={(e) => setPersonToBecome(e.target.value)}
              />
              <TextArea
                label="1-year goals"
                value={goals1yr}
                onChange={(e) => setGoals1yr(e.target.value)}
              />
              <TextArea
                label="3-year goals"
                value={goals3yr}
                onChange={(e) => setGoals3yr(e.target.value)}
              />
              <TextArea
                label="5-year goals"
                value={goals5yr}
                onChange={(e) => setGoals5yr(e.target.value)}
              />
              <TextArea
                label="10-year goals"
                value={goals10yr}
                onChange={(e) => setGoals10yr(e.target.value)}
              />
              <TextArea
                label="Legacy — how I want to be remembered"
                value={legacy}
                onChange={(e) => setLegacy(e.target.value)}
              />
            </div>
          </DiarySection>

          <div className="flex items-center gap-3">
            <Button onClick={handleSave}>Save vision</Button>
            {saved && (
              <span className="text-sm text-[var(--color-accent)]" role="status">
                Saved
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
