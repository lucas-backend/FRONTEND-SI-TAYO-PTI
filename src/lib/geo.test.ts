import { describe, expect, it } from 'vitest'
import { distanceAlongRoute, distanceMeters, projectStopsOnRoute, routeLengthKm, snapPointToPath } from './geo'
import { routeSchema } from '@/features/admin/routeValidation'

describe('geometri rute', () => {
  const path: [number, number][] = [[-5.36, 105.24], [-5.36, 105.25]]

  it('menghitung panjang rute dan menutup loop', () => {
    expect(routeLengthKm([...path, path[0]])).toBeGreaterThan(1)
    expect(distanceAlongRoute(path, path[0])).toBe(0)
  })

  it('snap halte ke garis rute', () => {
    const snapped = snapPointToPath(path, [-5.361, 105.245])
    expect(snapped.correctionM).toBeGreaterThan(0)
    expect(distanceMeters(snapped.point, snapPointToPath(path, snapped.point).point)).toBeLessThan(0.01)
  })

  it('mengurutkan halte mengikuti arah rute', () => {
    const stops = [
      { id: 'b', point: [-5.36, 105.249] as [number, number] },
      { id: 'a', point: [-5.36, 105.241] as [number, number] },
    ]
    expect(projectStopsOnRoute(path, stops).map((stop) => stop.stopId)).toEqual(['a', 'b'])
  })

  it('memproyeksikan posisi bus ke rute baru dengan jarak dekat garis', () => {
    const projected = snapPointToPath(path, [-5.36001, 105.245]).point
    expect(distanceMeters(projected, [-5.36, 105.245])).toBeLessThan(2)
  })

  it('menolak konfigurasi rute yang tidak valid', () => {
    expect(routeSchema.safeParse({ name: '', intervalMin: 0, path: [], stopIds: [] }).success).toBe(false)
  })
})
