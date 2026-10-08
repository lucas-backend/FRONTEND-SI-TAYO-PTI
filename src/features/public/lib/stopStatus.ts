export type StopProgressState = 'NEXT' | 'PASSED' | 'UPCOMING'

export interface StopEta {
  stopId: string
  state: StopProgressState
  minutes: number
}

/**
 * Tentukan status tiap halte relatif terhadap halte berikutnya pada rute loop.
 * Urutan mengikuti `route.stopIds` (sesuai arah putaran).
 */
export function classifyStops(
  stopIds: string[],
  nextStopId: string,
  etaToStops: Record<string, number>,
): StopEta[] {
  const total = stopIds.length
  const nextIndex = Math.max(0, stopIds.indexOf(nextStopId))
  return stopIds.map((stopId, index) => {
    const delta = (index - nextIndex + total) % total
    let state: StopProgressState = 'UPCOMING'
    if (delta === 0) state = 'NEXT'
    else if (delta > total / 2) state = 'PASSED'
    return { stopId, state, minutes: etaToStops[stopId] ?? Number.POSITIVE_INFINITY }
  })
}
