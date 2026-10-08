import { create } from 'zustand'
import type { CapacityStatus, User } from '@/api/types'
import { api } from '@/api/client'
import { broadcastControl } from '@/realtime'
import { DRIVER } from '@/config'

const SESSION_KEY = 'bus-unila:driver-session'
const ORIGIN = Math.random().toString(36).slice(2)
let recoverTimer: number | null = null

interface StoredSession {
  token: string
  user: User
}

interface DriverState {
  user: User | null
  token: string | null
  busId: string | null
  loading: boolean
  error: string | null
  tracking: boolean
  recovering: boolean
  pendingSent: number
  login: (username: string, pin: string) => Promise<boolean>
  logout: () => void
  restore: () => Promise<void>
  startTracking: () => Promise<void>
  stopTracking: () => Promise<void>
  setCapacity: (status: CapacityStatus) => Promise<void>
  simulateSignalLoss: (seconds?: number) => Promise<void>
  notifyRecovered: (pending: number) => void
  clearRecovery: () => void
}

function readSession(): StoredSession | null {
  if (typeof localStorage === 'undefined') return null
  const raw = localStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as StoredSession
  } catch {
    return null
  }
}

function writeSession(session: StoredSession | null): void {
  if (typeof localStorage === 'undefined') return
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  else localStorage.removeItem(SESSION_KEY)
}

async function resolveBusId(user: User): Promise<string | null> {
  const buses = await api.getBuses()
  const owned = buses.find((bus) => bus.driverId === user.id)
  return owned?.id ?? DRIVER.demoBusId
}

export const useDriverStore = create<DriverState>((set, get) => ({
  user: null,
  token: null,
  busId: null,
  loading: false,
  error: null,
  tracking: false,
  recovering: false,
  pendingSent: 0,

  async login(username, pin) {
    set({ loading: true, error: null })
    try {
      const session = await api.login({ username, pin })
      if (session.role !== 'DRIVER') {
        set({ loading: false, error: 'Akun ini bukan akun pengemudi.' })
        return false
      }
      const busId = await resolveBusId(session.user)
      writeSession({ token: session.token, user: session.user })
      set({ user: session.user, token: session.token, busId, loading: false, error: null })
      return true
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Login gagal',
      })
      return false
    }
  },

  logout() {
    writeSession(null)
    set({ user: null, token: null, busId: null, error: null, tracking: false, recovering: false, pendingSent: 0 })
  },

  async restore() {
    const stored = readSession()
    if (!stored) return
    const busId = await resolveBusId(stored.user)
    set({ user: stored.user, token: stored.token, busId })
  },

  async startTracking() {
    const { busId } = get()
    if (!busId) return
    await api.startTracking(busId)
    broadcastControl({ origin: ORIGIN, action: 'START', busId, ts: Date.now() })
    set({ tracking: true })
  },

  async stopTracking() {
    const { busId } = get()
    if (!busId) return
    await api.stopTracking(busId)
    broadcastControl({ origin: ORIGIN, action: 'STOP', busId, ts: Date.now() })
    set({ tracking: false, recovering: false, pendingSent: 0 })
  },

  async setCapacity(status) {
    const { busId } = get()
    if (!busId) return
    await api.setCapacity(busId, status)
    broadcastControl({ origin: ORIGIN, action: 'CAPACITY', busId, full: status === 'FULL', ts: Date.now() })
  },

  async simulateSignalLoss(seconds) {
    const { busId } = get()
    if (!busId) return
    await api.simulateSignalLoss(busId, seconds)
    broadcastControl({ origin: ORIGIN, action: 'SIGNAL_LOSS', busId, seconds, ts: Date.now() })
  },

  notifyRecovered(pending) {
    set({ recovering: true, pendingSent: pending })
    if (recoverTimer !== null) window.clearTimeout(recoverTimer)
    recoverTimer = window.setTimeout(() => {
      recoverTimer = null
      set({ recovering: false, pendingSent: 0 })
    }, DRIVER.RECOVER_BANNER_MS)
  },

  clearRecovery() {
    if (recoverTimer !== null) {
      window.clearTimeout(recoverTimer)
      recoverTimer = null
    }
    set({ recovering: false, pendingSent: 0 })
  },
}))
