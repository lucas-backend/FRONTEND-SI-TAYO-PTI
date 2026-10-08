import type { ComponentType } from 'react'
import { Bus, LayoutDashboard, Radio, Route, Users } from 'lucide-react'

export interface AdminNavItem {
  to: string
  label: string
  icon: ComponentType<{ className?: string }>
}

export const ADMIN_NAV: AdminNavItem[] = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/monitor', label: 'Monitor Langsung', icon: Radio },
  { to: '/admin/armada', label: 'Armada', icon: Bus },
  { to: '/admin/rute-halte', label: 'Rute & Halte', icon: Route },
  { to: '/admin/akun', label: 'Akun', icon: Users },
]
