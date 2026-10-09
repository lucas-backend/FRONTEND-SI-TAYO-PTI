import { IS_MOCK } from '@/config'
import type { Gateway } from './gateway'
import { mockGateway } from './mockGateway'
import { createWsGateway } from './wsGateway'

export const gateway: Gateway = IS_MOCK ? mockGateway : createWsGateway()

export { mockGateway, publish, setGatewayConnected, broadcastControl } from './mockGateway'
export { createWsGateway } from './wsGateway'
export type {
  Gateway,
  RealtimeChannel,
  RealtimeEventMap,
  RealtimePayload,
  Unsubscribe,
  BusCapacityEvent,
  BusLifecycleEvent,
  BusSignalEvent,
  BusControlEvent,
  BusControlAction,
  GatewayStatusEvent,
  FleetChangedEvent,
  DemoUserLocationEvent,
} from './gateway'
