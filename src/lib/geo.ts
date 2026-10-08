import { along, bearing, distance, length as turfLength, lineString, nearestPointOnLine, point } from '@turf/turf'
import type { Feature, LineString, Point } from 'geojson'

/**
 * Konvensi internal proyek: `[lat, lng]` agar langsung cocok dengan Leaflet
 * (`[number, number]`). Turf memakai urutan `[lng, lat]`, konversi ditangani di sini.
 */
export type LatLng = [number, number]

export interface StopProjection {
  stopId: string
  distanceKm: number
}

export function toLngLat([lat, lng]: LatLng): [number, number] {
  return [lng, lat]
}

export function toLatLng([lng, lat]: [number, number]): LatLng {
  return [lat, lng]
}

export function toTurfPoint([lat, lng]: LatLng): Feature<Point> {
  return point([lng, lat])
}

export function buildLine(path: readonly LatLng[]): Feature<LineString> {
  return lineString(path.map(toLngLat))
}

/** Bungkus jarak ke rentang [0, total) untuk rute loop. */
export function normalizeDistance(km: number, totalKm: number): number {
  if (!Number.isFinite(totalKm) || totalKm <= 0) return 0
  return ((km % totalKm) + totalKm) % totalKm
}

export function routeLengthKm(path: readonly LatLng[]): number {
  return turfLength(buildLine(path), { units: 'kilometers' })
}

export function distanceMeters(from: LatLng, to: LatLng): number {
  return distance(toTurfPoint(from), toTurfPoint(to), { units: 'meters' })
}

export function distanceKm(from: LatLng, to: LatLng): number {
  return distance(toTurfPoint(from), toTurfPoint(to), { units: 'kilometers' })
}

/** Titik pada polyline sejauh `km` dari awal (loop dimodulo). */
export function pointAtDistance(path: readonly LatLng[], km: number): LatLng {
  const line = buildLine(path)
  const total = turfLength(line, { units: 'kilometers' })
  const target = normalizeDistance(km, total)
  const result = along(line, target, { units: 'kilometers' })
  const [lng, lat] = result.geometry.coordinates
  return [lat, lng]
}

/** Arah hadap (derajat 0-360) pada titik sejauh `km`. */
export function bearingAtDistance(path: readonly LatLng[], km: number, lookAheadKm = 0.02): number {
  const from = pointAtDistance(path, km)
  const to = pointAtDistance(path, km + lookAheadKm)
  const deg = bearing(toTurfPoint(from), toTurfPoint(to))
  return (deg + 360) % 360
}

/** Proyeksikan satu titik ke jarak terdekatnya di sepanjang rute (km). */
export function distanceAlongRoute(path: readonly LatLng[], target: LatLng): number {
  const line = buildLine(path)
  const near = nearestPointOnLine(line, toTurfPoint(target), { units: 'kilometers' })
  return (near.properties as { location?: number })?.location ?? 0
}

/** Proyeksikan tiap halte ke jarak terdekatnya di sepanjang rute (km). */
export function projectStopsOnRoute(path: readonly LatLng[], stops: readonly { id: string; point: LatLng }[]): StopProjection[] {
  const line = buildLine(path)
  return stops
    .map((stop) => {
      const near = nearestPointOnLine(line, toTurfPoint(stop.point), { units: 'kilometers' })
      const location = (near.properties as { location?: number })?.location ?? 0
      return { stopId: stop.id, distanceKm: location }
    })
    .sort((a, b) => a.distanceKm - b.distanceKm)
}
