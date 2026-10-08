import { Activity } from 'lucide-react'
import type { Bus, BusPosition, Route } from '@/api/types'
import { Badge, Card, Chip } from '@/components/ui'
import { cn } from '@/lib/cn'
import { formatBusStatus, formatSpeed } from '@/lib/format'

interface BusCardProps {
  bus: Bus
  route: Route | undefined
  position: BusPosition | undefined
  onSelect?: (busId: string) => void
  selected?: boolean
}

export function BusCard({ bus, route, position, onSelect, selected = false }: BusCardProps) {
  const card = (
    <Card className={cn('p-4 text-left transition', selected && 'ring-2 ring-primary')}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted">{bus.label}</p>
          <p className="text-xl font-extrabold tracking-[-0.02em] text-ink">{bus.plate}</p>
          <p className="text-xs text-muted">{route?.name ?? '-'}</p>
        </div>
        <Badge status={bus.capacityStatus} />
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <Chip tone={position ? 'success' : 'muted'} dot>
          {formatBusStatus(bus.status)}
        </Chip>
        <span className="flex items-center gap-1.5 text-xs text-muted">
          <Activity className="h-3.5 w-3.5" aria-hidden />
          {position ? formatSpeed(position.speedKmh) : '—'}
        </span>
      </div>
    </Card>
  )

  if (!onSelect) return card
  return (
    <button
      type="button"
      onClick={() => onSelect(bus.id)}
      aria-label={`Lihat ${bus.label} ${bus.plate}`}
      className="w-full"
    >
      {card}
    </button>
  )
}
