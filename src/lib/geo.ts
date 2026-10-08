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

function catmullRom(p0: number, p1: number, p2: number, p3: number, t: number): number {
  const t2 = t * t
  const t3 = t2 * t
  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
}

/**
 * Spline Catmull-Rom tertutup untuk membentuk geometri rute halus (loop)
 * dari titik kontrol. Dipakai agar rute tidak terbentuk dari garis lurus kasar.
 */
export function closedSpline(points: readonly LatLng[], samplesPerSegment = 12): LatLng[] {
  const n = points.length
  if (n < 3) return points.map((p) => [p[0], p[1]] as LatLng)
  const out: LatLng[] = []
  for (let i = 0; i < n; i += 1) {
    const p0 = points[(i - 1 + n) % n]
    const p1 = points[i]
    const p2 = points[(i + 1) % n]
    const p3 = points[(i + 2) % n]
    for (let s = 0; s < samplesPerSegment; s += 1) {
      const t = s / samplesPerSegment
      out.push([
        catmullRom(p0[0], p1[0], p2[0], p3[0], t),
        catmullRom(p0[1], p1[1], p2[1], p3[1], t),
      ])
    }
  }
  out.push([out[0][0], out[0][1]])
  return out
}
