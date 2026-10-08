import { simulator } from './instance'
import { useSimStore } from '@/store/useSimStore'

const LEADER_KEY = 'bus-unila:leader-ts'
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

function readLeaderTs(): number {
  if (!storageAvailable()) return 0
  const raw = localStorage.getItem(LEADER_KEY)
  const value = raw ? Number(raw) : 0
  return Number.isFinite(value) ? value : 0
}

function claimLeadership(): boolean {
  if (!storageAvailable()) {
    isLeader = true
    return true
  }
  if (now() - readLeaderTs() < STALE_MS) {
    isLeader = false
    return false
  }
  localStorage.setItem(LEADER_KEY, String(now()))
  isLeader = true
  return true
}

function startHeartbeat(): void {
  if (heartbeat !== null) return
  heartbeat = window.setInterval(() => {
    if (isLeader) {
      if (storageAvailable()) localStorage.setItem(LEADER_KEY, String(now()))
      return
    }
    const stale = now() - readLeaderTs() > STALE_MS
    if (stale && claimLeadership()) simulator.start()
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
  if (heartbeat !== null) {
    window.clearInterval(heartbeat)
    heartbeat = null
  }
  started = false
}
