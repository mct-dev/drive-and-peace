import { Outlet } from 'react-router-dom'
import { BottomNav, Sidebar } from './BottomNav'

export function AppShell() {
  return (
    <div className="flex min-h-dvh bg-[var(--color-surface)]">
      <Sidebar />
      <div className="flex min-h-dvh flex-1 flex-col">
        <header className="border-b border-[var(--color-border)] bg-[var(--color-surface-raised)] px-4 py-3 md:hidden">
          <h1 className="text-center text-base font-semibold tracking-tight text-[var(--color-ink)]">
            Drive + Peace
          </h1>
        </header>
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-5 pb-24 md:pb-8">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  )
}
