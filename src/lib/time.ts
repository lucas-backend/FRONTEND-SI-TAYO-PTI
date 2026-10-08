import { OPERATIONAL_HOURS } from '@/config'

function pad(value: number): string {
  return value.toString().padStart(2, '0')
}

/** Jam format Indonesia "06.30". */
export function formatClock(date: Date | number): string {
  const d = typeof date === 'number' ? new Date(date) : date
  return `${pad(d.getHours())}.${pad(d.getMinutes())}`
}

/** Selisih detik sejak timestamp tertentu -> "12 dtk lalu". */
export function formatAgo(fromTs: number, nowTs: number = Date.now()): string {
  const seconds = Math.max(0, Math.round((nowTs - fromTs) / 1000))
  if (seconds < 60) return `${seconds} dtk lalu`
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes} mnt lalu`
  const hours = Math.round(minutes / 60)
  return `${hours} jam lalu`
}

/** Apakah waktu sekarang berada dalam jam operasional kampus. */
export function isWithinOperationalHours(now: Date = new Date()): boolean {
  const minutes = now.getHours() * 60 + now.getMinutes()
  const open = OPERATIONAL_HOURS.openHour * 60 + OPERATIONAL_HOURS.openMinute
  const close = OPERATIONAL_HOURS.closeHour * 60 + OPERATIONAL_HOURS.closeMinute
  return minutes >= open && minutes <= close
}

/** Rentang jam operasional -> "06.30-17.00". */
export function formatOperationalHours(): string {
  const open = `${pad(OPERATIONAL_HOURS.openHour)}.${pad(OPERATIONAL_HOURS.openMinute)}`
  const close = `${pad(OPERATIONAL_HOURS.closeHour)}.${pad(OPERATIONAL_HOURS.closeMinute)}`
  return `${open}-${close}`
}
