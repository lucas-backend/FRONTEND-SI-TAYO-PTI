import type { ActivityItem, ActivityKind } from '@/store/useSimStore'

export const ACTIVITY_LABEL: Record<ActivityKind, string> = {
  STARTED: 'Mulai tracking',
  FULL: 'Kapasitas penuh',
  SIGNAL_LOST: 'Sinyal putus',
  STOPPED: 'Berhenti',
}

export type ActivityTone = 'primary' | 'danger' | 'warning' | 'muted'

export const ACTIVITY_TONE: Record<ActivityKind, ActivityTone> = {
  STARTED: 'primary',
  FULL: 'warning',
  SIGNAL_LOST: 'danger',
  STOPPED: 'muted',
}

/** Teks aktivitas memakai label bus (fallback ke id bila tidak ditemukan). */
export function activityText(item: ActivityItem, busLabel: (busId: string) => string | undefined): string {
  const label = busLabel(item.busId) ?? item.busId
  switch (item.kind) {
    case 'STARTED':
      return `${label} mulai tracking`
    case 'FULL':
      return `${label} kapasitas penuh`
    case 'SIGNAL_LOST':
      return `${label} sinyal putus`
    case 'STOPPED':
      return `${label} berhenti`
  }
}
