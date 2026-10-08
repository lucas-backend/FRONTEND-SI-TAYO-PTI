import { useCallback, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, LogOut, Menu, Moon, Search, Sun, UserRound } from 'lucide-react'
import { cn } from '@/lib/cn'
import { formatAgo } from '@/lib/time'
import { useActivities } from '@/hooks/useSimulation'
import { useBuses } from '@/hooks/useSimulation'
import { useAdminStore } from '@/store/useAdminStore'
import { useTheme } from '../hooks/useTheme'
import { ACTIVITY_TONE, activityText } from '../lib/activity'

const TONE_DOT: Record<string, string> = {
  primary: 'bg-primary',
  danger: 'bg-danger',
  warning: 'bg-warning',
  muted: 'bg-muted',
}

export function AdminTopbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const navigate = useNavigate()
  const user = useAdminStore((state) => state.user)
  const logout = useAdminStore((state) => state.logout)
  const { theme, toggle } = useTheme()
  const activities = useActivities()
  const buses = useBuses()
  const [open, setOpen] = useState<'notif' | 'user' | null>(null)
  const [query, setQuery] = useState('')

  const busLabel = useCallback((busId: string) => buses.find((bus) => bus.id === busId)?.label, [buses])

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    const term = query.trim()
    navigate(term ? `/admin/armada?q=${encodeURIComponent(term)}` : '/admin/armada')
    setQuery('')
  }

  const initials = (user?.name ?? 'A')
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')

  return (
    <header className="z-30 flex shrink-0 items-center gap-2 border-b border-line bg-surface px-3 py-3 md:px-5">
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Buka menu"
        className="flex h-10 w-10 items-center justify-center rounded-full text-muted hover:bg-primary-soft hover:text-ink lg:hidden"
      >
        <Menu className="h-5 w-5" aria-hidden />
      </button>

      <form onSubmit={onSubmit} className="relative flex-1 max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Cari armada atau supir..."
          aria-label="Cari"
          className="h-11 w-full rounded-[14px] bg-primary-soft pl-10 pr-4 text-sm font-medium text-ink placeholder:text-muted/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      </form>

      <div className="ml-auto flex items-center gap-1.5">
        <div className="relative">
          <button
            type="button"
            aria-label="Notifikasi"
            aria-expanded={open === 'notif'}
            onClick={() => setOpen((current) => (current === 'notif' ? null : 'notif'))}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-muted hover:bg-primary-soft hover:text-ink"
          >
            <Bell className="h-5 w-5" aria-hidden />
            {activities.length > 0 && (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger" aria-hidden />
            )}
          </button>
          {open === 'notif' && (
            <>
              <button
                type="button"
                aria-label="Tutup notifikasi"
                className="fixed inset-0 z-40 cursor-default"
                onClick={() => setOpen(null)}
              />
              <div className="absolute right-0 z-50 mt-2 w-80 max-w-[85vw] rounded-[20px] border border-line bg-surface p-3 shadow-[var(--shadow-lg)]">
                <p className="px-2 pb-2 text-[11px] font-bold uppercase tracking-[0.08em] text-muted">Aktivitas Terbaru</p>
                {activities.length === 0 ? (
                  <p className="px-2 py-3 text-sm text-muted">Belum ada aktivitas.</p>
                ) : (
                  <ul className="max-h-72 space-y-1 overflow-y-auto">
                    {activities.slice(0, 8).map((item) => (
                      <li key={item.id} className="flex items-start gap-2.5 rounded-[14px] px-2 py-2 hover:bg-primary-soft">
                        <span className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', TONE_DOT[ACTIVITY_TONE[item.kind]])} aria-hidden />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-ink">{activityText(item, busLabel)}</p>
                          <p className="text-xs text-muted">{formatAgo(item.ts)}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={toggle}
          aria-label={theme === 'dark' ? 'Aktifkan tema terang' : 'Aktifkan tema gelap'}
          className="flex h-10 w-10 items-center justify-center rounded-full text-muted hover:bg-primary-soft hover:text-ink"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" aria-hidden /> : <Moon className="h-5 w-5" aria-hidden />}
        </button>

        <div className="relative">
          <button
            type="button"
            aria-label="Menu akun"
            aria-expanded={open === 'user'}
            onClick={() => setOpen((current) => (current === 'user' ? null : 'user'))}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white"
          >
            {initials || <UserRound className="h-5 w-5" aria-hidden />}
          </button>
          {open === 'user' && (
            <>
              <button
                type="button"
                aria-label="Tutup menu akun"
                className="fixed inset-0 z-40 cursor-default"
                onClick={() => setOpen(null)}
              />
              <div className="absolute right-0 z-50 mt-2 w-56 rounded-[20px] border border-line bg-surface p-2 shadow-[var(--shadow-lg)]">
                <div className="px-3 py-2">
                  <p className="truncate text-sm font-bold text-ink">{user?.name}</p>
                  <p className="truncate text-xs text-muted">{user?.username}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(null)
                    navigate('/admin/akun')
                  }}
                  className="flex w-full items-center gap-2 rounded-[12px] px-3 py-2 text-sm font-semibold text-muted hover:bg-primary-soft hover:text-ink"
                >
                  <UserRound className="h-4 w-4" aria-hidden />
                  Kelola Akun
                </button>
                <button
                  type="button"
                  onClick={() => {
                    logout()
                    navigate('/admin/login')
                  }}
                  className="flex w-full items-center gap-2 rounded-[12px] px-3 py-2 text-sm font-semibold text-danger hover:bg-danger-soft"
                >
                  <LogOut className="h-4 w-4" aria-hidden />
                  Keluar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
