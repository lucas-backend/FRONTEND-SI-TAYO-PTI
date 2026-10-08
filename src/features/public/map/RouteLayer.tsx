import { memo } from 'react'
import { Polyline } from 'react-leaflet'
import { useRoutes } from '@/hooks/useSimulation'

interface RouteLayerProps {
  /** `null` berarti semua rute ditampilkan aktif (dipakai Monitor admin). */
  activeRouteId: string | null
}

/** Layer rute statis. Dipisah dari layer bus agar tidak ikut render tiap tick. */
export const RouteLayer = memo(function RouteLayer({ activeRouteId }: RouteLayerProps) {
  const routes = useRoutes()
  return (
    <>
      {routes.map((route) => {
        const active = activeRouteId === null || route.id === activeRouteId
        return (
          <Polyline
            key={route.id}
            positions={route.path}
            pathOptions={{
              color: route.color,
              weight: active ? 5 : 3,
              opacity: active ? 0.95 : 0.2,
              dashArray: route.dashed ? '10 12' : undefined,
              lineCap: 'round',
              lineJoin: 'round',
            }}
          />
        )
      })}
    </>
  )
})
