import type { Bus, BusPosition, CapacityStatus, BusStatus, Route, Stop } from '@/api/types'

/** Nama kanal realtime, meniru channel WebSocket. */
export type RealtimeChannel =
  | 'bus:position'
  | 'bus:capacity'
  | 'bus:started'
  | 'bus:stopped'
  | 'bus:signal'
  | 'bus:control'
  | 'fleet:changed'
  | 'gateway:status'
  | 'routes:changed'

export interface BusCapacityEvent {
  busId: string
  capacityStatus: CapacityStatus
  seatsTaken: number
  capacity: number
  status: BusStatus
}

export interface BusLifecycleEvent {
  busId: string
  ts: number
}

/**
 * Sinyal GPS bus (skenario sinyal putus). `online=false` berarti posisi
 * masuk antrean lokal (`queued`). Saat pulih, `pending` berisi jumlah
 * lokasi tertunda yang sedang dikirim.
 */
export interface BusSignalEvent {
  busId: string
  online: boolean
  queued: number
  pending: number
  ts: number
}

export type BusControlAction = 'START' | 'STOP' | 'CAPACITY' | 'SIGNAL_LOSS' | 'RESET'

/** Perintah kontrol dari simulator supir yang disiarkan ke tab leader. */
export interface BusControlEvent {
  origin: string
  action: BusControlAction
  busId: string
  full?: boolean
  seconds?: number
  ts: number
}

export interface GatewayStatusEvent {
  connected: boolean
  ts: number
}

export interface RoutesChangedEvent {
  routes: Route[]
  stops: Stop[]
}

/** Daftar armada berubah (CRUD admin). Dipancarkan ke semua tab. */
export interface FleetChangedEvent {
  buses: Bus[]
}

export interface RealtimeEventMap {
  'bus:position': BusPosition
  'bus:capacity': BusCapacityEvent
  'bus:started': BusLifecycleEvent
  'bus:stopped': BusLifecycleEvent
  'bus:signal': BusSignalEvent
  'bus:control': BusControlEvent
  'fleet:changed': FleetChangedEvent
  'gateway:status': GatewayStatusEvent
  'routes:changed': RoutesChangedEvent
}

export type RealtimePayload<C extends RealtimeChannel> = RealtimeEventMap[C]
export type Unsubscribe = () => void

/**
 * Kontrak gateway realtime. Dua implementasi:
 * - `mockGateway` (aktif saat VITE_USE_MOCK=true)
 * - `wsGateway` (stub, mengarah ke VITE_WS_URL)
 */
export interface Gateway {
  subscribe<C extends RealtimeChannel>(
    channel: C,
    callback: (payload: RealtimePayload<C>) => void,
  ): Unsubscribe
  isConnected(): boolean
  dispose(): void
}

export function capacityEventFromBus(bus: Bus): BusCapacityEvent {
  return {
    busId: bus.id,
    capacityStatus: bus.capacityStatus,
    seatsTaken: bus.seatsTaken,
    capacity: bus.capacity,
    status: bus.status,
  }
}
