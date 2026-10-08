import { useNavigate } from 'react-router-dom'
import { Chip } from '@/components/ui'
import { useBuses, usePositions, useRouteMap, useSimHydrated } from '@/hooks/useSimulation'
import { BusCard } from '../components/BusCard'
import { EmptyBusesState, PanelSkeleton } from '../components/StateViews'

export function FleetPage() {
  const buses = useBuses()
  const routeMap = useRouteMap()
  const positions = usePositions()
  const hydrated = useSimHydrated()
  const navigate = useNavigate()

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto flex max-w-2xl flex-col gap-3 px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-extrabold tracking-[-0.02em] text-ink">Armada</h1>
          <Chip tone="muted">{buses.length} Unit</Chip>
        </div>
        {!hydrated ? (
          <PanelSkeleton />
        ) : buses.length === 0 ? (
          <EmptyBusesState />
        ) : (
          buses.map((bus) => (
            <BusCard
              key={bus.id}
              bus={bus}
              route={routeMap.get(bus.routeId)}
              position={positions[bus.id]}
              onSelect={(id) => navigate(`/?bus=${id}`)}
            />
          ))
        )}
      </div>
    </div>
  )
}
