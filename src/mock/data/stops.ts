import type { Stop } from '@/api/types'

/**
 * Halte Bus Unila.
 *
 * Koordinat di bawah adalah hasil memproyeksikan setiap halte ke garis rute
 * hasil tracing (`docs/data/jalur1.geojson` & `jalur2.geojson`) memakai
 * `turf.nearestPointOnLine`, sehingga marker halte tepat berada di atas rute.
 * Komentar menampilkan jarak koreksi terhadap koordinat asli (verifikasi OSM).
 *
 * PERINGATAN (jarak koreksi > 25 m):
 * - Halte FK     : 456 m  -> rute tidak melewati gedung FK; halte ditarik ke
 *                            titik terdekat di rute (dekat MIPA).
 * - Halte Perpus : 352 m  -> rute Jalur 2 hanya melingkup inti kampus.
 * - Halte Bundaran: 156 m, MIPA 103 m, Pertanian 87 m, GSG 62 m, Rektorat 44 m.
 * Rute hasil tracing belum menjangkau seluruh halte; perlu tracing ulang atau
 * penyesuaian titik halte. Lihat README bagian "Asumsi".
 */
export const STOPS: Stop[] = [
  {
    id: 'gsg',
    name: 'Halte GSG',
    lat: -5.3619105,
    lng: 105.2431474, // koreksi 62 m dari -5.3618, 105.2437
    routeIds: ['J1'],
  },
  {
    id: 'pertanian',
    name: 'Halte Pertanian',
    lat: -5.3649068,
    lng: 105.2426535, // koreksi 87 m dari -5.3654432, 105.242076
    routeIds: ['J1'],
  },
  {
    id: 'rektorat',
    name: 'Halte Rektorat',
    lat: -5.3640993,
    lng: 105.2428638, // koreksi 44 m dari -5.3643543, 105.2431643
    routeIds: ['J1', 'J2'],
  },
  {
    id: 'mipa',
    name: 'Halte MIPA',
    lat: -5.3661752,
    lng: 105.2438905, // koreksi 103 m dari -5.3670536, 105.2441874
    routeIds: ['J1'],
  },
  {
    id: 'fk',
    name: 'Halte FK',
    lat: -5.3660885,
    lng: 105.244013, // koreksi 456 m dari -5.3682684, 105.2475063
    routeIds: ['J1'],
  },
  {
    id: 'bundaran',
    name: 'Halte Bundaran',
    lat: -5.3693031,
    lng: 105.2414165, // koreksi 156 m dari -5.3704, 105.2423
    routeIds: ['J1'],
  },
  {
    id: 'perpus',
    name: 'Halte Perpus',
    lat: -5.3639802,
    lng: 105.2426372, // koreksi 352 m dari -5.3616738, 105.2404548
    routeIds: ['J2'],
  },
]

export function getStopById(id: string): Stop | undefined {
  return STOPS.find((stop) => stop.id === id)
}
