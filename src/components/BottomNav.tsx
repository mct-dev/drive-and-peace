import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Today', icon: '◎' },
  { to: '/goals', label: 'Goals', icon: '◇' },
  { to: '/entries', label: 'Entries', icon: '≡' },
  { to: '/weekly', label: 'Week', icon: '◫' },
  { to: '/coach', label: 'Coach', icon: '◉' },
  { to: '/insights', label: 'Insights', icon: '◌' },
  { to: '/settings', label: 'Settings', icon: '⚙' },
]

function NavItem({ to, label, icon }: { to: string; label: string; icon: string }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        `flex flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-[10px] font-medium transition-colors ${
          isActive
            ? 'text-[var(--color-accent)]'
            : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]'
        }`
      }
    >
      <span className="text-base leading-none" aria-hidden>
        {icon}
      </span>
      <span>{label}</span>
    </NavLink>
  )
}

export function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--color-border)] bg-[var(--color-surface-raised)]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-lg justify-around px-1 py-1.5">
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </div>
    </nav>
  )
}

export function Sidebar() {
  return (
    <aside className="hidden w-56 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-surface-raised)] p-4 md:block">
      <div className="mb-8">
        <h1 className="text-lg font-semibold tracking-tight text-[var(--color-ink)]">
          Drive + Peace
        </h1>
        <p className="mt-1 text-xs text-[var(--color-ink-muted)]">A small mirror</p>
      </div>
      <nav className="flex flex-col gap-1" aria-label="Main navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
                  : 'text-[var(--color-ink-muted)] hover:bg-[var(--color-border)]/40 hover:text-[var(--color-ink)]'
              }`
            }
          >
            <span className="mr-2 opacity-60" aria-hidden>
              {item.icon}
            </span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
