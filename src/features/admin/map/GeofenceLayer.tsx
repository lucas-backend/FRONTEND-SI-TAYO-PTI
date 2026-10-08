import { useMemo } from 'react'
import { Polygon } from 'react-leaflet'
import { convex, featureCollection, point } from '@turf/turf'
import type { Feature, Polygon as GeoPolygon } from 'geojson'
import { useRoutes } from '@/hooks/useSimulation'
import type { LatLng } from '@/lib/geo'

/** Poligon geofence kampus: convex hull dari seluruh titik rute (transparan). */
export function GeofenceLayer() {
  const routes = useRoutes()

  const polygon = useMemo<LatLng[] | null>(() => {
    const coordinates = routes.flatMap((route) => route.path)
    if (coordinates.length < 3) return null
    const hull = convex(featureCollection(coordinates.map(([lat, lng]) => point([lng, lat])))) as
      | Feature<GeoPolygon>
      | null
    if (!hull) return null
    return hull.geometry.coordinates[0].map(([lng, lat]) => [lat, lng] as LatLng)
  }, [routes])

  if (!polygon) return null

  return (
    <Polygon
      positions={polygon}
      pathOptions={{
        color: 'var(--primary)',
        weight: 1.5,
        opacity: 0.6,
        fillColor: 'var(--primary)',
        fillOpacity: 0.06,
        dashArray: '6 8',
      }}
      interactive={false}
    />
  )
}
