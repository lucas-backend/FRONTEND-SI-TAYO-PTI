import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { PUBLIC_NAV } from '../nav'

export function BottomNav() {
  return (
    <nav
      aria-label="Navigasi bawah"
      className="z-30 shrink-0 border-t border-line bg-surface px-2 pb-[max(6px,env(safe-area-inset-bottom))] pt-2 md:hidden"
    >
      <ul className="flex items-center justify-around">
        {PUBLIC_NAV.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex w-16 flex-col items-center gap-1 rounded-xl py-1 text-[11px] font-semibold transition',
                  isActive ? 'text-primary' : 'text-muted',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn('h-5 w-5', isActive && 'scale-110')} aria-hidden />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
