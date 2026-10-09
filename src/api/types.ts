/**
 * Kontrak data Pelacak Bus Unila. Bentuk ini identik dengan yang akan
 * dikembalikan API sungguhan, sehingga cukup mengganti flag mock untuk beralih.
 */

export type RouteCode = 'J1' | 'J2'

export type BusStatus = 'ACTIVE' | 'STANDBY' | 'OFFLINE'
export type CapacityStatus = 'AVAILABLE' | 'FULL'
export type UserRole = 'ADMIN' | 'DRIVER'

export interface Stop {
  id: string
  name: string
  lat: number
  lng: number
  routeIds: string[]
}

export interface Route {
  id: string
  code: RouteCode
  name: string
  color: string
  dashed: boolean
  intervalMin: number
  /** Titik geometri rute sebagai [lat, lng] (urutan sesuai Leaflet). */
  path: [number, number][]
  stopIds: string[]
  active: boolean
}

export interface RouteInput {
  code: RouteCode
  name: string
  color: string
  dashed: boolean
  intervalMin: number
  path: [number, number][]
  stopIds: string[]
  active: boolean
}

export interface StopInput {
  name: string
  lat: number
  lng: number
  routeIds: string[]
}

export interface Bus {
  id: string
  plate: string
  label: string
  routeId: string
  driverId: string
  capacity: number
  seatsTaken: number
  capacityStatus: CapacityStatus
  status: BusStatus
  /** Terdaftar & diizinkan beroperasi (toggle aktif/nonaktif admin). */
  active: boolean
}

export interface BusPosition {
  busId: string
  lat: number
  lng: number
  heading: number
  speedKmh: number
  nextStopId: string
  ts: number
  etaToStops: Record<string, number>
}

export interface User {
  id: string
  name: string
  username: string
  role: UserRole
  active: boolean
  /** Timestamp login terakhir (mock, diisi klien API saat login sukses). */
  lastLoginAt?: number
}

export interface AuthSession {
  token: string
  role: UserRole
  user: User
}

export interface BusInput {
  plate: string
  label: string
  routeId: string
  driverId: string
  capacity: number
  active: boolean
}

export interface UserInput {
  name: string
  username: string
  role: UserRole
  active: boolean
}

export interface PinResetResult {
  user: User
  pin: string
}

export interface CapacityPatch {
  capacityStatus: CapacityStatus
  seatsTaken: number
}

export interface TrackingLocationInput {
  busId: string
  lat: number
  lng: number
  ts: number
}

export interface LoginInput {
  username: string
  pin: string
}
