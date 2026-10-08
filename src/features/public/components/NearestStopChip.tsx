import { MapPin } from 'lucide-react'
import { formatDistance } from '@/lib/format'
import type { NearestStopInfo } from '../hooks/usePersonalEta'

interface NearestStopChipProps {
  nearest: NearestStopInfo
}

/** Chip melayang halte terdekat (BRIEF 9.4). */
export function NearestStopChip({ nearest }: NearestStopChipProps) {
  const shortName = nearest.stop.name.replace(/^Halte\s+/, '')
  return (
    <div className="pointer-events-none flex justify-center px-3">
      <div className="pointer-events-auto flex max-w-full items-center gap-2 rounded-full bg-surface px-4 py-2.5 text-xs font-semibold text-ink shadow-[var(--shadow-card)]">
        <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden />
        <span className="truncate">
          Halte terdekat: <strong className="font-extrabold">{shortName}</strong> •{' '}
          {formatDistance(nearest.distanceKm * 1000)} ({nearest.walkLabel})
        </span>
      </div>
    </div>
  )
}
