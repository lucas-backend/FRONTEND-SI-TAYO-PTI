import type { LatLng } from '@/lib/geo'

export interface UserPreset {
  id: string
  label: string
  location: LatLng
}

/**
 * Preset Posisi Simulasi (BRIEF 9.4) — koordinat dekat halte nyata di kampus
 * agar pengguna bisa menguji ETA personal tanpa GPS asli.
 */
export const USER_PRESETS: UserPreset[] = [
  { id: 'mipa', label: 'Dekat FMIPA', location: [-5.36655, 105.24425] },
  { id: 'perpus', label: 'Dekat Perpus', location: [-5.36365, 105.24245] },
  { id: 'fk', label: 'Dekat FK', location: [-5.36635, 105.2443] },
]
