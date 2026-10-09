import { useMemo, useState } from 'react'
import { Clock } from 'lucide-react'
import type { Bus, BusPosition, Route } from '@/api/types'
import { Badge, Card, Chip } from '@/components/ui'
import { useBuses, usePositions, useRouteMap, useSimHydrated, useStops } from '@/hooks/useSimulation'
import { useCountdown } from '@/hooks/useCountdown'
import { formatEta } from '@/lib/format'
import { formatOperationalHours, isWithinOperationalHours } from '@/lib/time'
import { cn } from '@/lib/cn'
import { EmptyBusesState, PanelSkeleton } from '../components/StateViews'
import { ReminderBell } from '../components/ReminderBell'

interface ScheduleRowData {
  bus: Bus
  route: Route
  position: BusPosition
  minutes: number
}

function ScheduleRow({ row, stopId }: { row: ScheduleRowData; stopId: string }) {
  const countdown = useCountdown(row.minutes, row.position.ts)
  return (
    <Card className="flex items-center gap-3 p-4">
      <div className="flex-1">
        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted">
          {row.bus.label} • {row.route.name}
        </p>
        <p className="text-lg font-extrabold tracking-[-0.02em] text-ink">{row.bus.plate}</p>
      </div>
      <div className="text-right">
        <p className="text-lg font-extrabold text-primary">{formatEta(countdown, 'NEXT')}</p>
        <p className="text-[11px] uppercase tracking-[0.06em] text-muted">Perkiraan tiba</p>
      </div>
      <Badge status={row.bus.capacityStatus} />
      <ReminderBell stopId={stopId} busId={row.bus.id} />
    </Card>
  )
}

export function SchedulePage() {
  const stops = useStops()
  const buses = useBuses()
  const positions = usePositions()
  const routeMap = useRouteMap()
  const hydrated = useSimHydrated()
  const [stopId, setStopId] = useState('rektorat')
  const activeStopId = stops.some((stop) => stop.id === stopId) ? stopId : (stops[0]?.id ?? stopId)

  const rows = useMemo<ScheduleRowData[]>(() => {
    return buses
      .map((bus) => {
        const route = routeMap.get(bus.routeId)
        const position = positions[bus.id]
        if (!route || !position || !route.stopIds.includes(activeStopId)) return null
        const minutes = position.etaToStops[activeStopId]
        if (minutes === undefined) return null
        return { bus, route, position, minutes }
      })
      .filter((row): row is ScheduleRowData => row !== null)
      .sort((a, b) => a.minutes - b.minutes)
  }, [buses, routeMap, positions, activeStopId])

  const operational = isWithinOperationalHours()

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-4">
        <Card className="flex items-center gap-3 p-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
            <Clock className="h-5 w-5" aria-hidden />
          </span>
          <div className="flex-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted">Jam Operasional</p>
            <p className="text-lg font-extrabold tracking-[-0.02em] text-ink">{formatOperationalHours()}</p>
          </div>
          <Chip tone={operational ? 'success' : 'warning'} dot>
            {operational ? 'Operasional' : 'Di Luar Jam'}
          </Chip>
        </Card>

        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.08em] text-muted">Pilih Halte</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {stops.map((stop) => (
              <button
                key={stop.id}
                type="button"
                onClick={() => setStopId(stop.id)}
                className={cn(
                  'shrink-0 rounded-full px-3.5 py-2 text-sm font-semibold transition',
                  stop.id === activeStopId ? 'bg-primary text-white' : 'bg-surface text-muted shadow-[var(--shadow-soft)] hover:text-ink',
                )}
              >
                {stop.name.replace('Halte ', '').replace(/\bMIPA\b/g, 'FMIPA')}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {!hydrated ? (
            <PanelSkeleton />
          ) : rows.length === 0 ? (
            <EmptyBusesState message="Belum ada bus menuju halte ini" />
          ) : (
            rows.map((row) => <ScheduleRow key={row.bus.id} row={row} stopId={activeStopId} />)
          )}
        </div>
      </div>
    </div>
  )
}
