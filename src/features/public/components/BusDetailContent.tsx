import { useMemo, useState } from 'react'
import { Armchair, ArrowLeft, ArrowRight } from 'lucide-react'
import type { Bus, BusPosition, Route, Stop } from '@/api/types'
import { Badge, Button } from '@/components/ui'
import { cn } from '@/lib/cn'
import { capacityTone, formatDistance, formatSpeed, remainingSeats } from '@/lib/format'
import { distanceAlongRoute } from '@/lib/geo'
import type { LatLng } from '@/lib/geo'
import { useCountdown } from '@/hooks/useCountdown'
import type { RouteProjection } from '../hooks/useRouteProjection'
import { classifyStops } from '../lib/stopStatus'
import { StopStatusList } from './StopStatusList'

type DetailView = 'detail' | 'route'

const toneBarClass = {
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
} as const

export interface BusDetailContentProps {
  bus: Bus
  route: Route
  position: BusPosition
  stopMap: Map<string, Stop>
  projection: RouteProjection | null
  targetStopId: string | null
  onSelectStop: (stopId: string) => void
}

export function BusDetailContent({
  bus,
  route,
  position,
  stopMap,
  projection,
  targetStopId,
  onSelectStop,
}: BusDetailContentProps) {
  const [view, setView] = useState<DetailView>('detail')

  const activeTargetId = targetStopId ?? position.nextStopId
  const etaBase = position.etaToStops[activeTargetId] ?? 0
  const countdown = useCountdown(etaBase, position.ts)
  const targetStop = stopMap.get(activeTargetId)
  const dwelling = position.speedKmh < 1 && position.nextStopId === activeTargetId

  const items = useMemo(
    () => classifyStops(route.stopIds, position.nextStopId, position.etaToStops),
    [route.stopIds, position.nextStopId, position.etaToStops],
  )

  const distanceMeters = useMemo(() => {
    if (!projection) return 0
    const busDistance = distanceAlongRoute(route.path as LatLng[], [position.lat, position.lng])
    const stopDistance = projection.distanceByStop.get(activeTargetId) ?? busDistance
    let remaining = (((stopDistance - busDistance) % projection.totalKm) + projection.totalKm) % projection.totalKm
    if (position.nextStopId === activeTargetId && remaining > projection.totalKm / 2) remaining = 0
    return remaining * 1000
  }, [projection, route.path, position.lat, position.lng, position.nextStopId, activeTargetId])

  const seats = remainingSeats(bus.seatsTaken, bus.capacity, bus.capacityStatus)
  const ratio = bus.capacity > 0 ? Math.min(1, bus.seatsTaken / bus.capacity) : 0
  const headline = dwelling ? 'Sedang berhenti' : countdown <= 0.75 ? 'Segera tiba' : `${Math.max(1, Math.round(countdown))} Menit`

  if (view === 'route') {
    return (
      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={() => setView('detail')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Kembali ke detail bus
        </button>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted">
            {bus.label} • {bus.plate}
          </p>
          <p className="text-xl font-extrabold tracking-[-0.02em] text-ink">Seluruh Rute Halte</p>
        </div>
        <ol className="ml-1.5 flex flex-col gap-4 border-l-2 border-line pl-5">
          {items.map((item) => {
            const stop = stopMap.get(item.stopId)
            if (!stop) return null
            return (
              <li key={item.stopId} className="relative">
                <span
                  className={cn(
                    'absolute -left-[26px] top-1 h-3.5 w-3.5 rounded-full border-2',
                    item.state === 'NEXT' ? 'border-primary bg-surface' : 'border-transparent bg-line',
                  )}
                  aria-hidden
                />
                <div className="flex items-center justify-between gap-3">
                  <span className={cn('text-sm text-ink', item.state === 'NEXT' && 'font-bold')}>{stop.name}</span>
                  <span
                    className={cn(
                      'text-[11px] font-bold uppercase tracking-[0.04em]',
                      item.state === 'NEXT' ? 'text-primary' : 'text-muted',
                    )}
                  >
                    {item.state === 'NEXT' ? 'Berikutnya' : item.state === 'PASSED' ? 'Lewat' : `${Math.round(item.minutes)} mnt`}
                  </span>
                </div>
              </li>
            )
          })}
        </ol>
        <Button fullWidth variant="soft" onClick={() => setView('detail')}>
          Tutup Daftar
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted">
            {bus.label} • {route.name}
          </p>
          <p className="mt-1 text-3xl font-extrabold tracking-[-0.03em] text-ink">{bus.plate}</p>
        </div>
        <Badge status={bus.capacityStatus} />
      </div>

      <div className="flex flex-col gap-2">
        <p className="flex items-center gap-2 text-sm text-muted">
          <Armchair className="h-4 w-4 text-primary" aria-hidden />
          Sisa {seats} Kursi dari {bus.capacity} Kapasitas
        </p>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
          <span
            className={cn('block h-full rounded-full transition-[width]', toneBarClass[capacityTone(bus.seatsTaken, bus.capacity)])}
            style={{ width: `${Math.round(ratio * 100)}%` }}
          />
        </div>
      </div>

      <div className="rounded-[20px] bg-primary-soft px-4 py-4 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted">
          Tiba di {targetStop?.name ?? '-'} dalam
        </p>
        <p
          className={cn(
            'mt-1 font-extrabold tracking-[-0.04em] text-ink',
            headline.length > 10 ? 'text-2xl' : 'text-5xl',
          )}
        >
          {headline}
        </p>
        <p className="mt-2 text-xs text-muted">
          Jarak {formatDistance(distanceMeters)} • Kecepatan {formatSpeed(position.speedKmh)}
        </p>
      </div>

      <div>
        <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.08em] text-muted">Daftar Halte</p>
        <StopStatusList items={items} stopMap={stopMap} targetStopId={activeTargetId} onSelectStop={onSelectStop} />
      </div>

      <Button fullWidth onClick={() => setView('route')}>
        Lihat Seluruh Rute Halte
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Button>
    </div>
  )
}
