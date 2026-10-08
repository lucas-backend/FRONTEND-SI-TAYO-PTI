import { useMemo } from 'react'
import type { Bus, BusPosition, Route, Stop } from '@/api/types'
import { useBuses, usePositions, useRoutes, useStops } from '@/hooks/useSimulation'
import { nearestStop } from '@/lib/geo'
import type { LatLng } from '@/lib/geo'
import { formatWalkTime, walkMinutes } from '@/lib/format'

export interface NearestStopInfo {
  stop: Stop
  distanceKm: number
  walkMin: number
  walkLabel: string
}

export interface FastestBusInfo {
  bus: Bus
  route: Route
  position: BusPosition
  etaMin: number
  walkMin: number
  waitingMin: number
  suggestion: string
}

export interface PersonalEta {
  nearest: NearestStopInfo | null
  fastest: FastestBusInfo | null
}

/** Hitung halte terdekat pengguna + bus tercepat menuju halte itu (BRIEF 9.4). */
export function usePersonalEta(location: LatLng | null): PersonalEta {
  const stops = useStops()
  const buses = useBuses()
  const routes = useRoutes()
  const positions = usePositions()

  const routeMap = useMemo(() => new Map(routes.map((route) => [route.id, route])), [routes])

  const nearest = useMemo<NearestStopInfo | null>(() => {
    if (!location || stops.length === 0) return null
    const result = nearestStop(location, stops)
    if (!result) return null
    const stop = stops.find((item) => item.id === result.stopId)
    if (!stop) return null
    const minutes = walkMinutes(result.distanceKm)
    return { stop, distanceKm: result.distanceKm, walkMin: minutes, walkLabel: formatWalkTime(result.distanceKm) }
  }, [location, stops])

  const fastest = useMemo<FastestBusInfo | null>(() => {
    if (!nearest) return null
    let best: FastestBusInfo | null = null
    for (const bus of buses) {
      const route = routeMap.get(bus.routeId)
      const position = positions[bus.id]
      if (!route || !position) continue
      if (!route.stopIds.includes(nearest.stop.id)) continue
      const etaMin = position.etaToStops[nearest.stop.id]
      if (etaMin === undefined) continue
      if (!best || etaMin < best.etaMin) {
        best = { bus, route, position, etaMin, walkMin: nearest.walkMin, waitingMin: 0, suggestion: '' }
      }
    }
    if (!best) return null
    const margin = best.etaMin - nearest.walkMin
    const waitingMin = Math.max(0, margin)
    const suggestion =
      margin <= 0.5
        ? 'Berangkat sekarang'
        : `Tunggu ${Math.max(1, Math.round(margin))} menit`
    return { ...best, waitingMin, suggestion }
  }, [nearest, buses, routeMap, positions])

  return { nearest, fastest }
}
