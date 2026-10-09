import { MAX_STEP_ELAPSED_S, SIM } from '@/config'
import type { Bus, BusPosition, CapacityStatus, Route, Stop } from '@/api/types'
import { BUSES, ROUTES, STOPS } from '@/mock/data'
import { bearingAtDistance, distanceAlongRoute, normalizeDistance, pointAtDistance, projectStopsOnRoute, routeLengthKm } from '@/lib/geo'
import type { LatLng } from '@/lib/geo'
import { capacityEventFromBus } from '@/realtime/gateway'
import { publish } from '@/realtime/mockGateway'
import { computeEtaToStops, findNextStopIndex, randomDwellSeconds, randomSpeed } from './eta'

type BusMode = 'MOVING' | 'DWELLING'

interface StopOnRoute {
  stopId: string
  distanceKm: number
  point: LatLng
}

interface BusRuntime {
  bus: Bus
  route: Route
  path: LatLng[]
  totalKm: number
  stops: StopOnRoute[]
  distanceKm: number
  speedKmh: number
  mode: BusMode
  dwellRemainingS: number
  heading: number
  nextStopIndex: number
  active: boolean
  forcedFull: boolean
  offlineUntilTs: number
  geofenceExitUntilTs: number
  queued: BusPosition[]
}

export interface EngineDebugSnapshot {
  busId: string
  plate: string
  routeId: string
  distanceKm: number
  totalKm: number
  speedKmh: number
  mode: string
  active: boolean
  nextStopId: string
  etaToStops: Record<string, number>
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/** Mesin simulasi bus. Berjalan sendiri sejak aplikasi dibuka (lihat runner). */
export class SimulationEngine {
  private runtimes: BusRuntime[] = []
  private timer: number | null = null
  private lastTickTs = 0
  private speedMultiplier: number = SIM.DEFAULT_SPEED_MULTIPLIER
  private paused = false
  private readonly buses: Bus[]
  private routes: readonly Route[]
  private stops: readonly Stop[]
  private readonly onVisibilityChange = () => {
    if (typeof document === 'undefined') return
    if (document.visibilityState === 'visible') this.tick()
  }

  constructor(buses: readonly Bus[] = BUSES, routes: readonly Route[] = ROUTES, stops: readonly Stop[] = STOPS) {
    this.buses = buses.map((bus) => ({ ...bus }))
    this.routes = routes
    this.stops = stops
    this.rebuildRuntimes()
  }

  isRunning(): boolean {
    return this.timer !== null
  }

