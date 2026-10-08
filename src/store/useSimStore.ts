import { create } from 'zustand'
import type { Bus, BusPosition, Route, Stop } from '@/api/types'
import { api } from '@/api/client'
import { gateway } from '@/realtime'
import type { BusSignalEvent, Unsubscribe } from '@/realtime'
import { MAP_CONFIG } from '@/config'

export type ActivityKind = 'STARTED' | 'FULL' | 'SIGNAL_LOST' | 'STOPPED'

/** Aktivitas nyata dari event simulasi (BRIEF 11.1). */
export interface ActivityItem {
  id: string
  kind: ActivityKind
  busId: string
  ts: number
}

export interface TrailPoint {
  lat: number
  lng: number
  ts: number
}

const ACTIVITY_LIMIT = 40
const LATENCY_LIMIT = 30
const TRAIL_WINDOW_MS = 5 * 60 * 1000
const TRAIL_LIMIT = 200

interface SimState {
  hydrated: boolean
  loading: boolean
  error: string | null
  connected: boolean
  lastUpdatedTs: number
  routes: Route[]
  stops: Stop[]
  buses: Bus[]
  positions: Record<string, BusPosition>
  signals: Record<string, BusSignalEvent>
  activities: ActivityItem[]
  latencies: number[]
  trails: Record<string, TrailPoint[]>
  load: () => Promise<void>
  bind: () => void
  resetDemo: () => Promise<void>
}

let bound = false
let activitySeq = 0

function nextActivityId(kind: ActivityKind, busId: string): string {
  activitySeq += 1
  return `act-${kind}-${busId}-${Date.now().toString(36)}-${activitySeq}`
}

function withinCampus(lat: number, lng: number): boolean {
  const [[minLat, minLng], [maxLat, maxLng]] = MAP_CONFIG.maxBounds
  return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng
}

function pushActivity(
  list: ActivityItem[],
  kind: ActivityKind,
  busId: string,
  ts: number,
): ActivityItem[] {
  const item: ActivityItem = { id: nextActivityId(kind, busId), kind, busId, ts }
  return [item, ...list].slice(0, ACTIVITY_LIMIT)
}

function appendTrail(list: TrailPoint[] | undefined, position: BusPosition): TrailPoint[] {
  const cutoff = Date.now() - TRAIL_WINDOW_MS
  const next = [...(list ?? []), { lat: position.lat, lng: position.lng, ts: position.ts }].filter(
    (point) => point.ts >= cutoff,
  )
  return next.length > TRAIL_LIMIT ? next.slice(next.length - TRAIL_LIMIT) : next
}

export const useSimStore = create<SimState>((set, get) => ({
  hydrated: false,
  loading: false,
  error: null,
  connected: true,
  lastUpdatedTs: 0,
  routes: [],
  stops: [],
  buses: [],
  positions: {},
  signals: {},
  activities: [],
  latencies: [],
  trails: {},

  async load() {
    set({ loading: true, error: null })
    try {
      const [routes, stops, buses] = await Promise.all([api.getRoutes(), api.getStops(), api.getBuses()])
      set({ routes, stops, buses, hydrated: true, loading: false })
    } catch (error) {
      set({ loading: false, error: error instanceof Error ? error.message : 'Gagal memuat data' })
    }
  },

  bind() {
    if (bound) return
    bound = true
    const unsubscribers: Unsubscribe[] = [
      gateway.subscribe('bus:position', (position) => {
        if (!withinCampus(position.lat, position.lng)) return
        set((state) => ({
          positions: { ...state.positions, [position.busId]: position },
          lastUpdatedTs: position.ts,
          trails: { ...state.trails, [position.busId]: appendTrail(state.trails[position.busId], position) },
          latencies: [...state.latencies, Math.max(0, Date.now() - position.ts)].slice(-LATENCY_LIMIT),
        }))
      }),
      gateway.subscribe('bus:capacity', (event) => {
        set((state) => {
          const previous = state.buses.find((bus) => bus.id === event.busId)
          const becameFull = event.capacityStatus === 'FULL' && previous?.capacityStatus !== 'FULL'
          return {
            buses: state.buses.map((bus) =>
              bus.id === event.busId
                ? {
                    ...bus,
                    capacityStatus: event.capacityStatus,
                    seatsTaken: event.seatsTaken,
                    capacity: event.capacity,
                    status: event.status,
                  }
                : bus,
            ),
            activities: becameFull
              ? pushActivity(state.activities, 'FULL', event.busId, Date.now())
              : state.activities,
          }
        })
      }),
      gateway.subscribe('bus:started', (event) => {
        set((state) => ({
          buses: state.buses.map((bus) => (bus.id === event.busId ? { ...bus, status: 'ACTIVE' } : bus)),
          activities: pushActivity(state.activities, 'STARTED', event.busId, event.ts),
        }))
      }),
      gateway.subscribe('bus:stopped', (event) => {
        set((state) => {
          const nextPositions = { ...state.positions }
          delete nextPositions[event.busId]
          const nextSignals = { ...state.signals }
          delete nextSignals[event.busId]
          const nextTrails = { ...state.trails }
          delete nextTrails[event.busId]
          return {
            positions: nextPositions,
            signals: nextSignals,
            trails: nextTrails,
            buses: state.buses.map((bus) => (bus.id === event.busId ? { ...bus, status: 'STANDBY' } : bus)),
            activities: pushActivity(state.activities, 'STOPPED', event.busId, event.ts),
          }
        })
      }),
      gateway.subscribe('bus:signal', (event) => {
        set((state) => {
          const wasOnline = state.signals[event.busId]?.online !== false
          return {
            signals: { ...state.signals, [event.busId]: event },
            activities:
              !event.online && wasOnline
                ? pushActivity(state.activities, 'SIGNAL_LOST', event.busId, event.ts)
                : state.activities,
          }
        })
      }),
      gateway.subscribe('fleet:changed', (event) => {
        set({ buses: event.buses })
      }),
      gateway.subscribe('gateway:status', (event) => {
        set({ connected: event.connected })
      }),
    ]
    void unsubscribers
  },

  async resetDemo() {
    await api.resetDemo()
    set({ positions: {}, signals: {}, activities: [], latencies: [], trails: {} })
    await get().load()
  },
}))
