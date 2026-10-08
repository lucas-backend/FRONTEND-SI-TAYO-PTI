/**
 * Data grafik dashboard. Deterministik (tanpa Math.random) agar tampilan
 * konsisten tiap render/refresh; hanya dipakai sebagai visual dummy.
 */
function seeded(index: number, salt: number): number {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453
  return value - Math.floor(value)
}

export interface HourPoint {
  label: string
  penumpang: number
}

export interface DayPoint {
  label: string
  perjalanan: number
}

const OPERATIONAL_HOURS = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
const DAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']

export function passengersPerHour(): HourPoint[] {
  return OPERATIONAL_HOURS.map((hour, index) => ({
    label: `${String(hour).padStart(2, '0')}.00`,
    penumpang: Math.round(18 + seeded(index, 1) * 42),
  }))
}

export function tripsPerDay(): DayPoint[] {
  return DAYS.map((label, index) => ({
    label,
    perjalanan: Math.round(22 + seeded(index, 2) * 34),
  }))
}
