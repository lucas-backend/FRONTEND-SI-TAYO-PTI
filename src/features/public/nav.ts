import { Clock, Map, User, Bus } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface PublicNavItem {
  to: string
  label: string
  icon: LucideIcon
}

export const PUBLIC_NAV: PublicNavItem[] = [
  { to: '/', label: 'Peta Rute', icon: Map },
  { to: '/jadwal', label: 'Jadwal Halte', icon: Clock },
  { to: '/armada', label: 'Armada', icon: Bus },
  { to: '/civitas', label: 'Civitas', icon: User },
]
