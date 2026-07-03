import { useEffect, useState } from 'react'
import { Button } from './Button'

export const APP_VERSION = '0.2.1'

export function UpdateBanner() {
  const [needsRefresh, setNeedsRefresh] = useState(false)

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    let updateSW: (() => void) | undefined

    import('virtual:pwa-register')
      .then(({ registerSW }) => {
        updateSW = registerSW({
          immediate: true,
          onNeedRefresh() {
            setNeedsRefresh(true)
          },
          onOfflineReady() {
            // handled separately if needed
          },
        })
      })
      .catch(() => {
        // PWA not available in dev
      })

    return () => {
      void updateSW
    }
  }, [])

  if (!needsRefresh) return null

  return (
    <div
      className="fixed inset-x-0 top-0 z-[100] border-b border-[var(--color-accent)] bg-[var(--color-accent)] px-4 py-3 text-white shadow-md"
      role="alert"
    >
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium">
          A new diary version (v{APP_VERSION}) is ready — refresh to see DAY spreads, goal grid, and Vision page.
        </p>
        <Button
          variant="secondary"
          className="!bg-white !text-[var(--color-accent)]"
          onClick={() => window.location.reload()}
        >
          Refresh now
        </Button>
      </div>
    </div>
  )
}

export function OfflineReadyToast() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    import('virtual:pwa-register')
      .then(({ registerSW }) => {
        registerSW({
          onOfflineReady() {
            setShow(true)
            setTimeout(() => setShow(false), 4000)
          },
        })
      })
      .catch(() => {})
  }, [])

  if (!show) return null

  return (
    <div className="fixed bottom-20 left-1/2 z-[100] -translate-x-1/2 rounded-full bg-[var(--color-ink)] px-4 py-2 text-xs text-white shadow-lg md:bottom-6">
      App ready for offline use
    </div>
  )
}
