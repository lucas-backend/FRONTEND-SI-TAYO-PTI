import { useMemo } from 'react'
import type { Route, Stop } from '@/api/types'
import { projectStopsOnRoute, routeLengthKm } from '@/lib/geo'
import type { LatLng } from '@/lib/geo'

export interface RouteProjection {
  /** stopId -> jarak (km) dari awal rute. */
  distanceByStop: Map<string, number>
  totalKm: number
}

/** Proyeksikan halte rute ke geometri jalan, agar jarak/ETA konsisten dengan mesin. */
export function useRouteProjection(route: Route | undefined, stops: Stop[]): RouteProjection | null {
  return useMemo(() => {
    if (!route) return null
    const routeStops = route.stopIds
      .map((id) => stops.find((stop) => stop.id === id))
      .filter((stop): stop is Stop => Boolean(stop))
    const projections = projectStopsOnRoute(
      route.path as LatLng[],
      routeStops.map((stop) => ({ id: stop.id, point: [stop.lat, stop.lng] as LatLng })),
    )
    const distanceByStop = new Map(projections.map((item) => [item.stopId, item.distanceKm]))
    return { distanceByStop, totalKm: routeLengthKm(route.path as LatLng[]) }
  }, [route, stops])
}
