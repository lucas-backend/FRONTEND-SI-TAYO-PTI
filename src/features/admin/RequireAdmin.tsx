import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAdminStore } from '@/store/useAdminStore'

/** Route guard: hanya sesi role ADMIN yang boleh melewati. */
export function RequireAdmin({ children }: { children: ReactNode }) {
  const user = useAdminStore((state) => state.user)
  const location = useLocation()

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }
  return <>{children}</>
}
