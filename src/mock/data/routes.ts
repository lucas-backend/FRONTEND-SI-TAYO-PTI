import type { Route } from '@/api/types'
import { closedSpline } from '@/lib/geo'
import type { LatLng } from '@/lib/geo'

/**
 * Geometri rute dibentuk dari titik kontrol yang dilewatkan spline Catmull-Rom
 * tertutup (halus, bukan garis lurus). Titik kontrol disusun mengikuti kisi
 * jalan kampus dan melewati koordinat halte hasil verifikasi OSM.
 *
 * TODO: ganti titik kontrol dengan hasil tracing jalan penuh di OSM (per tahap rute).
 */

// Jalur Lingkar Luar: GSG -> Pertanian -> Rektorat -> MIPA -> FK -> Bundaran -> kembali.
const J1_CONTROL: LatLng[] = [
  [-5.3618, 105.2437], // Halte GSG
  [-5.3632, 105.243],
  [-5.3646, 105.2424],
  [-5.3654432, 105.242076], // Halte Pertanian
  [-5.3649, 105.2426],
  [-5.3643543, 105.2431643], // Halte Rektorat
  [-5.3652, 105.2438],
  [-5.3663, 105.2442],
  [-5.3670536, 105.2441874], // Halte MIPA
  [-5.3677, 105.2453],
  [-5.3681, 105.2464],
  [-5.3682684, 105.2475063], // Halte FK
  [-5.369, 105.2467],
  [-5.3698, 105.245],
  [-5.3704, 105.2435],
  [-5.3704, 105.2423], // Halte Bundaran
  [-5.3693, 105.241],
  [-5.3674, 105.2399],
  [-5.3652, 105.2394],
  [-5.363, 105.2401],
  [-5.3618, 105.2415],
  [-5.3609, 105.2428],
]

// Jalur Lingkar Dalam: Perpus -> Rektorat -> kembali.
const J2_CONTROL: LatLng[] = [
  [-5.3616738, 105.2404548], // Halte Perpus
  [-5.3623, 105.2414],
  [-5.363, 105.2423],
  [-5.3637, 105.2428],
  [-5.3643543, 105.2431643], // Halte Rektorat
  [-5.364, 105.2424],
  [-5.3633, 105.2414],
  [-5.3625, 105.2407],
]

export const ROUTES: Route[] = [
  {
    id: 'J1',
    code: 'J1',
    name: 'Jalur Lingkar Luar',
    color: '#1D4ED8',
    dashed: false,
    intervalMin: 8,
    path: closedSpline(J1_CONTROL, 6),
    stopIds: ['gsg', 'pertanian', 'rektorat', 'mipa', 'fk', 'bundaran'],
    active: true,
  },
  {
    id: 'J2',
    code: 'J2',
    name: 'Jalur Lingkar Dalam',
    color: '#0F9D8A',
    dashed: true,
    intervalMin: 10,
    path: closedSpline(J2_CONTROL, 12),
    stopIds: ['perpus', 'rektorat'],
    active: true,
  },
]

export function getRouteById(id: string): Route | undefined {
  return ROUTES.find((route) => route.id === id)
}
