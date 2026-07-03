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
      aria-label={label}
      className={({ isActive }) =>
        `flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-lg px-0.5 py-1.5 text-[9px] font-medium transition-colors ${
          isActive
            ? 'text-[var(--color-accent)]'
            : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]'
        }`
      }
    >
      <span className="text-base leading-none" aria-hidden>
        {icon}
      </span>
      <span className="w-full truncate text-center leading-tight">{label}</span>
    </NavLink>
  )
}

export function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 w-full max-w-[100vw] border-t border-[var(--color-border)] bg-[var(--color-surface-raised)]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
      aria-label="Main navigation"
    >
      <div className="mx-auto grid w-full max-w-lg grid-cols-7 gap-0 px-0.5 py-1">
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
