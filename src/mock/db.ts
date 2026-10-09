import type { Bus, BusInput, Route, RouteInput, Stop, StopInput, User, UserInput, UserRole } from '@/api/types'
import { BUSES } from './data/buses'
import { ROUTES } from './data/routes'
import { STOPS } from './data/stops'
import { DEMO_CREDENTIALS, USERS } from './data/users'

/**
 * "Backend" tiruan untuk persistensi demo. Seluruh hasil CRUD admin disimpan
 * pada SATU key localStorage ber-versi; tombol Reset Data Demo menghapusnya
 * sehingga data kembali ke seed (`mock/data`). Mesin simulasi & klien API
 * membaca dari sini, bukan lagi langsung dari konstanta seed.
 */
export const DEMO_STORAGE_KEY = 'bus-unila:demo-data:v2'

interface DemoData {
  buses: Bus[]
  users: User[]
  pins: Record<string, string>
  routes: Route[]
  stops: Stop[]
}

function clone<T extends object>(items: readonly T[]): T[] {
  return items.map((item) => ({ ...item }))
}

function seedPins(): Record<string, string> {
  return {
    'adm-01': DEMO_CREDENTIALS.admin.pin,
    'adm-02': DEMO_CREDENTIALS.superadmin.pin,
    'drv-bambang': DEMO_CREDENTIALS.driver.pin,
    'drv-sri': DEMO_CREDENTIALS.driver.pin,
  }
}

function seed(): DemoData {
  return { buses: clone(BUSES), users: clone(USERS), pins: seedPins(), routes: structuredClone(ROUTES), stops: structuredClone(STOPS) }
}

function storageAvailable(): boolean {
  return typeof localStorage !== 'undefined'
}

function read(): DemoData | null {
  if (!storageAvailable()) return null
  const raw = localStorage.getItem(DEMO_STORAGE_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as Partial<DemoData>
    if (!Array.isArray(parsed.buses) || !Array.isArray(parsed.users)) return null
    return {
      buses: parsed.buses,
      users: parsed.users,
      pins: parsed.pins ?? seedPins(),
      routes: Array.isArray(parsed.routes) ? parsed.routes : structuredClone(ROUTES),
      stops: Array.isArray(parsed.stops) ? parsed.stops : structuredClone(STOPS),
    }
  } catch {
    return null
  }
}

function write(data: DemoData): void {
  if (!storageAvailable()) return
  localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(data))
}

function current(): DemoData {
  return read() ?? seed()
}

function randomPin(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}

function nextLabel(buses: readonly Bus[]): string {
  const count = buses.length + 1
  return `Bus ${String(count).padStart(2, '0')}`
}

// ---- Baca ----

export function listBuses(): Bus[] {
  return clone(current().buses)
}

export function listUsers(): User[] {
  return clone(current().users)
}

export function listRoutes(): Route[] {
  return structuredClone(current().routes)
}

export function listStops(): Stop[] {
  return structuredClone(current().stops)
}

export function saveRoute(id: string | null, input: RouteInput): Route {
  const data = current()
  const route: Route = { ...input, id: id ?? `J${Date.now().toString(36)}` }
  data.routes = id ? data.routes.map((item) => (item.id === id ? route : item)) : [...data.routes, route]
  write(data)
  return structuredClone(route)
}

export function saveStop(id: string | null, input: StopInput): Stop {
  const data = current()
  const stop: Stop = { ...input, id: id ?? `tj-${input.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${Date.now().toString(36)}` }
  data.stops = id ? data.stops.map((item) => (item.id === id ? stop : item)) : [...data.stops, stop]
  data.routes = data.routes.map((route) => route)
  write(data)
  return structuredClone(stop)
}

export function deleteStop(id: string): void {
  const data = current()
  data.stops = data.stops.filter((stop) => stop.id !== id)
  data.routes = data.routes.map((route) => ({ ...route, stopIds: route.stopIds.filter((stopId) => stopId !== id) }))
  write(data)
}

export function findUser(username: string): User | undefined {
  return current().users.find((user) => user.username === username)
}

export function getUserById(id: string): User | undefined {
  return current().users.find((user) => user.id === id)
}

export function pinFor(user: User): string | undefined {
  return current().pins[user.id]
}

// ---- Bus ----

export function createBus(input: BusInput): Bus {
  const data = current()
  const bus: Bus = {
    id: `bus-${Date.now().toString(36)}`,
    plate: input.plate,
    label: input.label.trim() || nextLabel(data.buses),
    routeId: input.routeId,
    driverId: input.driverId,
    capacity: input.capacity,
    seatsTaken: 0,
    capacityStatus: 'AVAILABLE',
    status: input.active ? 'ACTIVE' : 'OFFLINE',
    active: input.active,
  }
  data.buses = [...data.buses, bus]
  write(data)
  return { ...bus }
}

