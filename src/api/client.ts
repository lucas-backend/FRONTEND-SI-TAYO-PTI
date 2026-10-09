import type {
  AuthSession,
  Bus,
  BusInput,
  BusPosition,
  CapacityStatus,
  DemoUserLocationInput,
  LoginInput,
  PinResetResult,
  Route,
  RouteInput,
  Stop,
  StopInput,
  TrackingLocationInput,
  User,
  UserInput,
} from './types'
import { simulator } from '@/mock/simulator/instance'
import * as db from '@/mock/db'
import { broadcastControl, publish } from '@/realtime'

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function fakeJwt(payload: Record<string, string>): string {
  const header = { alg: 'HS256', typ: 'JWT' }
  const encode = (value: object) => btoa(JSON.stringify(value)).replace(/=+$/, '')
  return `${encode(header)}.${encode(payload)}.mock-signature`
}

const CONTROL_ORIGIN = 'admin-api'

/** Siarkan daftar armada terbaru ke semua tab (peta publik ikut berubah). */
function publishFleet(): Bus[] {
  const buses = db.listBuses()
  publish('fleet:changed', { buses })
  return buses
}

/**
 * Klien API. Selama VITE_USE_MOCK=true, semua operasi dilayani data mock +
 * mesin simulasi. Kontrak mengembalikan bentuk yang sama dengan API asli.
 */
export const api = {
  async login(input: LoginInput): Promise<AuthSession> {
    await delay(340)
    const user = db.findUser(input.username)
    if (!user || !user.active) throw new Error('Nama pengguna tidak ditemukan atau nonaktif')
    if (!db.verifyPin(user, input.pin)) throw new Error('PIN atau kata sandi salah')
    const updated = db.recordLogin(user.id) ?? user
    return {
      token: fakeJwt({ sub: updated.id, role: updated.role, name: updated.name }),
      role: updated.role,
      user: { ...updated },
    }
  },

  async getRoutes(): Promise<Route[]> {
    await delay(120)
    return db.listRoutes()
  },

  async getStops(): Promise<Stop[]> {
    await delay(120)
    return db.listStops()
  },

  async saveRoute(id: string | null, input: RouteInput): Promise<Route> {
    await delay(180)
    const route = db.saveRoute(id, input)
    publish('routes:changed', { routes: db.listRoutes(), stops: db.listStops() })
    return route
  },

  async saveStop(id: string | null, input: StopInput): Promise<Stop> {
    await delay(160)
    const stop = db.saveStop(id, input)
    publish('routes:changed', { routes: db.listRoutes(), stops: db.listStops() })
    return stop
  },

  async deleteStop(id: string): Promise<void> {
    await delay(140)
    db.deleteStop(id)
    publish('routes:changed', { routes: db.listRoutes(), stops: db.listStops() })
  },

  async getBuses(): Promise<Bus[]> {
    await delay(120)
    return db.listBuses()
  },

  async getUsers(): Promise<User[]> {
    await delay(120)
    return db.listUsers()
  },

  async createBus(input: BusInput): Promise<Bus> {
    await delay(220)
    const bus = db.createBus(input)
    publishFleet()
    return bus
  },

  async updateBus(id: string, input: BusInput): Promise<Bus> {
    await delay(220)
    const bus = db.updateBus(id, input)
    if (!bus) throw new Error('Bus tidak ditemukan')
    publishFleet()
    return bus
  },

  async deleteBus(id: string): Promise<void> {
    await delay(200)
    db.deleteBus(id)
    publishFleet()
  },

  async setBusActive(id: string, active: boolean): Promise<Bus> {
    await delay(160)
    const bus = db.setBusActive(id, active)
    if (!bus) throw new Error('Bus tidak ditemukan')
    publishFleet()
    return bus
  },

  async createUser(input: UserInput): Promise<PinResetResult> {
    await delay(220)
    const { user, pin } = db.createUser(input)
    return { user, pin }
  },

  async updateUser(id: string, input: UserInput): Promise<User> {
    await delay(220)
    const user = db.updateUser(id, input)
    if (!user) throw new Error('Akun tidak ditemukan')
    return user
  },

  async setUserActive(id: string, active: boolean): Promise<User> {
    await delay(160)
    const user = db.setUserActive(id, active)
    if (!user) throw new Error('Akun tidak ditemukan')
    return user
  },

  async resetUserPin(id: string): Promise<PinResetResult> {
    await delay(180)
    const result = db.resetUserPin(id)
    if (!result) throw new Error('Akun tidak ditemukan')
    return result
  },

  async getBusEta(busId: string, stopId: string): Promise<number | null> {
    await delay(60)
    const position = simulator.getPosition(busId)
    if (!position) return null
    return position.etaToStops[stopId] ?? null
  },

  async startTracking(busId: string): Promise<BusPosition> {
    await delay(180)
    const position = simulator.startTracking(busId)
    if (!position) throw new Error(`Bus ${busId} tidak ditemukan`)
    return position
  },

  async stopTracking(busId: string): Promise<void> {
    await delay(160)
    simulator.stopTracking(busId)
  },

  async updateLocation(input: TrackingLocationInput): Promise<BusPosition | null> {
    await delay(80)
    // Pada mode mock posisi digerakkan mesin simulasi, bukan GPS asli.
    void input
    return simulator.getPosition(input.busId)
  },

  async setCapacity(busId: string, status: CapacityStatus): Promise<void> {
    await delay(120)
    simulator.setCapacityFull(busId, status === 'FULL')
  },

  async simulateSignalLoss(busId: string, seconds?: number): Promise<void> {
    await delay(80)
    simulator.simulateSignalLoss(busId, seconds)
  },

  async setSimulationSpeed(speed: 1 | 2 | 5): Promise<void> {
    simulator.setSpeedMultiplier(speed)
    broadcastControl({ origin: CONTROL_ORIGIN, action: 'SPEED', busId: '', speed, ts: Date.now() })
  },

  async setSimulationPaused(paused: boolean): Promise<void> {
    simulator.setPaused(paused)
    broadcastControl({ origin: CONTROL_ORIGIN, action: 'PAUSE', busId: '', paused, ts: Date.now() })
  },

  async simulateGeofenceExit(busId: string, seconds?: number): Promise<void> {
    simulator.simulateGeofenceExit(busId, seconds)
    broadcastControl({ origin: CONTROL_ORIGIN, action: 'GEOFENCE', busId, seconds, ts: Date.now() })
  },

  async setDemoUserLocation(input: DemoUserLocationInput): Promise<void> {
    publish('demo:user-location', { ...input, ts: Date.now() })
  },

  async resetDemo(): Promise<void> {
    await delay(160)
    const { buses } = db.resetDemoData()
    broadcastControl({ origin: CONTROL_ORIGIN, action: 'RESET', busId: '', ts: Date.now() })
    simulator.syncRoutes(db.listRoutes(), db.listStops())
    simulator.reset()
    publish('fleet:changed', { buses })
    publish('routes:changed', { routes: db.listRoutes(), stops: db.listStops() })
  },

  getGatewayPositions(): BusPosition[] {
    return simulator.getPositions()
  },
}

export type Api = typeof api
