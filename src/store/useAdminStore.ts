import { create } from 'zustand'
import type { User } from '@/api/types'
import { api } from '@/api/client'

/** Sesi admin terpisah dari sesi supir (`bus-unila:driver-session`). */
const SESSION_KEY = 'bus-unila:admin-session'

interface StoredSession {
  token: string
  user: User
}

interface AdminState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
  login: (username: string, pin: string) => Promise<boolean>
  logout: () => void
}

function readSession(): StoredSession | null {
  if (typeof localStorage === 'undefined') return null
  const raw = localStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as StoredSession
    if (!parsed?.token || parsed.user?.role !== 'ADMIN') return null
    return parsed
  } catch {
    return null
  }
}

function writeSession(session: StoredSession | null): void {
  if (typeof localStorage === 'undefined') return
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  else localStorage.removeItem(SESSION_KEY)
}

const initial = readSession()

export const useAdminStore = create<AdminState>((set) => ({
  user: initial?.user ?? null,
  token: initial?.token ?? null,
  loading: false,
  error: null,

  async login(username, pin) {
    set({ loading: true, error: null })
    try {
      const session = await api.login({ username, pin })
      if (session.role !== 'ADMIN') {
        set({ loading: false, error: 'Akun ini bukan akun admin.' })
        return false
      }
      writeSession({ token: session.token, user: session.user })
      set({ user: session.user, token: session.token, loading: false, error: null })
      return true
    } catch (error) {
      set({ loading: false, error: error instanceof Error ? error.message : 'Login gagal' })
      return false
    }
  },

  logout() {
    writeSession(null)
    set({ user: null, token: null, error: null })
  },
}))
