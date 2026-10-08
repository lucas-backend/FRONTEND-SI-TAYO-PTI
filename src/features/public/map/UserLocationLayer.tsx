import { Marker, Polyline } from 'react-leaflet'
import * as L from 'leaflet'
import { useUserStore } from '@/store/useUserStore'
import { usePersonalEta } from '../hooks/usePersonalEta'
import { buildUserPinHtml } from './icons'

/**
 * Layer posisi pengguna: pin biru (dapat diseret pada Posisi Simulasi) dan
 * garis putus abu dari pengguna ke halte terdekat (BRIEF 9.4).
 */
export function UserLocationLayer() {
  const location = useUserStore((state) => state.location)
  const simulationMode = useUserStore((state) => state.simulationMode)
  const setLocation = useUserStore((state) => state.setLocation)
  const { nearest } = usePersonalEta(location)

  if (!location) return null

  const icon = L.divIcon({
    className: 'user-pin-icon',
    html: buildUserPinHtml(simulationMode),
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  })
  const target: [number, number] | null = nearest ? [nearest.stop.lat, nearest.stop.lng] : null

  return (
    <>
      {target && (
        <Polyline
          positions={[location, target]}
          pathOptions={{ color: '#5B6074', weight: 2, dashArray: '5 8', opacity: 0.75 }}
        />
      )}
      <Marker
        position={location}
        draggable={simulationMode}
        icon={icon}
        keyboard={false}
        zIndexOffset={800}
        eventHandlers={{
          dragend: (event) => {
            const point = (event.target as L.Marker).getLatLng()
            setLocation([point.lat, point.lng], 'simulation')
          },
        }}
      />
    </>
  )
}
