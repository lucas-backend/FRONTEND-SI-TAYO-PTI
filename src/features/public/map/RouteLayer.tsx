import { Fragment, memo } from 'react'
import { CircleMarker, Polyline, Tooltip } from 'react-leaflet'
import { useRoutes } from '@/hooks/useSimulation'

interface RouteLayerProps {
  /** `null` berarti semua rute ditampilkan aktif (dipakai Monitor admin). */
  activeRouteId: string | null
}

/** Layer rute statis. Dipisah dari layer bus agar tidak ikut render tiap tick. */
export const RouteLayer = memo(function RouteLayer({ activeRouteId }: RouteLayerProps) {
  const routes = useRoutes()
  const debug = new URLSearchParams(window.location.search).get('debug') === '1'
  return (
    <>
      {routes.map((route) => {
        const active = activeRouteId === null || route.id === activeRouteId
        return (
          <Fragment key={route.id}>
          <Polyline
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
          {debug && route.path.map((point, index) => (
              <CircleMarker key={`${route.id}-debug-${index}`} center={point} radius={3} pathOptions={{ color: '#dc2626', fillColor: '#dc2626', fillOpacity: 0.9 }}>
                <Tooltip>{route.code} titik mentah #{index + 1} · jarak ke garis 0 m</Tooltip>
              </CircleMarker>
            ))}
          </Fragment>
        )
      })}
    </>
  )
})
