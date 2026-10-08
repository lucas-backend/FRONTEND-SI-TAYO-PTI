import type { Bus, BusPosition, CapacityStatus, BusStatus } from '@/api/types'

/** Nama kanal realtime, meniru channel WebSocket. */
export type RealtimeChannel =
  | 'bus:position'
  | 'bus:capacity'
  | 'bus:started'
  | 'bus:stopped'
  | 'gateway:status'

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

export interface GatewayStatusEvent {
  connected: boolean
  ts: number
}

export interface RealtimeEventMap {
  'bus:position': BusPosition
  'bus:capacity': BusCapacityEvent
  'bus:started': BusLifecycleEvent
  'bus:stopped': BusLifecycleEvent
  'gateway:status': GatewayStatusEvent
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
