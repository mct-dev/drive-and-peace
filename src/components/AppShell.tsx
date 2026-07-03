import { Outlet } from 'react-router-dom'
import { BottomNav, Sidebar } from './BottomNav'

export function AppShell() {
  return (
    <div className="flex min-h-dvh w-full overflow-x-hidden bg-[var(--color-surface)]">
      <Sidebar />
      <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
        <header className="shrink-0 border-b border-[var(--color-border)] bg-[var(--color-surface-raised)] px-4 py-3 md:hidden">
          <h1 className="text-center text-base font-semibold tracking-tight text-[var(--color-ink)]">
            Drive + Peace
          </h1>
        </header>
        <main className="mx-auto w-full min-w-0 max-w-5xl flex-1 px-4 py-5 pb-[calc(5rem+env(safe-area-inset-bottom))] pt-14 md:pb-8 md:pt-5">
          <div className="diary-page min-h-[60vh]">
            <Outlet />
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
