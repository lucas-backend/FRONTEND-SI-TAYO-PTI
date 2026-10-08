import type { ActivityItem } from '@/store/useSimStore'
import { formatAgo } from '@/lib/time'
import { cn } from '@/lib/cn'
import { Skeleton } from '@/components/ui'
import { ACTIVITY_LABEL, ACTIVITY_TONE, activityText } from '../lib/activity'

const TONE: Record<string, string> = {
  primary: 'bg-primary',
  danger: 'bg-danger',
  warning: 'bg-warning',
  muted: 'bg-muted',
}

interface ActivityFeedProps {
  activities: ActivityItem[]
  busLabel: (busId: string) => string | undefined
  loading?: boolean
}

export function ActivityFeed({ activities, busLabel, loading = false }: ActivityFeedProps) {
  return (
    <div className="rounded-[var(--radius-card)] bg-surface p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-extrabold tracking-[-0.01em] text-ink">Aktivitas Terbaru</h2>
        <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted">Live</span>
      </div>
      {loading ? (
        <div className="mt-4 space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-full" />
          ))}
        </div>
      ) : activities.length === 0 ? (
        <p className="mt-4 text-sm text-muted">Belum ada aktivitas. Aktivitas muncul dari event simulasi bus.</p>
      ) : (
        <ul className="mt-3 space-y-1">
          {activities.map((item) => (
            <li key={item.id} className="flex items-start gap-3 rounded-[14px] px-1 py-2">
              <span className={cn('mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full', TONE[ACTIVITY_TONE[item.kind]])} aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{activityText(item, busLabel)}</p>
                <p className="text-xs text-muted">
                  {ACTIVITY_LABEL[item.kind]} • {formatAgo(item.ts)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
