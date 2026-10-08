import { simulator } from './instance'
import { useSimStore } from '@/store/useSimStore'
import { gateway } from '@/realtime'
import type { BusControlEvent } from '@/realtime'

const LEADER_TS_KEY = 'bus-unila:leader-ts'
const LEADER_OWNER_KEY = 'bus-unila:leader-owner'
const TAB_ID_KEY = 'bus-unila:tab-id'
const HEARTBEAT_MS = 2000
const STALE_MS = 6000

let started = false
let isLeader = false
let heartbeat: number | null = null
let controlUnsub: (() => void) | null = null
let fleetUnsub: (() => void) | null = null

function now(): number {
  return Date.now()
}

function storageAvailable(): boolean {
  return typeof localStorage !== 'undefined'
}

function tabId(): string {
  if (typeof sessionStorage === 'undefined') return 'no-session'
  let id = sessionStorage.getItem(TAB_ID_KEY)
  if (!id) {
    id = Math.random().toString(36).slice(2)
    sessionStorage.setItem(TAB_ID_KEY, id)
  }
  return id
}

function readLeaderTs(): number {
  if (!storageAvailable()) return 0
  const raw = localStorage.getItem(LEADER_TS_KEY)
  const value = raw ? Number(raw) : 0
  return Number.isFinite(value) ? value : 0
}

function claimLeadership(): boolean {
  if (!storageAvailable()) {
    isLeader = true
    return true
  }
  const owner = localStorage.getItem(LEADER_OWNER_KEY)
  const fresh = now() - readLeaderTs() < STALE_MS
  // Tab yang sama (termasuk reload) selalu boleh mengambil kembali kepemimpinan.
  if (owner === tabId() || !fresh) {
    localStorage.setItem(LEADER_TS_KEY, String(now()))
    localStorage.setItem(LEADER_OWNER_KEY, tabId())
    isLeader = true
    return true
  }
  isLeader = false
  return false
}

function releaseLeadership(): void {
  if (isLeader && storageAvailable() && localStorage.getItem(LEADER_OWNER_KEY) === tabId()) {
    localStorage.removeItem(LEADER_TS_KEY)
    localStorage.removeItem(LEADER_OWNER_KEY)
  }
  isLeader = false
}

/** Paksa tab ini menjadi leader meski ada tab lain (dipakai route /demo). */
function forceLeadership(): void {
  if (storageAvailable()) {
    localStorage.setItem(LEADER_TS_KEY, String(now()))
    localStorage.setItem(LEADER_OWNER_KEY, tabId())
  }
  isLeader = true
}

/** Terapkan perintah kontrol supir pada mesin lokal (tab penggerak). */
function applyControl(event: BusControlEvent): void {
  switch (event.action) {
    case 'START':
      simulator.startTracking(event.busId)
      break
    case 'STOP':
      simulator.stopTracking(event.busId)
      break
    case 'CAPACITY':
      simulator.setCapacityFull(event.busId, Boolean(event.full))
      break
    case 'SIGNAL_LOSS':
      simulator.simulateSignalLoss(event.busId, event.seconds)
      break
    case 'RESET':
      simulator.reset()
      break
  }
}

function startHeartbeat(): void {
  if (heartbeat !== null) return
  heartbeat = window.setInterval(() => {
    if (isLeader) {
      localStorage.setItem(LEADER_TS_KEY, String(now()))
      localStorage.setItem(LEADER_OWNER_KEY, tabId())
      return
    }
    if (now() - readLeaderTs() > STALE_MS && claimLeadership()) simulator.start()
  }, HEARTBEAT_MS)
}

/**
 * Nyalakan simulasi saat aplikasi dibuka. Hanya satu tab yang menjadi
 * "leader" penggerak bus; tab lain menerima posisi lewat BroadcastChannel,
 * sehingga simulator supir dan peta publik tetap sinkron.
 *
 * `force` dipakai route /demo (satu tab berisi simulator supir + peta publik)
 * agar mesin pasti berjalan di tab itu tanpa bergantung pada heartbeat.
 */
export function startSimulation(force = false): void {
  if (started) return
  started = true
  const store = useSimStore.getState()
  void store.load().then(() => {
    // Terapkan armada tersimpan (hasil CRUD admin) ke mesin simulasi.
    simulator.syncFleet(useSimStore.getState().buses)
  })
  store.bind()
  const leader = force ? (forceLeadership(), true) : claimLeadership()
  if (leader && !simulator.isRunning()) simulator.start()
  controlUnsub = gateway.subscribe('bus:control', (event) => {
    if (!simulator.isRunning()) return
    applyControl(event)
  })
  fleetUnsub = gateway.subscribe('fleet:changed', (event) => {
    simulator.syncFleet(event.buses)
  })
  startHeartbeat()
}

export function stopSimulation(): void {
  simulator.stop()
  controlUnsub?.()
  controlUnsub = null
  fleetUnsub?.()
  fleetUnsub = null
  // Lepas kepemimpinan agar tab lain bisa mengambil alih dan agar efek
  // StrictMode (mount-unmount-mount) dapat mengklaim ulang pada mount berikutnya.
  releaseLeadership()
  if (heartbeat !== null) {
    window.clearInterval(heartbeat)
    heartbeat = null
  }
  started = false
}
