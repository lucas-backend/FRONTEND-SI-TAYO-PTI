import { CAPACITY_THRESHOLDS } from '@/config'

/** Format jarak: < 1000 m -> "450 meter", selebihnya -> "1,2 km". */
export function formatDistance(meters: number): string {
  if (!Number.isFinite(meters)) return '-'
  if (Math.abs(meters) < 1000) return `${Math.round(meters)} meter`
  return `${formatDecimal(meters / 1000, 1)} km`
}

/** Format kecepatan: "24 km/jam". */
export function formatSpeed(kmh: number): string {
  if (!Number.isFinite(kmh)) return '-'
  return `${Math.round(kmh)} km/jam`
}

/** Angka desimal dengan pemisah koma ala Indonesia. */
export function formatDecimal(value: number, digits = 1): string {
  return value.toFixed(digits).replace('.', ',')
}

/**
 * Format ETA (menit) sesuai konvensi UI BRIEF:
 * "Lewat", "Sedang berhenti", "Segera tiba", "3 Menit", "+6 mnt".
 */
export function formatEta(minutes: number, state?: 'PASSED' | 'DWELLING' | 'NEXT'): string {
  if (state === 'PASSED') return 'Lewat'
  if (state === 'DWELLING') return 'Sedang berhenti'
  if (!Number.isFinite(minutes)) return '-'
  if (minutes <= 0.75) return 'Segera tiba'
  if (minutes < 1) return 'Segera tiba'
  const rounded = Math.round(minutes)
  if (state === 'NEXT') return `${rounded} Menit`
  return `+${rounded} mnt`
}

/** Label status kursi untuk badge. */
export function formatCapacityStatus(status: 'AVAILABLE' | 'FULL'): string {
  return status === 'FULL' ? 'Penuh' : 'Tersedia'
}

/** Label status armada. */
export function formatBusStatus(status: 'ACTIVE' | 'STANDBY' | 'OFFLINE'): string {
  switch (status) {
    case 'ACTIVE':
      return 'Aktif'
    case 'STANDBY':
      return 'Stanby'
    default:
      return 'Offline'
  }
}

export type CapacityTone = 'success' | 'warning' | 'danger'

/** Warna bar keterisian kursi menurut rasio terisi. */
export function capacityTone(seatsTaken: number, capacity: number): CapacityTone {
  const ratio = capacity > 0 ? seatsTaken / capacity : 0
  if (ratio >= CAPACITY_THRESHOLDS.high) return 'danger'
  if (ratio >= CAPACITY_THRESHOLDS.medium) return 'warning'
  return 'success'
}

/** Sisa kursi efektif (0 bila berstatus penuh). */
export function remainingSeats(seatsTaken: number, capacity: number, status: 'AVAILABLE' | 'FULL'): number {
  if (status === 'FULL') return 0
  return Math.max(0, capacity - seatsTaken)
}
