import { create } from 'zustand'
import type { LatLng } from '@/lib/geo'
import { PERSONAL } from '@/config'

export type UserLocationSource = 'gps' | 'simulation'

export type UserLocationStatus = 'idle' | 'locating' | 'active' | 'denied' | 'out-of-area' | 'unsupported'

export interface UserReminder {
  id: string
  stopId: string
  busId: string | null
  thresholdMin: number
  createdAt: number
  triggered: boolean
}

interface UserState {
  location: LatLng | null
  source: UserLocationSource | null
  status: UserLocationStatus
  simulationMode: boolean
  reminders: UserReminder[]
  setStatus: (status: UserLocationStatus) => void
  setLocation: (location: LatLng, source: UserLocationSource) => void
  clearLocation: () => void
  setSimulationMode: (on: boolean) => void
  addReminder: (input: { stopId: string; busId: string | null; thresholdMin?: number }) => string
  removeReminder: (id: string) => void
  markTriggered: (id: string) => void
  reset: () => void
}

let reminderSeq = 0

function newReminderId(): string {
  reminderSeq += 1
  return `rmd-${Date.now().toString(36)}-${reminderSeq}`
}

export const useUserStore = create<UserState>((set) => ({
  location: null,
  source: null,
  status: 'idle',
  simulationMode: false,
  reminders: [],

  setStatus(status) {
    set({ status })
  },

  setLocation(location, source) {
    set({ location, source, status: 'active' })
  },

  clearLocation() {
    set({ location: null, source: null, status: 'idle' })
  },

  setSimulationMode(on) {
    set({ simulationMode: on })
  },

  addReminder({ stopId, busId, thresholdMin }) {
    const id = newReminderId()
    const reminder: UserReminder = {
      id,
      stopId,
      busId,
      thresholdMin: thresholdMin ?? PERSONAL.REMINDER_THRESHOLD_MIN,
      createdAt: Date.now(),
      triggered: false,
    }
    set((state) => ({ reminders: [...state.reminders, reminder] }))
    return id
  },

  removeReminder(id) {
    set((state) => ({ reminders: state.reminders.filter((reminder) => reminder.id !== id) }))
  },

  markTriggered(id) {
    set((state) => ({
      reminders: state.reminders.map((reminder) =>
        reminder.id === id ? { ...reminder, triggered: true } : reminder,
      ),
    }))
  },

  reset() {
    set({ location: null, source: null, status: 'idle', simulationMode: false, reminders: [] })
  },
}))

export function hasReminder(state: UserState, stopId: string, busId: string | null): boolean {
  return state.reminders.some(
    (reminder) => reminder.stopId === stopId && (busId === null || reminder.busId === busId) && !reminder.triggered,
  )
}
