import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../app/AppContext'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { TextField } from '../components/TextField'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { exportStorageJSON, importStorageJSON } from '../data/storage'
import { formatDisplayDate } from '../lib/dates'
import { APP_VERSION } from '../components/UpdateBanner'

export function SettingsPage() {
  const { data, updateProfile, updateProgram, replaceAllData, resetAllData } = useApp()
  const [name, setName] = useState(data.profile.name)
  const [startDate, setStartDate] = useState(data.program.startDate)
  const [saved, setSaved] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const [confirmReset, setConfirmReset] = useState(false)
  const [confirmImport, setConfirmImport] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleSave = () => {
    updateProfile({ name })
    updateProgram({ startDate })
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
      setStartDate(imported.program.startDate)
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
          <TextField
            label="Program start date (Day 1)"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            hint={`Day 1 began ${formatDisplayDate(startDate)}`}
          />
          <p className="text-sm text-[var(--color-ink-muted)]">
            Vision, mission, and legacy live on the{' '}
            <Link to="/vision" className="font-medium text-[var(--color-accent)]">
              Vision page
            </Link>
            .
          </p>
          <div className="flex items-center gap-3">
            <Button onClick={handleSave}>Save</Button>
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
          Drive + Peace v{APP_VERSION} — 1% diary format
        </p>
        <p className="mt-2 text-xs text-[var(--color-ink-muted)]">
          If pages look outdated, hard-refresh (Ctrl+Shift+R) or clear site data for this URL.
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
          setStartDate(fresh.program.startDate)
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