  start(): void {
    if (this.timer !== null) return
    this.lastTickTs = Date.now()
    this.timer = window.setInterval(() => this.tick(), SIM.TICK_MS)
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.onVisibilityChange)
    }
    // Catat bus yang sudah aktif saat mesin dinyalakan (mengisi feed aktivitas).
    const now = Date.now()
    for (const runtime of this.runtimes) {
      if (runtime.active) publish('bus:started', { busId: runtime.bus.id, ts: now })
    }
  }

  stop(): void {
    if (this.timer === null) return
    window.clearInterval(this.timer)
    this.timer = null
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.onVisibilityChange)
    }
  }

  setSpeedMultiplier(multiplier: number): void {
    this.speedMultiplier = multiplier > 0 ? multiplier : SIM.DEFAULT_SPEED_MULTIPLIER
  }

  getSpeedMultiplier(): number {
    return this.speedMultiplier
  }

  syncRoutes(routes: readonly Route[], stops: readonly Stop[]): void {
    const previousPoints = new Map(this.runtimes.map((runtime) => [runtime.bus.id, pointAtDistance(runtime.path, runtime.distanceKm)]))
    this.routes = routes
    this.stops = stops
    this.runtimes.forEach((runtime) => {
      const nextRoute = routes.find((item) => item.id === runtime.bus.routeId)
      if (!nextRoute) return
      if (!nextRoute.active && runtime.active) {
        runtime.active = false
        publish('bus:stopped', { busId: runtime.bus.id, ts: Date.now() })
      }
      const projected = previousPoints.get(runtime.bus.id)
      runtime.route = nextRoute
      runtime.path = nextRoute.path
      runtime.totalKm = routeLengthKm(nextRoute.path)
      runtime.distanceKm = projected ? distanceAlongRoute(nextRoute.path, projected) : 0
      runtime.stops = projectStopsOnRoute(nextRoute.path, stops.filter((stop) => nextRoute.stopIds.includes(stop.id)).map((stop) => ({ id: stop.id, point: [stop.lat, stop.lng] as LatLng }))).map((item) => {
        const stop = stops.find((candidate) => candidate.id === item.stopId)
        return { ...item, point: stop ? [stop.lat, stop.lng] as LatLng : pointAtDistance(nextRoute.path, item.distanceKm) }
      })
    })
  }

  setPaused(paused: boolean): void {
    this.paused = paused
  }

  isPaused(): boolean {
    return this.paused
  }

  /**
   * Bangun ulang runtime dari `this.buses`. Runtime bus yang masih ada dan
   * masih memakai jalur sama dipertahankan (posisi tidak melompat); bus yang
   * hilang/nonaktif dihentikan dengan event `bus:stopped`.
   */
  private rebuildRuntimes(): void {
    const previous = new Map(this.runtimes.map((runtime) => [runtime.bus.id, runtime]))
    const routeCounts = new Map<string, number>()
    for (const bus of this.buses) {
      if (bus.active === false) continue
      if (!this.routes.some((route) => route.id === bus.routeId)) continue
      routeCounts.set(bus.routeId, (routeCounts.get(bus.routeId) ?? 0) + 1)
    }

    const indexByRoute = new Map<string, number>()
    const next: BusRuntime[] = []
    for (const bus of this.buses) {
      if (bus.active === false) continue
      const route = this.routes.find((item) => item.id === bus.routeId)
      if (!route) continue
      const index = indexByRoute.get(bus.routeId) ?? 0
      indexByRoute.set(bus.routeId, index + 1)
      const count = routeCounts.get(bus.routeId) ?? 1

      const existing = previous.get(bus.id)
      if (existing && existing.route.id === bus.routeId) {
        existing.bus.plate = bus.plate
        existing.bus.label = bus.label
        existing.bus.driverId = bus.driverId
        existing.bus.capacity = bus.capacity
        existing.bus.seatsTaken = Math.min(existing.bus.seatsTaken, bus.capacity)
        next.push(existing)
        continue
      }
      const runtime = this.createRuntime(bus, route, index, count)
      if (runtime) next.push(runtime)
    }

    for (const runtime of this.runtimes) {
      if (!next.includes(runtime)) publish('bus:stopped', { busId: runtime.bus.id, ts: Date.now() })
    }
    this.runtimes = next
  }

  private createRuntime(bus: Bus, route: Route, indexOnRoute: number, countOnRoute: number): BusRuntime | null {
    const path = route.path.map(([lat, lng]) => [lat, lng] as LatLng)
    const totalKm = routeLengthKm(path)
    const routeStops = route.stopIds
      .map((id) => this.stops.find((stop) => stop.id === id))
      .filter((stop): stop is Stop => Boolean(stop))
    const projections = projectStopsOnRoute(
      path,
      routeStops.map((stop) => ({ id: stop.id, point: [stop.lat, stop.lng] as LatLng })),
    )
    const stops: StopOnRoute[] = projections.map((projection) => {
      const stop = routeStops.find((item) => item.id === projection.stopId)
      return {
        stopId: projection.stopId,
        distanceKm: projection.distanceKm,
        point: [stop?.lat ?? path[0][0], stop?.lng ?? path[0][1]] as LatLng,
      }
    })
    const distanceKm = countOnRoute > 1 ? (totalKm * indexOnRoute) / countOnRoute : 0
    return {
      bus,
      route,
      path,
      totalKm,
      stops,
      distanceKm,
      speedKmh: randomSpeed(),
      mode: 'MOVING',
      dwellRemainingS: 0,
      heading: bearingAtDistance(path, distanceKm),
      nextStopIndex: findNextStopIndex(distanceKm, stops, totalKm),
      active: bus.active !== false && bus.status === 'ACTIVE',
      forcedFull: bus.capacityStatus === 'FULL',
      offlineUntilTs: 0,
      geofenceExitUntilTs: 0,
      queued: [],
    }
  }

  private tick(): void {
    if (this.paused) {
      this.lastTickTs = Date.now()
      return
    }
    const now = Date.now()
    const elapsedS = Math.min(MAX_STEP_ELAPSED_S, Math.max(0, (now - this.lastTickTs) / 1000))
    this.lastTickTs = now
    // dt dihitung dari timestamp nyata (bukan jumlah tick) supaya bus tetap
    // mengejar posisi yang benar saat tab leader di-throttle/tersembunyi.
    const dtSeconds = elapsedS * this.speedMultiplier
    for (const runtime of this.runtimes) {
      if (!runtime.active) continue
      this.advance(runtime, dtSeconds)
      this.emitPosition(runtime, now)
    }
  }

  /** Majukan satu langkah (dipakai juga untuk uji konsol tanpa menunggu timer). */
  tickOnce(dtSeconds?: number): void {
    this.lastTickTs = Date.now()
    const now = Date.now()
    const dt = dtSeconds ?? (SIM.TICK_MS / 1000) * this.speedMultiplier
    for (const runtime of this.runtimes) {
      if (!runtime.active) continue
      this.advance(runtime, dt)
      this.emitPosition(runtime, now)
    }
  }

  private advance(runtime: BusRuntime, dtSeconds: number): void {
    if (runtime.stops.length === 0) {
      runtime.distanceKm = normalizeDistance(runtime.distanceKm + (runtime.speedKmh / 3600) * dtSeconds, runtime.totalKm)
      runtime.heading = bearingAtDistance(runtime.path, runtime.distanceKm)
      return
    }

    if (runtime.mode === 'DWELLING') {
      runtime.dwellRemainingS -= dtSeconds
      if (runtime.dwellRemainingS > 0) return
      runtime.mode = 'MOVING'
      runtime.speedKmh = randomSpeed()
      return
    }

    runtime.speedKmh = clamp(
      runtime.speedKmh + (Math.random() * 2 - 1) * SIM.SPEED_STEP_KMH,
      SIM.SPEED_MIN_KMH,
      SIM.SPEED_MAX_KMH,
    )

    const upcoming = runtime.stops[runtime.nextStopIndex]
    const remainingToStop = ((upcoming.distanceKm - runtime.distanceKm) % runtime.totalKm + runtime.totalKm) % runtime.totalKm
    const braking = remainingToStop < SIM.SLOWDOWN_KM
    const effectiveSpeed = braking
      ? Math.max(6, Math.min(runtime.speedKmh, (remainingToStop / SIM.SLOWDOWN_KM) * runtime.speedKmh + 6))
      : runtime.speedKmh

    const stepKm = (effectiveSpeed / 3600) * dtSeconds
    if (remainingToStop <= stepKm + 0.004) {
      runtime.distanceKm = upcoming.distanceKm
      runtime.speedKmh = 0
      runtime.mode = 'DWELLING'
      runtime.dwellRemainingS = randomDwellSeconds()
      runtime.nextStopIndex = (runtime.nextStopIndex + 1) % runtime.stops.length
      this.updateSeatsAtStop(runtime)
    } else {
      runtime.distanceKm = normalizeDistance(runtime.distanceKm + stepKm, runtime.totalKm)
      runtime.speedKmh = effectiveSpeed
    }
    runtime.heading = bearingAtDistance(runtime.path, runtime.distanceKm)
  }

  private updateSeatsAtStop(runtime: BusRuntime): void {
    const { bus } = runtime
    if (!runtime.forcedFull) {
      const delta = Math.round((Math.random() * 2 - 1) * SIM.SEAT_CHANGE_MAX)
      bus.seatsTaken = clamp(bus.seatsTaken + delta, 0, bus.capacity)
      bus.capacityStatus = bus.seatsTaken >= bus.capacity ? 'FULL' : 'AVAILABLE'
    }
    publish('bus:capacity', capacityEventFromBus(bus))
  }

  private emitPosition(runtime: BusRuntime, now: number): void {
    const position = this.buildPosition(runtime, now)
    if (runtime.offlineUntilTs > now) {
      runtime.queued.push(position)
      // Beri tahu UI jumlah lokasi yang masuk antrean lokal.
      publish('bus:signal', {
        busId: runtime.bus.id,
        online: false,
        queued: runtime.queued.length,
        pending: 0,
        ts: now,
      })
      return
    }
    if (runtime.queued.length > 0) {
      const queued = runtime.queued
      runtime.queued = []
      publish('bus:signal', {
        busId: runtime.bus.id,
        online: true,
        queued: 0,
        pending: queued.length,
        ts: now,
      })
      for (const item of queued) this.publishPosition(item)
    }
    this.publishPosition(position)
  }

  private publishPosition(position: BusPosition): void {
    const delay = Math.random() * SIM.JITTER_MAX_MS
    window.setTimeout(() => publish('bus:position', position), delay)
  }

  private buildPosition(runtime: BusRuntime, now: number): BusPosition {
    const point = pointAtDistance(runtime.path, runtime.distanceKm)
    const upcoming = runtime.stops[runtime.nextStopIndex]
    const isOutsideGeofence = runtime.geofenceExitUntilTs > now
    const [lat, lng] = isOutsideGeofence ? [point[0] + 0.03, point[1] + 0.03] : point
    const etaToStops = computeEtaToStops(runtime.distanceKm, {
      stopDistances: runtime.stops,
      totalKm: runtime.totalKm,
      speedKmh: Math.max(runtime.speedKmh, SIM.SPEED_MIN_KMH),
      dwellAvgS: (SIM.DWELL_MIN_S + SIM.DWELL_MAX_S) / 2,
    })
    return {
      busId: runtime.bus.id,
      lat,
      lng,
      heading: runtime.heading,
      speedKmh: runtime.speedKmh,
      nextStopId: upcoming?.stopId ?? '',
      ts: now,
      etaToStops,
    }
  }

  // ---- Kontrol untuk simulator supir / panel demo ----

  startTracking(busId: string): BusPosition | null {
    const runtime = this.runtimes.find((item) => item.bus.id === busId)
    if (!runtime) return null
    runtime.active = true
    runtime.mode = 'MOVING'
    runtime.distanceKm = 0
    runtime.speedKmh = randomSpeed()
    runtime.heading = bearingAtDistance(runtime.path, 0)
    runtime.nextStopIndex = findNextStopIndex(0, runtime.stops, runtime.totalKm)
    runtime.bus.status = 'ACTIVE'
    const now = Date.now()
    publish('bus:started', { busId, ts: now })
    const position = this.buildPosition(runtime, now)
    publish('bus:position', position)
    return position
  }

  stopTracking(busId: string): void {
    const runtime = this.runtimes.find((item) => item.bus.id === busId)
    if (!runtime) return
    runtime.active = false
    runtime.speedKmh = 0
    runtime.bus.status = 'STANDBY'
    publish('bus:stopped', { busId, ts: Date.now() })
  }

  setCapacityFull(busId: string, full: boolean): void {
    const runtime = this.runtimes.find((item) => item.bus.id === busId)
    if (!runtime) return
    runtime.forcedFull = full
    const status: CapacityStatus = full ? 'FULL' : 'AVAILABLE'
    runtime.bus.capacityStatus = status
    runtime.bus.seatsTaken = full ? runtime.bus.capacity : clamp(runtime.bus.seatsTaken, 0, runtime.bus.capacity - 1)
    publish('bus:capacity', capacityEventFromBus(runtime.bus))
  }

  simulateSignalLoss(busId: string, seconds: number = SIM.OFFLINE_SECONDS): void {
    const runtime = this.runtimes.find((item) => item.bus.id === busId)
    if (!runtime) return
    runtime.offlineUntilTs = Date.now() + seconds * 1000
    publish('bus:signal', {
      busId,
      online: false,
      queued: runtime.queued.length,
      pending: 0,
      ts: Date.now(),
    })
  }

  queuedCount(busId: string): number {
    const runtime = this.runtimes.find((item) => item.bus.id === busId)
    return runtime?.queued.length ?? 0
  }

  simulateGeofenceExit(busId: string, seconds = SIM.OFFLINE_SECONDS): void {
    const runtime = this.runtimes.find((item) => item.bus.id === busId)
    if (!runtime) return
    runtime.geofenceExitUntilTs = Date.now() + seconds * 1000
  }

  addBus(bus: Bus): void {
    if (this.runtimes.some((item) => item.bus.id === bus.id)) return
    this.buses.push(bus)
    this.rebuildRuntimes()
  }

  /** Ganti seluruh armada (dipakai CRUD admin & sinkronisasi antar tab). */
  syncFleet(buses: readonly Bus[]): void {
    this.buses.splice(0, this.buses.length, ...buses.map((bus) => ({ ...bus })))
    this.rebuildRuntimes()
  }

  removeBus(busId: string): void {
    publish('bus:stopped', { busId, ts: Date.now() })
    this.runtimes = this.runtimes.filter((item) => item.bus.id !== busId)
    this.buses.splice(
      0,
      this.buses.length,
      ...this.buses.filter((bus) => bus.id !== busId),
    )
  }

  getPosition(busId: string): BusPosition | null {
    const runtime = this.runtimes.find((item) => item.bus.id === busId)
    if (!runtime) return null
    return this.buildPosition(runtime, Date.now())
  }

  getPositions(): BusPosition[] {
    const now = Date.now()
    return this.runtimes.filter((item) => item.active).map((runtime) => this.buildPosition(runtime, now))
  }

  debugSnapshot(): EngineDebugSnapshot[] {
    return this.runtimes.map((runtime) => ({
      busId: runtime.bus.id,
      plate: runtime.bus.plate,
      routeId: runtime.route.id,
      distanceKm: Number(runtime.distanceKm.toFixed(3)),
      totalKm: Number(runtime.totalKm.toFixed(3)),
      speedKmh: Number(runtime.speedKmh.toFixed(1)),
      mode: runtime.mode,
      active: runtime.active,
      nextStopId: runtime.stops[runtime.nextStopIndex]?.stopId ?? '',
      etaToStops: computeEtaToStops(runtime.distanceKm, {
        stopDistances: runtime.stops,
        totalKm: runtime.totalKm,
        speedKmh: Math.max(runtime.speedKmh, SIM.SPEED_MIN_KMH),
        dwellAvgS: (SIM.DWELL_MIN_S + SIM.DWELL_MAX_S) / 2,
      }),
    }))
  }

  reset(): void {
    // Selalu kembali ke data seed, bukan armada hasil CRUD admin.
    this.buses.splice(0, this.buses.length, ...BUSES.map((bus) => ({ ...bus })))
    this.runtimes = []
    this.paused = false
    this.speedMultiplier = SIM.DEFAULT_SPEED_MULTIPLIER
    this.rebuildRuntimes()
    for (const runtime of this.runtimes) {
      if (runtime.active) {
        publish('bus:started', { busId: runtime.bus.id, ts: Date.now() })
        publish('bus:position', this.buildPosition(runtime, Date.now()))
      }
    }
  }
}
