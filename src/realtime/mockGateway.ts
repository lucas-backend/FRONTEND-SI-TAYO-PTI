import type { Gateway, RealtimeChannel, RealtimePayload, Unsubscribe } from './gateway'

const BROADCAST_NAME = 'bus-unila-realtime'

type Handler = (payload: unknown) => void

const handlers = new Map<RealtimeChannel, Set<Handler>>()
let connected = true

const broadcast: BroadcastChannel | null =
  typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(BROADCAST_NAME) : null

function channelHandlers(name: RealtimeChannel): Set<Handler> {
  let set = handlers.get(name)
  if (!set) {
    set = new Set()
    handlers.set(name, set)
  }
  return set
}

function dispatch(name: RealtimeChannel, payload: unknown): void {
  channelHandlers(name).forEach((handler) => handler(payload))
}

broadcast?.addEventListener('message', (event: MessageEvent<{ channel: RealtimeChannel; payload: unknown }>) => {
  dispatch(event.data.channel, event.data.payload)
})

/** Pancarkan event ke semua subscriber lokal + tab lain via BroadcastChannel. */
export function publish<C extends RealtimeChannel>(name: C, payload: RealtimePayload<C>): void {
  dispatch(name, payload)
  broadcast?.postMessage({ channel: name, payload })
}

/** Ubah status koneksi gateway (dipakai skenario sinyal putus). */
export function setGatewayConnected(value: boolean): void {
  connected = value
  dispatch('gateway:status', { connected: value, ts: Date.now() })
  broadcast?.postMessage({ channel: 'gateway:status', payload: { connected: value, ts: Date.now() } })
}

export const mockGateway: Gateway = {
  subscribe<C extends RealtimeChannel>(name: C, callback: (payload: RealtimePayload<C>) => void): Unsubscribe {
    const handler: Handler = (payload) => callback(payload as RealtimePayload<C>)
    channelHandlers(name).add(handler)
    return () => {
      channelHandlers(name).delete(handler)
    }
  },
  isConnected(): boolean {
    return connected
  },
  dispose(): void {
    handlers.clear()
    broadcast?.close()
  },
}
