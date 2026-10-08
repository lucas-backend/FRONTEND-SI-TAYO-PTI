import { useMemo } from 'react'
import { useBuses, usePositions, useRoutes } from '@/hooks/useSimulation'
import { BusMarker } from './BusMarker'

interface BusLayerProps {
  selectedBusId: string | null
  onSelectBus: (busId: string) => void
}

/** Layer bus dinamis: satu marker per bus yang sedang beroperasi. */
export function BusLayer({ selectedBusId, onSelectBus }: BusLayerProps) {
  const positions = usePositions()
  const buses = useBuses()
  const routes = useRoutes()

  const routeMap = useMemo(() => new Map(routes.map((route) => [route.id, route])), [routes])
  const busMap = useMemo(() => new Map(buses.map((bus) => [bus.id, bus])), [buses])

  return (
    <>
      {Object.values(positions).map((position) => {
        const bus = busMap.get(position.busId)
        const route = bus ? routeMap.get(bus.routeId) : undefined
        if (!bus || !route) return null
        return (
          <BusMarker
            key={position.busId}
            bus={bus}
            route={route}
            position={position}
            selected={position.busId === selectedBusId}
            onSelect={onSelectBus}
          />
        )
      })}
    </>
  )
}
