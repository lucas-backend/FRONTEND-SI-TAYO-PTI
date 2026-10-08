import type { Stop } from '@/api/types'

/**
 * Halte Bus Unila.
 *
 * Koordinat gedung rujukan diverifikasi via OpenStreetMap/Nominatim (Okt 2026):
 * - Rektorat Universitas Lampung  : -5.3643543, 105.2431643
 * - Perpustakaan Universitas Lampung: -5.3616738, 105.2404548
 * - FMIPA Universitas Lampung     : -5.3670536, 105.2441874
 * - Fakultas Kedokteran Unila     : -5.3682684, 105.2475063
 * - Fakultas Pertanian Unila      : -5.3654432, 105.2420760
 *
 * TODO: verifikasi lapangan untuk titik halte GSG dan Bundaran (belum ada
 * node resmi di OSM), serta geser titik tepat ke bahu jalan tiap halte.
 */
export const STOPS: Stop[] = [
  {
    id: 'gsg',
    name: 'Halte GSG',
    lat: -5.3618,
    lng: 105.2437,
    routeIds: ['J1'], // TODO: verifikasi lapangan
  },
  {
    id: 'pertanian',
    name: 'Halte Pertanian',
    lat: -5.3654432,
    lng: 105.242076,
    routeIds: ['J1'],
  },
  {
    id: 'rektorat',
    name: 'Halte Rektorat',
    lat: -5.3643543,
    lng: 105.2431643,
    routeIds: ['J1', 'J2'],
  },
  {
    id: 'mipa',
    name: 'Halte MIPA',
    lat: -5.3670536,
    lng: 105.2441874,
    routeIds: ['J1'],
  },
  {
    id: 'fk',
    name: 'Halte FK',
    lat: -5.3682684,
    lng: 105.2475063,
    routeIds: ['J1'],
  },
  {
    id: 'bundaran',
    name: 'Halte Bundaran',
    lat: -5.3704,
    lng: 105.2423,
    routeIds: ['J1'], // TODO: verifikasi lapangan
  },
  {
    id: 'perpus',
    name: 'Halte Perpus',
    lat: -5.3616738,
    lng: 105.2404548,
    routeIds: ['J2'],
  },
]

export function getStopById(id: string): Stop | undefined {
  return STOPS.find((stop) => stop.id === id)
}
