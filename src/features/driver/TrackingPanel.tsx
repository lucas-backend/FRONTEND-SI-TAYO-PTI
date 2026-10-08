import { useEffect, useRef, useState } from 'react'
import { OctagonX, UserRound, WifiOff } from 'lucide-react'
import { Button } from '@/components/ui'
import { useBuses, usePositions, useRoutes, useSignals, useStops } from '@/hooks/useSimulation'
import { useDriverStore } from '@/store/useDriverStore'
import { formatSpeed } from '@/lib/format'
import { DriverTopbar } from './DriverTopbar'
import { CapacitySelector } from './CapacitySelector'
import { ConfirmDialog } from './ConfirmDialog'
import { SignalBanner } from './SignalBanner'
import { routeSummary } from './driverRoute'

export function TrackingPanel() {
  const user = useDriverStore((state) => state.user)
  const busId = useDriverStore((state) => state.busId)
  const tracking = useDriverStore((state) => state.tracking)
  const recovering = useDriverStore((state) => state.recovering)
  const pendingSent = useDriverStore((state) => state.pendingSent)
  const setCapacity = useDriverStore((state) => state.setCapacity)
  const stopTracking = useDriverStore((state) => state.stopTracking)
  const simulateSignalLoss = useDriverStore((state) => state.simulateSignalLoss)
  const notifyRecovered = useDriverStore((state) => state.notifyRecovered)
  const clearRecovery = useDriverStore((state) => state.clearRecovery)
  const logout = useDriverStore((state) => state.logout)

  const buses = useBuses()
  const routes = useRoutes()
  const stops = useStops()
  const positions = usePositions()
  const signals = useSignals()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const recoveryShown = useRef(false)

  const bus = buses.find((item) => item.id === busId)
  const route = bus ? routes.find((item) => item.id === bus.routeId) : undefined
  const position = busId ? positions[busId] : undefined
  const signal = busId ? signals[busId] : undefined
  const offline = Boolean(signal && !signal.online)
  const destination = stops.find((stop) => stop.id === position?.nextStopId)

  useEffect(() => {
    if (!tracking) {
      clearRecovery()
      recoveryShown.current = false
    }
  }, [tracking, clearRecovery])

  useEffect(() => {
    if (!signal) return
    if (!signal.online) {
      recoveryShown.current = false
      return
    }
    if (signal.pending > 0 && !recoveryShown.current) {
      recoveryShown.current = true
      notifyRecovered(signal.pending)
    }
  }, [signal, notifyRecovered])

  return (
    <div className="relative flex h-full min-h-0 flex-col">
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
        <div className="flex items-center justify-between gap-3">
          <p className="text-xl font-extrabold tracking-[-0.02em] text-ink">{user?.name ?? '-'}</p>
          <button
            type="button"
            onClick={logout}
            className="text-sm font-semibold text-muted transition hover:text-danger"
          >
            Logout
          </button>
        </div>

        <div className="mt-4">
          <p className="flex items-center gap-2 text-lg font-extrabold uppercase tracking-[0.02em] text-success">
            <span className="h-2.5 w-2.5 rounded-full bg-success" aria-hidden />
            GPS Aktif
          </p>
          <p className="mt-1 text-xs font-medium text-muted">Transmisi Sinyal Setiap 3 Detik • Akurasi 2m</p>
        </div>

        {(offline || recovering) && (
          <div className="mt-4">
            <SignalBanner offline={offline} queued={signal?.queued ?? 0} recovering={recovering} pending={pendingSent} />
          </div>
        )}

        <div className="mt-5 rounded-[24px] bg-primary-soft p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted">Nomor Armada</p>
          <p className="mt-1 text-[40px] font-extrabold leading-none tracking-[-0.03em] text-ink">
            {bus?.plate ?? '-'}
          </p>
          <span className="mt-3 inline-flex rounded-full bg-surface px-3.5 py-1.5 text-[11px] font-semibold text-muted">
            {routeSummary(route)}
          </span>

          <div className="mt-5 flex items-center justify-between border-t border-white/60 pt-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted">Kecepatan</p>
              <p className="text-xl font-extrabold text-ink">{formatSpeed(position?.speedKmh ?? 0)}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted">Menuju</p>
              <p className="text-sm font-bold text-ink">{destination?.name ?? 'Rute'}</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-muted">Status Kursi Penumpang</p>
          <CapacitySelector value={bus?.capacityStatus ?? 'AVAILABLE'} onChange={(status) => void setCapacity(status)} />
        </div>

        <Button
          size="lg"
          variant="danger"
          fullWidth
          icon={<OctagonX className="h-5 w-5" aria-hidden />}
          onClick={() => setConfirmOpen(true)}
          className="mt-6 h-14 text-base uppercase tracking-[0.04em]"
        >
          Stop Tracking
        </Button>

        <Button
          variant="ghost"
          size="sm"
          fullWidth
          icon={<WifiOff className="h-4 w-4" aria-hidden />}
          onClick={() => void simulateSignalLoss()}
          className="mt-3 text-muted"
        >
          Simulasikan Sinyal Putus
        </Button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Hentikan pelacakan?"
        description="Bus akan berhenti ditampilkan di peta publik. Anda dapat memulai lagi kapan saja."
        confirmLabel="Ya, Hentikan"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false)
          void stopTracking()
        }}
      />
    </div>
  )
}
