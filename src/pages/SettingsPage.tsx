import { useRef, useState } from 'react'
import { useApp } from '../app/AppContext'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { TextField } from '../components/TextField'
import { TextArea } from '../components/TextArea'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { exportStorageJSON, importStorageJSON } from '../data/storage'

export function SettingsPage() {
  const { data, updateProfile, replaceAllData, resetAllData } = useApp()
  const [name, setName] = useState(data.profile.name)
  const [why, setWhy] = useState(data.profile.why)
  const [vision, setVision] = useState(data.profile.vision)
  const [legacy, setLegacy] = useState(data.profile.legacy)
  const [saved, setSaved] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const [confirmReset, setConfirmReset] = useState(false)
  const [confirmImport, setConfirmImport] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleSaveProfile = () => {
    updateProfile({ name, why, vision, legacy })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleExport = () => {
    const json = exportStorageJSON(data)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `drive-peace-export-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      setConfirmImport(text)
      setImportError(null)
    } catch {
      setImportError('Could not read file.')
    }
    e.target.value = ''
  }

  const doImport = () => {
    if (!confirmImport) return
    try {
      const imported = importStorageJSON(confirmImport)
      replaceAllData(imported)
      setName(imported.profile.name)
      setWhy(imported.profile.why)
      setVision(imported.profile.vision)
      setLegacy(imported.profile.legacy)
      setConfirmImport(null)
      setImportError(null)
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Import failed.')
      setConfirmImport(null)
    }
  }

  return (
    <div className="space-y-5">
      <header>
        <p className="text-sm text-[var(--color-ink-muted)]">Settings</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Your space</h1>
      </header>

      <Card title="Profile">
        <div className="space-y-4">
          <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <TextArea label="Why" value={why} onChange={(e) => setWhy(e.target.value)} />
          <TextArea label="Vision" value={vision} onChange={(e) => setVision(e.target.value)} />
          <TextArea label="Legacy" value={legacy} onChange={(e) => setLegacy(e.target.value)} />
          <div className="flex items-center gap-3">
            <Button onClick={handleSaveProfile}>Save profile</Button>
            {saved && (
              <span className="text-sm text-[var(--color-accent)]" role="status">
                Saved
              </span>
            )}
          </div>
        </div>
      </Card>

      <Card title="Data">
        <div className="space-y-3">
          <Button variant="secondary" onClick={handleExport}>
            Export JSON
          </Button>
          <div>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={handleFileSelect}
            />
            <Button variant="secondary" onClick={() => fileRef.current?.click()}>
              Import JSON
            </Button>
          </div>
          {importError && (
            <p className="text-sm text-red-600" role="alert">
              {importError}
            </p>
          )}
          <Button variant="danger" onClick={() => setConfirmReset(true)}>
            Reset all data
          </Button>
        </div>
      </Card>

      <Card title="Privacy">
        <p className="text-sm leading-relaxed text-[var(--color-ink-muted)]">
          This MVP stores data only in this browser. Export regularly if you care about keeping it.
          No accounts, no servers, no analytics.
        </p>
        <p className="mt-3 text-xs text-[var(--color-ink-muted)]">
          Drive + Peace v0.1.0 — local-first personal growth diary
        </p>
      </Card>

      <ConfirmDialog
        open={confirmReset}
        title="Reset all data?"
        message="This will erase everything and restore defaults. Export first if you need a backup."
        confirmLabel="Reset"
        variant="danger"
        onConfirm={() => {
          const fresh = resetAllData()
          setConfirmReset(false)
          setName(fresh.profile.name)
          setWhy(fresh.profile.why)
          setVision(fresh.profile.vision)
          setLegacy(fresh.profile.legacy)
        }}
        onCancel={() => setConfirmReset(false)}
      />

      <ConfirmDialog
        open={Boolean(confirmImport)}
        title="Import data?"
        message="This will replace all current data with the imported file. Continue?"
        confirmLabel="Import"
        onConfirm={doImport}
        onCancel={() => setConfirmImport(null)}
      />
    </div>
  )
}
