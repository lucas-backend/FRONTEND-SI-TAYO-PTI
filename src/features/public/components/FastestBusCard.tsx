import { Footprints, Timer, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui'
import { useCountdown } from '@/hooks/useCountdown'
import { formatEta, formatSpeed } from '@/lib/format'
import { cn } from '@/lib/cn'
import type { FastestBusInfo, NearestStopInfo } from '../hooks/usePersonalEta'
import { ReminderBell } from './ReminderBell'

interface FastestBusCardProps {
  nearest: NearestStopInfo
  fastest: FastestBusInfo
  className?: string
}

/** Kartu "Bus tercepat untuk Anda" (BRIEF 9.4). */
export function FastestBusCard({ nearest, fastest, className }: FastestBusCardProps) {
  const countdown = useCountdown(fastest.etaMin, fastest.position.ts)
  const arriveNow = fastest.suggestion === 'Berangkat sekarang'

  return (
    <div className={cn('rounded-[var(--radius-card)] bg-surface p-4 shadow-[var(--shadow-card)]', className)}>
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted">Bus tercepat untuk Anda</p>
      <div className="mt-2 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-ink">
            {fastest.bus.label} • {fastest.route.name}
          </p>
          <p className="text-xl font-extrabold tracking-[-0.02em] text-ink">{fastest.bus.plate}</p>
        </div>
        <Badge status={fastest.bus.capacityStatus} />
      </div>

      <div className="mt-3 flex items-center justify-between rounded-2xl bg-primary-soft px-4 py-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted">Tiba dalam</p>
          <p className="text-2xl font-extrabold tracking-[-0.03em] text-ink">
            {formatEta(countdown, 'NEXT')}
          </p>
        </div>
        <div className="text-right text-[11px] text-muted">
          <p className="flex items-center justify-end gap-1">
            <Timer className="h-3.5 w-3.5" aria-hidden />
            {formatSpeed(fastest.position.speedKmh)}
          </p>
          <p className="mt-1 flex items-center justify-end gap-1">
            <Footprints className="h-3.5 w-3.5" aria-hidden />
            {nearest.walkLabel}
          </p>
        </div>
      </div>

      <div
        className={cn(
          'mt-3 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold',
          arriveNow ? 'bg-success-soft text-success' : 'bg-warning-soft text-warning',
        )}
      >
        <TrendingUp className="h-4 w-4 shrink-0" aria-hidden />
        {fastest.suggestion}
        <span className="ml-auto text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
          ke {nearest.stop.name.replace(/^Halte\s+/, '')}
        </span>
      </div>

      <ReminderBell stopId={nearest.stop.id} busId={fastest.bus.id} variant="full" className="mt-3" />
    </div>
  )
}
