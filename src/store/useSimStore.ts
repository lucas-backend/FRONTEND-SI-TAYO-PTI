import { create } from 'zustand'
import type { Bus, BusPosition, Route, Stop } from '@/api/types'
import { api } from '@/api/client'
import { gateway } from '@/realtime'
import type { Unsubscribe } from '@/realtime'
import { MAP_CONFIG } from '@/config'

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
  load: () => Promise<void>
  bind: () => void
  resetDemo: () => Promise<void>
}

let bound = false

function withinCampus(lat: number, lng: number): boolean {
  const [[minLat, minLng], [maxLat, maxLng]] = MAP_CONFIG.maxBounds
  return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng
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
        }))
      }),
      gateway.subscribe('bus:capacity', (event) => {
        set((state) => ({
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
        }))
      }),
      gateway.subscribe('bus:started', (event) => {
        set((state) => ({
          buses: state.buses.map((bus) => (bus.id === event.busId ? { ...bus, status: 'ACTIVE' } : bus)),
        }))
      }),
      gateway.subscribe('bus:stopped', (event) => {
        set((state) => {
          const nextPositions = { ...state.positions }
          delete nextPositions[event.busId]
          return {
            positions: nextPositions,
            buses: state.buses.map((bus) => (bus.id === event.busId ? { ...bus, status: 'STANDBY' } : bus)),
          }
        })
      }),
      gateway.subscribe('gateway:status', (event) => {
        set({ connected: event.connected })
      }),
    ]
    void unsubscribers
  },

  async resetDemo() {
    await api.resetDemo()
    set({ positions: {} })
    await get().load()
  },
}))
