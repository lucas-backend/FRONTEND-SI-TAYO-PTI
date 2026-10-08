import { Link, NavLink } from 'react-router-dom'
import { UserRound } from 'lucide-react'
import { Chip } from '@/components/ui'
import { cn } from '@/lib/cn'
import { PUBLIC_NAV } from '../nav'

export function PublicHeader() {
  return (
    <header className="z-30 shrink-0 bg-bg px-4 pb-2 pt-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-success" aria-hidden />
          <span className="text-lg font-extrabold tracking-[-0.02em] text-ink">BUS UNILA</span>
          <Chip tone="muted">Pelacak Rute</Chip>
        </div>
        <Link
          to="/admin/login"
          aria-label="Masuk admin"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-[var(--shadow-soft)]"
        >
          <UserRound className="h-5 w-5" aria-hidden />
        </Link>
      </div>
      <nav className="mt-3 hidden gap-1 md:flex" aria-label="Navigasi utama">
        {PUBLIC_NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition',
                isActive ? 'bg-primary text-white' : 'text-muted hover:bg-primary-soft hover:text-ink',
              )
            }
          >
            <item.icon className="h-4 w-4" aria-hidden />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
