import { useEffect, useState } from 'react'

/**
 * Hitung mundur halus (per detik) untuk nilai ETA yang datang tiap ~3 detik.
 * `baseMinutes` diukur pada `updatedTs`, lalu dikurangi waktu berjalan.
 */
export function useCountdown(baseMinutes: number, updatedTs: number, active = true): number {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!active) return
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [active])

  if (!active) return baseMinutes
  const elapsedMinutes = Math.max(0, (now - updatedTs) / 60000)
  return Math.max(0, baseMinutes - elapsedMinutes)
}
