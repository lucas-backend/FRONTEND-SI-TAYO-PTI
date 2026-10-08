import { memo, useEffect } from 'react'
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import * as L from 'leaflet'
import type { RefObject } from 'react'
import { MAP_CONFIG } from '@/config'
import { cn } from '@/lib/cn'
import { RouteLayer } from './RouteLayer'
import { StopLayer } from './StopLayer'
import { BusLayer } from './BusLayer'
import { SchematicLayer } from './SchematicLayer'

interface MapBridgeProps {
  mapRef: RefObject<L.Map | null>
}

function MapBridge({ mapRef }: MapBridgeProps) {
  const map = useMap()
  useEffect(() => {
    mapRef.current = map
    return () => {
      mapRef.current = null
    }
  }, [map, mapRef])
  return null
}

function MapClickHandler({ onClick }: { onClick: () => void }) {
  useMapEvents({ click: () => onClick() })
  return null
}

export interface MapViewProps {
  activeRouteId: string
  selectedBusId: string | null
  onSelectBus: (busId: string) => void
  onSelectStop: (stopId: string) => void
  onMapClick?: () => void
  mapRef: RefObject<L.Map | null>
  schematic: boolean
  className?: string
}

/**
 * Peta publik: rute & halte (statis) terpisah dari marker bus (dinamis).
 * MapContainer tidak ikut render ulang saat posisi bus berubah.
 */
export const MapView = memo(function MapView({
  activeRouteId,
  selectedBusId,
  onSelectBus,
  onSelectStop,
  onMapClick,
  mapRef,
  schematic,
  className,
}: MapViewProps) {
  return (
    <div className={cn('relative isolate h-full w-full overflow-hidden', className)}>
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
        className={cn('h-full w-full', schematic && 'schematic-mode')}
      >
        <TileLayer url={MAP_CONFIG.tileUrl} attribution={MAP_CONFIG.attribution} className="bus-tile-light" />
        <MapBridge mapRef={mapRef} />
        {onMapClick && <MapClickHandler onClick={onMapClick} />}
        <RouteLayer activeRouteId={activeRouteId} />
        <StopLayer selectedBusId={selectedBusId} onSelectStop={onSelectStop} />
        <BusLayer selectedBusId={selectedBusId} onSelectBus={onSelectBus} />
        {schematic && <SchematicLayer />}
      </MapContainer>
    </div>
  )
})
