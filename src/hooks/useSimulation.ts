import { useMemo } from 'react'
import { useSimStore } from '@/store/useSimStore'
import type { Bus, Route, Stop } from '@/api/types'

/** Hook baca state simulasi. Komponen UI hanya lewat sini, bukan impor mock. */
export function useRoutes(): Route[] {
  return useSimStore((state) => state.routes)
}

export function useStops(): Stop[] {
  return useSimStore((state) => state.stops)
}

export function useBuses(): Bus[] {
  return useSimStore((state) => state.buses)
}

export function usePositions() {
  return useSimStore((state) => state.positions)
}

export function useConnection(): boolean {
  return useSimStore((state) => state.connected)
}

export function useLastUpdated(): number {
  return useSimStore((state) => state.lastUpdatedTs)
}

export function useSimLoading(): boolean {
  return useSimStore((state) => state.loading)
}

export function useSimHydrated(): boolean {
  return useSimStore((state) => state.hydrated)
}

export function useSimError(): string | null {
  return useSimStore((state) => state.error)
}

export function useLoadSim(): () => Promise<void> {
  return useSimStore((state) => state.load)
}

export function useStopMap(): Map<string, Stop> {
  const stops = useStops()
  return useMemo(() => new Map(stops.map((stop) => [stop.id, stop])), [stops])
}

export function useRouteMap(): Map<string, Route> {
  const routes = useRoutes()
  return useMemo(() => new Map(routes.map((route) => [route.id, route])), [routes])
}
