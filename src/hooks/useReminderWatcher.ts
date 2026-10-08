import { useEffect } from 'react'
import { useSimStore } from '@/store/useSimStore'
import { useUserStore } from '@/store/useUserStore'
import type { UserReminder } from '@/store/useUserStore'
import { useToast } from '@/components/ui'

type SimSnapshot = ReturnType<typeof useSimStore.getState>

function etaForReminder(reminder: UserReminder, state: SimSnapshot): number | null {
  if (reminder.busId) {
    const position = state.positions[reminder.busId]
    const eta = position?.etaToStops[reminder.stopId]
    return eta ?? null
  }
  let best: number | null = null
  for (const bus of state.buses) {
    const route = state.routes.find((item) => item.id === bus.routeId)
    const position = state.positions[bus.id]
    if (!route || !position || !route.stopIds.includes(reminder.stopId)) continue
    const eta = position.etaToStops[reminder.stopId]
    if (eta === undefined) continue
    if (best === null || eta < best) best = eta
  }
  return best
}

function notify(message: string): void {
  if (typeof Notification === 'undefined') return
  if (Notification.permission !== 'granted') return
  try {
    new Notification('Bus Unila', { body: message })
  } catch {
    // Notifikasi hanya pelengkap; toast tetap tampil.
  }
}

/**
 * Pantau daftar pengingat (BRIEF 9.6): saat ETA bus ke halte tujuan mencapai
 * ambang (mis. 5 menit), tampilkan toast dalam aplikasi + Notification API
 * bila diizinkan.
 */
export function useReminderWatcher(): void {
  const { show } = useToast()

  useEffect(() => {
    const check = () => {
      const state = useSimStore.getState()
      const reminders = useUserStore.getState().reminders
      if (reminders.length === 0) return
      for (const reminder of reminders) {
        if (reminder.triggered) continue
        const eta = etaForReminder(reminder, state)
        if (eta === null || eta > reminder.thresholdMin) continue
        useUserStore.getState().markTriggered(reminder.id)
        const stopName = state.stops.find((stop) => stop.id === reminder.stopId)?.name ?? 'halte tujuan'
        const text =
          eta <= 1
            ? `${stopName}: bus segera tiba`
            : `${stopName}: bus tiba dalam ${Math.round(eta)} menit`
        show(text, { tone: 'success', durationMs: 6000 })
        notify(text)
      }
    }
    const unsubscribeSim = useSimStore.subscribe(check)
    const unsubscribeUser = useUserStore.subscribe(check)
    check()
    return () => {
      unsubscribeSim()
      unsubscribeUser()
    }
  }, [show])
}
