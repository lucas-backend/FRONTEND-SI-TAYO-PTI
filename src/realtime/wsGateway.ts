import { WS_URL } from '@/config'
import type { Gateway, RealtimeChannel, RealtimePayload, Unsubscribe } from './gateway'

/**
 * Stub gateway WebSocket untuk produksi. Belum dipakai selama VITE_USE_MOCK=true.
 *
 * Rencana implementasi (mengacu kontrak realtime di BRIEF bagian 6):
 *
 *   import { WS_URL } from '@/config'
 *
 *   export function createWsGateway(): Gateway {
 *     const socket = new WebSocket(WS_URL)
 *     const handlers = new Map<RealtimeChannel, Set<(p: unknown) => void>>()
 *     socket.addEventListener('message', (event) => {
 *       const data = JSON.parse(event.data) as { channel: RealtimeChannel; payload: unknown }
 *       handlers.get(data.channel)?.forEach((handler) => handler(data.payload))
 *     })
 *     return {
 *       subscribe(channel, callback) { ...add...; return () => { ...delete... } },
 *       isConnected: () => socket.readyState === WebSocket.OPEN,
 *       dispose: () => socket.close(),
 *     }
 *   }
 */
export function createWsGateway(): Gateway {
  return {
    subscribe: <C extends RealtimeChannel>(channel: C, callback: (payload: RealtimePayload<C>) => void): Unsubscribe => {
      void channel
      void callback
      throw new Error(`Gateway WebSocket belum diimplementasikan (WS_URL=${WS_URL}). Set VITE_USE_MOCK=true.`)
    },
    isConnected: () => false,
    dispose: () => undefined,
  }
}
