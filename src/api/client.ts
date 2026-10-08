import type {
  AuthSession,
  Bus,
  BusPosition,
  CapacityStatus,
  LoginInput,
  Route,
  Stop,
  TrackingLocationInput,
  User,
} from './types'
import { BUSES, ROUTES, STOPS, USERS } from '@/mock/data'
import { simulator } from '@/mock/simulator/instance'

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function clone<T extends object>(items: readonly T[]): T[] {
  return items.map((item) => ({ ...item }))
}

function fakeJwt(payload: Record<string, string>): string {
  const header = { alg: 'HS256', typ: 'JWT' }
  const encode = (value: object) => btoa(JSON.stringify(value)).replace(/=+$/, '')
  return `${encode(header)}.${encode(payload)}.mock-signature`
}

function expectedPin(user: User): string {
  if (user.role === 'DRIVER') return '123456'
  return user.username === 'superadmin' ? 'super123' : 'admin123'
}

/**
 * Klien API. Selama VITE_USE_MOCK=true, semua operasi dilayani data mock +
 * mesin simulasi. Kontrak mengembalikan bentuk yang sama dengan API asli.
 */
export const api = {
  async login(input: LoginInput): Promise<AuthSession> {
    await delay(340)
    const user = USERS.find((item) => item.username === input.username && item.active)
    if (!user) throw new Error('ID pengemudi / username tidak ditemukan')
    if (input.pin !== expectedPin(user)) throw new Error('PIN atau kata sandi salah')
    return {
      token: fakeJwt({ sub: user.id, role: user.role, name: user.name }),
      role: user.role,
      user: { ...user },
    }
  },

  async getRoutes(): Promise<Route[]> {
    await delay(120)
    return clone(ROUTES)
  },

  async getStops(): Promise<Stop[]> {
    await delay(120)
    return clone(STOPS)
  },

  async getBuses(): Promise<Bus[]> {
    await delay(120)
    return clone(BUSES)
  },

  async getUsers(): Promise<User[]> {
    await delay(120)
    return clone(USERS)
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

  async resetDemo(): Promise<void> {
    await delay(160)
    simulator.reset()
  },

  getGatewayPositions(): BusPosition[] {
    return simulator.getPositions()
  },
}

export type Api = typeof api
