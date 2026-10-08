import { Route as RouteIcon } from 'lucide-react'
import { Card, SegmentedControl, Skeleton } from '@/components/ui'
import type { RouteCode } from '@/api/types'
import type { Route } from '@/api/types'

interface RouteControlsProps {
  route: Route | undefined
  activeRouteId: RouteCode
  onRouteChange: (id: RouteCode) => void
  activeBusCount: number
  loading: boolean
}

export function RouteControls({ route, activeRouteId, onRouteChange, activeBusCount, loading }: RouteControlsProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-surface px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-ink shadow-[var(--shadow-soft)]">
          <span className="h-2 w-2 rounded-full bg-success" aria-hidden />
          {activeBusCount} Bus Beroperasi
        </span>
        <SegmentedControl<RouteCode>
          ariaLabel="Pilih jalur"
          value={activeRouteId}
          onChange={onRouteChange}
          className="max-w-full"
          options={[
            { value: 'J1', label: 'Jalur 1' },
            { value: 'J2', label: 'Jalur 2' },
          ]}
        />
      </div>
      {loading || !route ? (
        <Skeleton className="h-16 w-full" />
      ) : (
        <Card className="flex items-center gap-3 p-3.5">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white"
            style={{ background: route.color }}
          >
            <RouteIcon className="h-[18px] w-[18px]" aria-hidden />
          </span>
          <p className="flex-1 text-sm font-bold text-ink">
            {route.name} <span className="font-medium text-muted">({route.active ? 'Aktif' : 'Nonaktif'})</span>
          </p>
          <span className="text-right text-[11px] font-bold uppercase tracking-[0.06em] text-muted">
            Interval {route.intervalMin} Mnt
          </span>
        </Card>
      )}
    </div>
  )
}
