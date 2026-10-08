import { SIM } from '@/config'

export interface StopDistance {
  stopId: string
  distanceKm: number
}

export interface EtaContext {
  stopDistances: readonly StopDistance[]
  totalKm: number
  speedKmh: number
  dwellAvgS: number
}

/** Jarak maju di sepanjang loop dari `currentKm` ke `targetKm` (selalu >= 0). */
export function remainingAlong(currentKm: number, targetKm: number, totalKm: number): number {
  const total = totalKm > 0 ? totalKm : 1
  return (((targetKm - currentKm) % total) + total) % total
}

/** Index halte berikutnya (yang belum dilewati) dari posisi sekarang. */
export function findNextStopIndex(
  currentKm: number,
  stopDistances: readonly StopDistance[],
  totalKm: number,
): number {
  if (stopDistances.length === 0) return 0
  let bestIndex = 0
  let bestRemaining = Number.POSITIVE_INFINITY
  stopDistances.forEach((stop, index) => {
    let remaining = remainingAlong(currentKm, stop.distanceKm, totalKm)
    // Bila tepat berada di halte, anggap halte itu sudah lewat (target putaran berikutnya).
    if (remaining < 0.008) remaining += totalKm
    if (remaining < bestRemaining) {
      bestRemaining = remaining
      bestIndex = index
    }
  })
  return bestIndex
}

/**
 * ETA (menit) ke setiap halte:
 * sisa jarak / kecepatan rata-rata + dwell tiap halte yang dilalui di tengah.
 */
export function computeEtaToStops(currentKm: number, context: EtaContext): Record<string, number> {
  const avgSpeed = Math.max(context.speedKmh, 5)
  const eta: Record<string, number> = {}
  for (const stop of context.stopDistances) {
    const remainingKm = remainingAlong(currentKm, stop.distanceKm, context.totalKm)
    let intermediateStops = 0
    for (const other of context.stopDistances) {
      if (other.stopId === stop.stopId) continue
      const otherRemaining = remainingAlong(currentKm, other.distanceKm, context.totalKm)
      if (otherRemaining < remainingKm) intermediateStops += 1
    }
    eta[stop.stopId] = (remainingKm / avgSpeed) * 60 + (intermediateStops * context.dwellAvgS) / 60
  }
  return eta
}

export function randomSpeed(): number {
  return SIM.SPEED_MIN_KMH + Math.random() * (SIM.SPEED_MAX_KMH - SIM.SPEED_MIN_KMH)
}

export function randomDwellSeconds(): number {
  return SIM.DWELL_MIN_S + Math.random() * (SIM.DWELL_MAX_S - SIM.DWELL_MIN_S)
}
