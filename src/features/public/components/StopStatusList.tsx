import type { Stop } from '@/api/types'
import { cn } from '@/lib/cn'
import { formatEta } from '@/lib/format'
import type { StopEta } from '../lib/stopStatus'

interface StopStatusListProps {
  items: StopEta[]
  stopMap: Map<string, Stop>
  targetStopId: string | null
  onSelectStop: (stopId: string) => void
}

function statusLabel(item: StopEta): string {
  if (item.state === 'NEXT') return 'Berikutnya'
  if (item.state === 'PASSED') return 'Lewat'
  return formatEta(item.minutes)
}

export function StopStatusList({ items, stopMap, targetStopId, onSelectStop }: StopStatusListProps) {
  return (
    <ul className="flex flex-col">
      {items.map((item) => {
        const stop = stopMap.get(item.stopId)
        if (!stop) return null
        const isTarget = item.stopId === targetStopId
        return (
          <li key={item.stopId}>
            <button
              type="button"
              onClick={() => onSelectStop(item.stopId)}
              aria-current={isTarget ? 'true' : undefined}
              className={cn(
                'flex w-full items-center gap-3 rounded-2xl px-2 py-2.5 text-left transition hover:bg-primary-soft',
                isTarget && 'bg-primary-soft',
              )}
            >
              <span
                className={cn(
                  'h-3.5 w-3.5 shrink-0 rounded-full border-2',
                  item.state === 'NEXT'
                    ? 'border-primary bg-surface'
                    : item.state === 'PASSED'
                      ? 'border-transparent bg-muted/60'
                      : 'border-transparent bg-line',
                )}
                aria-hidden
              />
              <span className={cn('flex-1 text-sm text-ink', item.state === 'NEXT' && 'font-bold')}>
                {stop.name}
              </span>
              <span
                className={cn(
                  'text-[11px] font-bold uppercase tracking-[0.04em]',
                  item.state === 'NEXT' ? 'text-primary' : 'text-muted',
                )}
              >
                {statusLabel(item)}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
