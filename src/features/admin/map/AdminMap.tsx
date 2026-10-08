import { useEffect } from 'react'
import type { RefObject } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import * as L from 'leaflet'
import { MAP_CONFIG } from '@/config'
import { useStops } from '@/hooks/useSimulation'
import { RouteLayer } from '@/features/public/map/RouteLayer'
import { StopLayer } from '@/features/public/map/StopLayer'
import { BusLayer } from '@/features/public/map/BusLayer'
import { GeofenceLayer } from './GeofenceLayer'
import { BusTrailLayer } from './BusTrailLayer'

function MapBridge({ mapRef }: { mapRef: RefObject<L.Map | null> }) {
  const map = useMap()
  useEffect(() => {
    mapRef.current = map
    return () => {
      mapRef.current = null
    }
  }, [map, mapRef])
  return null
}

interface AdminMapProps {
  activeRouteId: string | null
  selectedBusId: string | null
  onSelectBus: (busId: string) => void
  mapRef: RefObject<L.Map | null>
}

/** Peta Monitor Langsung: semua bus + geofence kampus + jejak bus terpilih. */
export function AdminMap({ activeRouteId, selectedBusId, onSelectBus, mapRef }: AdminMapProps) {
  const stops = useStops()

  const onSelectStop = (stopId: string) => {
    const stop = stops.find((item) => item.id === stopId)
    if (stop) mapRef.current?.flyTo([stop.lat, stop.lng], 17, { duration: 0.8 })
  }

  return (
    <MapContainer
      center={[MAP_CONFIG.center[0], MAP_CONFIG.center[1]]}
      zoom={MAP_CONFIG.zoom}
      minZoom={MAP_CONFIG.minZoom}
      maxZoom={MAP_CONFIG.maxZoom}
      maxBounds={[
        [MAP_CONFIG.maxBounds[0][0], MAP_CONFIG.maxBounds[0][1]],
        [MAP_CONFIG.maxBounds[1][0], MAP_CONFIG.maxBounds[1][1]],
      ]}
      maxBoundsViscosity={0.8}
      zoomControl={false}
      attributionControl
      className="h-full w-full"
    >
      <TileLayer url={MAP_CONFIG.tileUrl} attribution={MAP_CONFIG.attribution} className="bus-tile-light" />
      <MapBridge mapRef={mapRef} />
      <RouteLayer activeRouteId={activeRouteId} />
      <GeofenceLayer />
      <StopLayer selectedBusId={selectedBusId} onSelectStop={onSelectStop} />
      <BusTrailLayer busId={selectedBusId} />
      <BusLayer selectedBusId={selectedBusId} onSelectBus={onSelectBus} routeId={activeRouteId} />
    </MapContainer>
  )
}
