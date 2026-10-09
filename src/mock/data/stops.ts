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
 * - Halte FMIPA  : 103 m, Pertanian 87 m, GSG 62 m, Rektorat 44 m.
 * Rute hasil tracing belum menjangkau seluruh halte; perlu tracing ulang atau
 * penyesuaian titik halte. Lihat README bagian "Asumsi".
 */
export const STOPS: Stop[] = [
  {
    id: 'gsg',
    name: 'Titik Jemput FEB',
    lat: -5.3619105,
    lng: 105.2431474, // koreksi 62 m dari -5.3618, 105.2437
    routeIds: ['J1'],
  },
  {
    id: 'pertanian',
    name: 'Titik Jemput Pertanian',
    lat: -5.3649068,
    lng: 105.2426535, // koreksi 87 m dari -5.3654432, 105.242076
    routeIds: ['J1'],
  },
  {
    id: 'rektorat',
    name: 'Titik Jemput Rektorat',
    lat: -5.3640993,
    lng: 105.2428638, // koreksi 44 m dari -5.3643543, 105.2431643
    routeIds: ['J1', 'J2'],
  },
  {
    id: 'mipa',
    name: 'Titik Jemput FMIPA',
    lat: -5.3661752,
    lng: 105.2438905, // koreksi 103 m dari -5.3670536, 105.2441874
    routeIds: ['J1'],
  },
  {
    id: 'titik-jemput-terpadu',
    name: 'Titik Jemput Terpadu',
    lat: -5.367947,
    lng: 105.24212,
    routeIds: ['J1', 'J2'],
  },
]

export function getStopById(id: string): Stop | undefined {
  return STOPS.find((stop) => stop.id === id)
}
