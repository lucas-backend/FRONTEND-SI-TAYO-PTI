import type { Route } from '@/api/types'

/** Deskripsi jalur panjang untuk panel standby (gambar supir). */
export function routeDescription(route: Route | undefined): string {
  if (!route) return '-'
  if (route.code === 'J1') return 'Jalur Lingkar Luar (Gedung Serba Guna - FMIPA - Rektorat)'
  return 'Jalur Lingkar Dalam (Perpustakaan - Rektorat)'
}

/** Ringkasan jalur singkat untuk chip panel tracking. */
export function routeSummary(route: Route | undefined): string {
  if (!route) return '-'
  if (route.code === 'J1') return 'Jalur Lingkar Luar (GSG - FMIPA - Rektorat)'
  return 'Jalur Lingkar Dalam (Perpus - Rektorat)'
}
