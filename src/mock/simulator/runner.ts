import { simulator } from './instance'
import { useSimStore } from '@/store/useSimStore'

const LEADER_TS_KEY = 'bus-unila:leader-ts'
const LEADER_OWNER_KEY = 'bus-unila:leader-owner'
const TAB_ID_KEY = 'bus-unila:tab-id'
const HEARTBEAT_MS = 2000
const STALE_MS = 6000

let started = false
let isLeader = false
let heartbeat: number | null = null

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
 */
export function startSimulation(): void {
  if (started) return
  started = true
  const store = useSimStore.getState()
  void store.load()
  store.bind()
  if (claimLeadership() && !simulator.isRunning()) simulator.start()
  startHeartbeat()
}

export function stopSimulation(): void {
  simulator.stop()
  // Lepas kepemimpinan agar tab lain bisa mengambil alih dan agar efek
  // StrictMode (mount-unmount-mount) dapat mengklaim ulang pada mount berikutnya.
  releaseLeadership()
  if (heartbeat !== null) {
    window.clearInterval(heartbeat)
    heartbeat = null
  }
  started = false
}
