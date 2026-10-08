import type { Bus } from '@/api/types'

/** Armada dummy. Bus 01 & 02 aktif bergerak, Bus 03 standby untuk demo admin. */
export const BUSES: Bus[] = [
  {
    id: 'bus-01',
    plate: 'BE 2045 UZ',
    label: 'Bus 01',
    routeId: 'J1',
    driverId: 'drv-bambang',
    capacity: 28,
    seatsTaken: 14,
    capacityStatus: 'AVAILABLE',
    status: 'ACTIVE',
  },
  {
    id: 'bus-02',
    plate: 'BE 2110 UZ',
    label: 'Bus 02',
    routeId: 'J2',
    driverId: 'drv-sri',
    capacity: 28,
    seatsTaken: 20,
    capacityStatus: 'AVAILABLE',
    status: 'ACTIVE',
  },
  {
    id: 'bus-03',
    plate: 'BE 3001 UZ',
    label: 'Bus 03',
    routeId: 'J1',
    driverId: 'drv-bambang',
    capacity: 28,
    seatsTaken: 0,
    capacityStatus: 'AVAILABLE',
    status: 'STANDBY',
  },
]

export function getBusById(id: string): Bus | undefined {
  return BUSES.find((bus) => bus.id === id)
}
