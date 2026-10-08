import { useReminderWatcher } from '@/hooks/useReminderWatcher'

/** Komponen tanpa tampilan yang mengaktifkan pemantau pengingat halte. */
export function ReminderWatcher() {
  useReminderWatcher()
  return null
}
