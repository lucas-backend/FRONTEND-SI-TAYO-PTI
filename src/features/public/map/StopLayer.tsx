import { memo } from 'react'
import { Marker } from 'react-leaflet'
import * as L from 'leaflet'
import { useSimStore } from '@/store/useSimStore'
import { useStops } from '@/hooks/useSimulation'
import { buildStopIconHtml } from './icons'

interface StopLayerProps {
  selectedBusId: string | null
  onSelectStop: (stopId: string) => void
}

export const StopLayer = memo(function StopLayer({ selectedBusId, onSelectStop }: StopLayerProps) {
  const stops = useStops()
  // Selector primitif: layer hanya render ulang saat halte berikutnya berubah.
  const nextStopId = useSimStore((state) =>
    selectedBusId ? (state.positions[selectedBusId]?.nextStopId ?? null) : null,
  )

  return (
    <>
      {stops.map((stop) => (
        <Marker
          key={stop.id}
          position={[stop.lat, stop.lng]}
          icon={L.divIcon({
            className: 'bus-stop-icon',
            html: buildStopIconHtml(stop.name, stop.id === nextStopId),
            iconSize: [0, 0],
            iconAnchor: [0, 0],
          })}
          eventHandlers={{
            click: (event) => {
              L.DomEvent.stopPropagation(event.originalEvent)
              onSelectStop(stop.id)
            },
          }}
          zIndexOffset={500}
        />
      ))}
    </>
  )
})