export function updateBus(id: string, input: BusInput): Bus | null {
  const data = current()
  const index = data.buses.findIndex((bus) => bus.id === id)
  if (index < 0) return null
  const existing = data.buses[index]
  const next: Bus = {
    ...existing,
    plate: input.plate,
    label: input.label.trim() || existing.label,
    routeId: input.routeId,
    driverId: input.driverId,
    capacity: input.capacity,
    seatsTaken: Math.min(existing.seatsTaken, input.capacity),
    active: input.active,
    status: input.active ? (existing.status === 'OFFLINE' ? 'STANDBY' : existing.status) : 'OFFLINE',
  }
  data.buses = data.buses.map((bus) => (bus.id === id ? next : bus))
  write(data)
  return { ...next }
}

export function deleteBus(id: string): void {
  const data = current()
  data.buses = data.buses.filter((bus) => bus.id !== id)
  write(data)
}

export function setBusActive(id: string, active: boolean): Bus | null {
  const data = current()
  const existing = data.buses.find((bus) => bus.id === id)
  if (!existing) return null
  const next: Bus = {
    ...existing,
    active,
    status: active ? (existing.status === 'OFFLINE' ? 'STANDBY' : existing.status) : 'OFFLINE',
  }
  data.buses = data.buses.map((bus) => (bus.id === id ? next : bus))
  write(data)
  return { ...next }
}

export function busLabelExists(label: string, exceptId?: string): boolean {
  return current().buses.some((bus) => bus.label.toLowerCase() === label.toLowerCase() && bus.id !== exceptId)
}

export function plateExists(plate: string, exceptId?: string): boolean {
  return current().buses.some((bus) => bus.plate.toUpperCase() === plate.toUpperCase() && bus.id !== exceptId)
}

// ---- Akun ----

export function createUser(input: UserInput): { user: User; pin: string } {
  const data = current()
  const pin = randomPin()
  const user: User = {
    id: `usr-${Date.now().toString(36)}`,
    name: input.name,
    username: input.username,
    role: input.role,
    active: input.active,
  }
  data.users = [...data.users, user]
  data.pins = { ...data.pins, [user.id]: pin }
  write(data)
  return { user: { ...user }, pin }
}

export function updateUser(id: string, input: UserInput): User | null {
  const data = current()
  const existing = data.users.find((user) => user.id === id)
  if (!existing) return null
  const next: User = { ...existing, name: input.name, username: input.username, role: input.role, active: input.active }
  data.users = data.users.map((user) => (user.id === id ? next : user))
  write(data)
  return { ...next }
}

export function setUserActive(id: string, active: boolean): User | null {
  const data = current()
  const existing = data.users.find((user) => user.id === id)
  if (!existing) return null
  const next: User = { ...existing, active }
  data.users = data.users.map((user) => (user.id === id ? next : user))
  write(data)
  return { ...next }
}

export function resetUserPin(id: string): { user: User; pin: string } | null {
  const data = current()
  const existing = data.users.find((user) => user.id === id)
  if (!existing) return null
  const pin = randomPin()
  data.pins = { ...data.pins, [id]: pin }
  write(data)
  return { user: { ...existing }, pin }
}

export function usernameExists(username: string, exceptId?: string): boolean {
  return current().users.some((user) => user.username.toLowerCase() === username.toLowerCase() && user.id !== exceptId)
}

export function verifyPin(user: User, pin: string): boolean {
  const expected = pinFor(user) ?? fallbackPin(user)
  return pin === expected
}

function fallbackPin(user: User): string {
  if (user.role === 'DRIVER') return '123456'
  return user.username === 'superadmin' ? 'super123' : 'admin123'
}

export function recordLogin(id: string): User | null {
  const data = current()
  const existing = data.users.find((user) => user.id === id)
  if (!existing) return null
  const next: User = { ...existing, lastLoginAt: Date.now() }
  data.users = data.users.map((user) => (user.id === id ? next : user))
  write(data)
  return { ...next }
}

export function drivers(): User[] {
  return current().users.filter((user) => user.role === ('DRIVER' satisfies UserRole))
}

// ---- Reset ----

/** Hapus hasil CRUD demo dan kembalikan data seed. */
export function resetDemoData(): DemoData {
  if (storageAvailable()) localStorage.removeItem(DEMO_STORAGE_KEY)
  return seed()
}
