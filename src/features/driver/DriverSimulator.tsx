import { useEffect } from 'react'
import { useDriverStore } from '@/store/useDriverStore'
import { LoginPanel } from './LoginPanel'
import { StandbyPanel } from './StandbyPanel'
import { TrackingPanel } from './TrackingPanel'

/**
 * Mesin status simulator supir: Login -> Panel Standby -> Panel Tracking Aktif,
 * mengikuti tiga gambar acuan di docs/design.
 */
export function DriverSimulator() {
  const restore = useDriverStore((state) => state.restore)
  const user = useDriverStore((state) => state.user)
  const tracking = useDriverStore((state) => state.tracking)

  useEffect(() => {
    void restore()
  }, [restore])

  if (!user) return <LoginPanel />
  if (tracking) return <TrackingPanel />
  return <StandbyPanel />
}
