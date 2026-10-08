import { LogOut, Play, UserRound } from 'lucide-react'
import type { CapacityStatus } from '@/api/types'
import { Button } from '@/components/ui'
import { useBuses, useRoutes } from '@/hooks/useSimulation'
import { useDriverStore } from '@/store/useDriverStore'
import { DriverTopbar } from './DriverTopbar'
import { CapacitySelector } from './CapacitySelector'
import { routeDescription } from './driverRoute'

export function StandbyPanel() {
  const user = useDriverStore((state) => state.user)
  const busId = useDriverStore((state) => state.busId)
  const startTracking = useDriverStore((state) => state.startTracking)
  const setCapacity = useDriverStore((state) => state.setCapacity)
  const logout = useDriverStore((state) => state.logout)
  const buses = useBuses()
  const routes = useRoutes()

  const bus = buses.find((item) => item.id === busId)
  const route = bus ? routes.find((item) => item.id === bus.routeId) : undefined
  const capacity: CapacityStatus = bus?.capacityStatus ?? 'AVAILABLE'

  return (
    <div className="flex h-full min-h-0 flex-col">
      <DriverTopbar
        title="Panel Pengemudi"
        onBack={logout}
        trailing={
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
            <UserRound className="h-5 w-5" aria-hidden />
          </span>
        }
      />
      <div className="flex-1 overflow-y-auto px-5 pb-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted">Pengemudi Aktif</p>
        <div className="mt-1 flex items-center justify-between gap-3">
          <p className="text-xl font-extrabold tracking-[-0.02em] text-ink">{user?.name ?? '-'}</p>
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-1.5 text-sm font-semibold text-muted transition hover:text-danger"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            Logout
          </button>
        </div>

        <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary-soft px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-ink">
          <span className="h-2.5 w-2.5 rounded-full bg-muted" aria-hidden />
          Status: Standby
        </span>

        <div className="mt-5 rounded-[24px] bg-primary-soft p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted">Nomor Armada</p>
          <p className="mt-1 text-[40px] font-extrabold leading-none tracking-[-0.03em] text-ink">
            {bus?.plate ?? '-'}
          </p>
          <p className="mt-3 text-[15px] font-medium leading-snug text-muted">{routeDescription(route)}</p>

          <div className="mt-6">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-muted">
              Status Kursi Penumpang
            </p>
            <CapacitySelector value={capacity} onChange={(status) => void setCapacity(status)} />
          </div>
        </div>

        <Button
          size="lg"
          fullWidth
          icon={<Play className="h-5 w-5" aria-hidden />}
          onClick={() => void startTracking()}
          className="mt-6 h-14 text-base uppercase tracking-[0.04em]"
        >
          Start Tracking
        </Button>
        <p className="mt-3 text-center text-xs font-medium text-muted">
          Pastikan GPS aktif sebelum memulai perjalanan rute.
        </p>
      </div>
    </div>
  )
}
