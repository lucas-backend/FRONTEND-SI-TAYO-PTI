import type { User } from '@/api/types'

/**
 * Akun dummy. Kredensial demo (PIN di sini hanya untuk mock):
 * - admin / admin123    (ADMIN)
 * - superadmin / super123 (ADMIN)
 * - DRV-19842 / 123456  (DRIVER, Bpk. Bambang S.)
 * - DRV-20117 / 123456  (DRIVER, Ibu Sri Wahyuni)
 */
export const USERS: User[] = [
  { id: 'adm-01', name: 'Admin UPT TIK', username: 'admin', role: 'ADMIN', active: true },
  { id: 'adm-02', name: 'Super Admin', username: 'superadmin', role: 'ADMIN', active: true },
  { id: 'drv-bambang', name: 'Bpk. Bambang S.', username: 'DRV-19842', role: 'DRIVER', active: true },
  { id: 'drv-sri', name: 'Ibu Sri Wahyuni', username: 'DRV-20117', role: 'DRIVER', active: true },
]

export const DEMO_CREDENTIALS = {
  admin: { username: 'admin', pin: 'admin123' },
  superadmin: { username: 'superadmin', pin: 'super123' },
  driver: { username: 'DRV-19842', pin: '123456' },
} as const

export function getUserById(id: string): User | undefined {
  return USERS.find((user) => user.id === id)
}

export function getDriverByName(username: string): User | undefined {
  return USERS.find((user) => user.username === username && user.role === 'DRIVER')
}
