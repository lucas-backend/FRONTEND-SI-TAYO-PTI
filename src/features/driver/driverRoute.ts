import type { Route } from '@/api/types'

/** Deskripsi jalur panjang untuk panel standby (gambar supir). */
export function routeDescription(route: Route | undefined): string {
  if (!route) return '-'
  if (route.code === 'J1') return 'Jalur 1 (Titik Jemput FEB - FMIPA - Rektorat)'
  return 'Jalur 2 (Titik Jemput Terpadu - Rektorat)'
}

/** Ringkasan jalur singkat untuk chip panel tracking. */
export function routeSummary(route: Route | undefined): string {
  if (!route) return '-'
  if (route.code === 'J1') return 'Jalur 1 (FEB - FMIPA - Rektorat)'
  return 'Jalur 2 (Terpadu - Rektorat)'
}
