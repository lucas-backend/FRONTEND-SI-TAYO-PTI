// Konfigurasi global mockup. Semua nilai ajaib simulasi terkumpul di sini.

function envFlag(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback
  return value === 'true' || value === '1'
}

export const IS_MOCK = envFlag(import.meta.env.VITE_USE_MOCK, true)
export const DEMO_MODE = envFlag(import.meta.env.VITE_DEMO_MODE, false)
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api'
export const WS_URL = import.meta.env.VITE_WS_URL ?? 'ws://localhost:8080/ws'

// Konstanta mesin simulasi (interval tick, kecepatan, dwell).
// Kecepatan 10-16 km/jam (rata-rata ~13) dipilih agar satu putaran Jalur 1
// (~2,54 km, 6 halte) memakan ~14 menit sesuai target 12-18 menit.
export const SIM = {
  TICK_MS: 3000,
  JITTER_MAX_MS: 1500,
  SPEED_MIN_KMH: 10,
  SPEED_MAX_KMH: 16,
  SPEED_STEP_KMH: 2.5,
  SLOWDOWN_KM: 0.09,
  DWELL_MIN_S: 15,
  DWELL_MAX_S: 30,
  MARKER_ANIMATION_MS: 3000,
  OFFLINE_SECONDS: 20,
  DEFAULT_SPEED_MULTIPLIER: 1,
  SEAT_CHANGE_MAX: 3,
  DEFAULT_CAPACITY: 28,
} as const

export type SpeedMultiplier = 1 | 2 | 5

// Pengaturan peta kampus Unila (Gedong Meneng, Rajabasa, Bandar Lampung).
export const MAP_CONFIG = {
  center: [-5.3645, 105.2435] as [number, number],
  zoom: 16,
  minZoom: 15,
  maxZoom: 19,
  maxBounds: [
    [-5.4005, 105.2055],
    [-5.3305, 105.2815],
  ] as [[number, number], [number, number]],
  tileUrl: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '© OpenStreetMap contributors',
} as const

// Jadwal operasional kampus untuk status Operasional / Di Luar Jam.
export const OPERATIONAL_HOURS = { openHour: 6, openMinute: 30, closeHour: 17, closeMinute: 0 } as const

// Ambang keterisian kursi untuk warna bar progres.
export const CAPACITY_THRESHOLDS = { medium: 0.6, high: 0.85 } as const
