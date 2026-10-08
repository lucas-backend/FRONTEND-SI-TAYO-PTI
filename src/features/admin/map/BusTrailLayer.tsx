import { Polyline } from 'react-leaflet'
import { useBuses, useRoutes, useTrails } from '@/hooks/useSimulation'

/** Jejak 5 menit terakhir bus terpilih (polyline tipis). */
export function BusTrailLayer({ busId }: { busId: string | null }) {
  const trails = useTrails()
  const buses = useBuses()
  const routes = useRoutes()

  if (!busId) return null
  const points = trails[busId]
  if (!points || points.length < 2) return null

  const bus = buses.find((item) => item.id === busId)
  const route = routes.find((item) => item.id === bus?.routeId)

  return (
    <Polyline
      positions={points.map((point) => [point.lat, point.lng] as [number, number])}
      pathOptions={{ color: route?.color ?? 'var(--primary)', weight: 2, opacity: 0.65, dashArray: '2 6', lineCap: 'round' }}
      interactive={false}
    />
  )
}
