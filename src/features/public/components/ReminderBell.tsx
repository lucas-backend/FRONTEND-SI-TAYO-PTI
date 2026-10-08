import { Bell, BellRing } from 'lucide-react'
import { useToast } from '@/components/ui'
import { useUserStore } from '@/store/useUserStore'
import { cn } from '@/lib/cn'

interface ReminderBellProps {
  stopId: string
  busId: string | null
  label?: string
  variant?: 'icon' | 'full'
  className?: string
}

/**
 * Tombol lonceng "Ingatkan saya saat bus 5 menit lagi" (BRIEF 9.6).
 * Meminta izin Notification API bila pengguna mengaktifkannya.
 */
export function ReminderBell({ stopId, busId, label = 'Ingatkan saya saat bus 5 menit lagi', variant = 'icon', className }: ReminderBellProps) {
  const { show } = useToast()
  const reminders = useUserStore((state) => state.reminders)
  const addReminder = useUserStore((state) => state.addReminder)
  const removeReminder = useUserStore((state) => state.removeReminder)

  const active = reminders.find(
    (reminder) => reminder.stopId === stopId && (busId === null || reminder.busId === busId) && !reminder.triggered,
  )

  const onClick = async () => {
    if (active) {
      removeReminder(active.id)
      show('Pengingat dibatalkan')
      return
    }
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      try {
        await Notification.requestPermission()
      } catch {
        // Diabaikan: notifikasi hanya pelengkap, toast tetap tampil.
      }
    }
    addReminder({ stopId, busId })
    show('Pengingat aktif: kami beri tahu saat bus 5 menit lagi', { tone: 'success' })
  }

  return (
    <button
      type="button"
      onClick={() => void onClick()}
      aria-pressed={Boolean(active)}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition',
        variant === 'full'
          ? 'w-full bg-primary-soft px-4 py-3 text-sm text-primary hover:brightness-[0.98]'
          : 'h-9 w-9 text-muted hover:bg-primary-soft hover:text-primary',
        active && (variant === 'full' ? 'text-success' : 'text-success'),
        className,
      )}
    >
      {active ? <BellRing className="h-4 w-4" aria-hidden /> : <Bell className="h-4 w-4" aria-hidden />}
      {variant === 'full' && <span>{active ? 'Pengingat aktif' : label}</span>}
    </button>
  )
}
