import { NavLink } from 'react-router-dom'
import { Bus, RotateCcw, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useSimStore } from '@/store/useSimStore'
import { useToast } from '@/components/ui'
import { ADMIN_NAV } from '../nav'

interface AdminSidebarProps {
  onNavigate?: () => void
  onClose?: () => void
}

export function AdminSidebar({ onNavigate, onClose }: AdminSidebarProps) {
  const resetDemo = useSimStore((state) => state.resetDemo)
  const { show } = useToast()

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center justify-between gap-2 px-5 py-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white">
            <Bus className="h-5 w-5" aria-hidden />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-extrabold tracking-[-0.02em] text-ink">BUS UNILA</p>
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted">Panel Admin</p>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup menu"
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-primary-soft hover:text-ink lg:hidden"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3" aria-label="Navigasi admin">
        {ADMIN_NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-[14px] px-3.5 py-3 text-sm font-semibold transition',
                isActive ? 'bg-primary text-white shadow-[var(--shadow-soft)]' : 'text-muted hover:bg-primary-soft hover:text-ink',
              )
            }
          >
            <item.icon className="h-5 w-5" aria-hidden />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-line p-3">
        <button
          type="button"
          onClick={() => {
            void resetDemo().then(() => show('Data demo direset ke kondisi awal', { tone: 'success' }))
          }}
          className="flex w-full items-center gap-3 rounded-[14px] px-3.5 py-3 text-sm font-semibold text-muted transition hover:bg-danger-soft hover:text-danger"
        >
          <RotateCcw className="h-5 w-5" aria-hidden />
          Reset Data Demo
        </button>
      </div>
    </div>
  )
}
