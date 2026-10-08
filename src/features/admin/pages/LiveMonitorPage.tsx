import { useMemo, useRef, useState } from 'react'
import * as L from 'leaflet'
import { ChevronLeft, Radio, Route as RouteIcon } from 'lucide-react'
import { Badge, Chip, SegmentedControl } from '@/components/ui'
import { cn } from '@/lib/cn'
import { formatAgo } from '@/lib/time'
import { capacityTone, formatBusStatus, formatEta, formatSpeed, remainingSeats } from '@/lib/format'
import { useBuses, usePositions, useRoutes, useSignals, useStopMap } from '@/hooks/useSimulation'
import { AdminMap } from '../map/AdminMap'
import { EmptyState } from '../components/TableStates'

type RouteFilter = 'ALL' | 'J1' | 'J2'

const FILTER_OPTIONS = [
  { value: 'ALL' as const, label: 'Semua' },
  { value: 'J1' as const, label: 'Jalur 1' },
  { value: 'J2' as const, label: 'Jalur 2' },
]

const STATUS_TONE = { ACTIVE: 'success', STANDBY: 'default', OFFLINE: 'danger' } as const

export function LiveMonitorPage() {
  const buses = useBuses()
  const positions = usePositions()
  const routes = useRoutes()
  const signals = useSignals()
  const stopMap = useStopMap()
  const [filter, setFilter] = useState<RouteFilter>('ALL')
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null)
  const mapRef = useRef<L.Map | null>(null)

  const routeMap = useMemo(() => new Map(routes.map((route) => [route.id, route])), [routes])
  const activeRouteId = filter === 'ALL' ? null : filter

  const listed = useMemo(
    () => buses.filter((bus) => positions[bus.id] && (filter === 'ALL' || bus.routeId === filter)),
    [buses, positions, filter],
  )

  const selectedBus = selectedBusId ? buses.find((bus) => bus.id === selectedBusId) : undefined
  const selectedPosition = selectedBusId ? positions[selectedBusId] : undefined
  const selectedRoute = selectedBus ? routeMap.get(selectedBus.routeId) : undefined

  return (
    <div className="flex h-full min-h-0">
      <div className="relative min-w-0 flex-1">
        <AdminMap
          activeRouteId={activeRouteId}
          selectedBusId={selectedBusId}
          onSelectBus={(busId) => setSelectedBusId(busId)}
          mapRef={mapRef}
        />

        <div className="absolute left-3 top-3 z-20 w-[min(92vw,340px)] rounded-[20px] bg-surface p-3 shadow-[var(--shadow-card)]">
          <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-[0.08em] text-muted">Filter Jalur</p>
          <SegmentedControl<RouteFilter>
            ariaLabel="Filter jalur"
            value={filter}
            onChange={(value) => {
              setFilter(value)
              setSelectedBusId(null)
            }}
            options={FILTER_OPTIONS}
          />
          <p className="mt-2 px-1 text-xs text-muted">
            {listed.length} bus beroperasi • poligon putus-putus menandai area kampus.
          </p>
        </div>
      </div>

      <aside className="hidden w-[340px] shrink-0 flex-col border-l border-line bg-surface md:flex">
        {selectedBus && selectedPosition && selectedRoute ? (
          <div className="flex h-full flex-col">
            <div className="flex items-center gap-2 border-b border-line px-4 py-3">
              <button
                type="button"
                onClick={() => setSelectedBusId(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-primary-soft hover:text-ink"
                aria-label="Kembali ke daftar bus"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden />
              </button>
              <p className="text-sm font-bold text-ink">Detail Bus</p>
            </div>
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted">{selectedBus.label}</p>
                  <p className="text-2xl font-extrabold tracking-[-0.02em] text-ink">{selectedBus.plate}</p>
                </div>
                <Badge status={selectedBus.capacityStatus} />
              </div>

              <div className="flex flex-wrap gap-2">
                <Chip tone={STATUS_TONE[selectedBus.status]} dot>
                  {formatBusStatus(selectedBus.status)}
                </Chip>
                <Chip tone="default">{selectedRoute.name}</Chip>
                <Chip tone="default">{formatSpeed(selectedPosition.speedKmh)}</Chip>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-muted">
                  <span>Kapasitas</span>
                  <span>
                    {remainingSeats(selectedBus.seatsTaken, selectedBus.capacity, selectedBus.capacityStatus)} sisa dari{' '}
                    {selectedBus.capacity}
                  </span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-line">
                  <div
                    className={cn(
                      'h-full rounded-full',
                      capacityTone(selectedBus.seatsTaken, selectedBus.capacity) === 'danger'
                        ? 'bg-danger'
                        : capacityTone(selectedBus.seatsTaken, selectedBus.capacity) === 'warning'
                          ? 'bg-warning'
                          : 'bg-success',
                    )}
                    style={{ width: `${Math.min(100, (selectedBus.seatsTaken / selectedBus.capacity) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="rounded-[16px] bg-primary-soft p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted">Menuju Halte</p>
                <p className="mt-1 text-lg font-extrabold text-ink">
                  {stopMap.get(selectedPosition.nextStopId)?.name ?? '-'}
                </p>
                <p className="mt-1 text-sm text-muted">
                  ETA {formatEta(selectedPosition.etaToStops[selectedPosition.nextStopId] ?? 0, 'NEXT')}
                </p>
              </div>

              <p className="text-xs text-muted">
                Jejak 5 menit terakhir bus ini ditampilkan sebagai garis putus-putus tipis di peta.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col">
            <div className="border-b border-line px-4 py-3">
              <p className="flex items-center gap-2 text-sm font-bold text-ink">
                <Radio className="h-4 w-4 text-primary" aria-hidden />
                Bus Beroperasi
              </p>
              <p className="text-xs text-muted">Klik bus untuk detail dan jejak.</p>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-3">
              {listed.length === 0 ? (
                <EmptyState icon={<RouteIcon className="h-6 w-6" />} title="Tidak ada bus" description="Belum ada bus beroperasi pada filter ini." />
              ) : (
                <ul className="space-y-2">
                  {listed.map((bus) => {
                    const position = positions[bus.id]
                    const signal = signals[bus.id]
                    const online = !signal || signal.online
                    const route = routeMap.get(bus.routeId)
                    return (
                      <li key={bus.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedBusId(bus.id)}
                          className="w-full rounded-[18px] border border-line bg-bg p-3 text-left transition hover:border-primary hover:bg-primary-soft"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-ink">{bus.label}</p>
                              <p className="text-xs text-muted">{bus.plate}</p>
                            </div>
                            <Badge status={bus.capacityStatus} />
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <Chip tone={STATUS_TONE[bus.status]}>{formatBusStatus(bus.status)}</Chip>
                            {route && <Chip tone="default">{route.name}</Chip>}
                          </div>
                          <div className="mt-2 flex items-center justify-between text-xs text-muted">
                            <span>{position ? formatSpeed(position.speedKmh) : 'Diam'}</span>
                            <span className={cn(!online && 'font-semibold text-danger')}>
                              {online
                                ? `Sinyal ${formatAgo(position.ts)}`
                                : `Sinyal putus ${formatAgo(signal?.ts ?? position.ts)}`}
                            </span>
                          </div>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>
        )}
      </aside>
    </div>
  )
}
