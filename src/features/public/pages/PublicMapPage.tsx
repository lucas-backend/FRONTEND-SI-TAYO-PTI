import { useCallback, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import * as L from 'leaflet'
import { X } from 'lucide-react'
import type { RouteCode } from '@/api/types'
import { Sheet } from '@/components/ui'
import type { SheetSnap } from '@/components/ui'
import {
  useBuses,
  useConnection,
  useLastUpdated,
  usePositions,
  useRoutes,
  useSimError,
  useSimHydrated,
  useSimLoading,
  useStops,
  useStopMap,
  useLoadSim,
} from '@/hooks/useSimulation'
import { useSimStore } from '@/store/useSimStore'
import { useUserStore } from '@/store/useUserStore'
import { MapView } from '../map/MapView'
import { RouteControls } from '../components/RouteControls'
import { MapHintToast } from '../components/MapHintToast'
import { SchematicToggle } from '../components/SchematicToggle'
import { ConnectionBanner } from '../components/ConnectionBanner'
import { BusDetailContent } from '../components/BusDetailContent'
import { BusCard } from '../components/BusCard'
import { EmptyBusesState, ErrorState, PanelSkeleton } from '../components/StateViews'
import { useRouteProjection } from '../hooks/useRouteProjection'
import { usePersonalEta } from '../hooks/usePersonalEta'
import { UserLocationControl } from '../components/UserLocationControl'
import { NearestStopChip } from '../components/NearestStopChip'
import { FastestBusCard } from '../components/FastestBusCard'
import { cn } from '@/lib/cn'

export function PublicMapPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedBusId = searchParams.get('bus')

  const routes = useRoutes()
  const stops = useStops()
  const buses = useBuses()
  const positions = usePositions()
  const connected = useConnection()
  const lastUpdatedTs = useLastUpdated()
  const loading = useSimLoading()
  const hydrated = useSimHydrated()
  const error = useSimError()
  const load = useLoadSim()
  const stopMap = useStopMap()
  const userLocation = useUserStore((state) => state.location)
  const { nearest, fastest } = usePersonalEta(userLocation)

  const [activeRouteId, setActiveRouteId] = useState<RouteCode>('J1')
  const [targetSelection, setTargetSelection] = useState<{ busId: string | null; stopId: string | null }>({
    busId: null,
    stopId: null,
  })
  const [sheetSnap, setSheetSnap] = useState<SheetSnap>('half')
  const [hintDismissed, setHintDismissed] = useState(false)
  const [schematic, setSchematic] = useState(false)
  const mapRef = useRef<L.Map | null>(null)

  const routeMap = useMemo(() => new Map(routes.map((route) => [route.id, route])), [routes])
  const activeRoute = routeMap.get(activeRouteId)
  const activeBusCount = Object.keys(positions).length

  const selectedBus = selectedBusId ? buses.find((bus) => bus.id === selectedBusId) : undefined
  const selectedPosition = selectedBusId ? positions[selectedBusId] : undefined
  const selectedRoute = selectedBus ? routeMap.get(selectedBus.routeId) : undefined
  const projection = useRouteProjection(selectedRoute, stops)
  const targetStopId = targetSelection.busId === selectedBusId ? targetSelection.stopId : null

  const openBus = useCallback(
    (busId: string) => {
      setHintDismissed(true)
      setSheetSnap('half')
      setSearchParams({ bus: busId })
    },
    [setSearchParams],
  )

  const closeSheet = useCallback(() => {
    setTargetSelection({ busId: null, stopId: null })
    setSearchParams({}, { replace: true })
  }, [setSearchParams])

  const onSelectStop = useCallback(
    (stopId: string) => {
      const stop = stopMap.get(stopId)
      if (stop && mapRef.current) {
        mapRef.current.flyTo([stop.lat, stop.lng], 17, { duration: 1 })
      }
      if (selectedBusId) {
        setTargetSelection({ busId: selectedBusId, stopId })
        return
      }
      const { buses: currentBuses, positions: currentPositions } = useSimStore.getState()
      const candidate = currentBuses.find((bus) => {
        const route = routeMap.get(bus.routeId)
        return route?.stopIds.includes(stopId) && Boolean(currentPositions[bus.id])
      })
      if (candidate) {
        setTargetSelection({ busId: candidate.id, stopId })
        openBus(candidate.id)
      } else {
        setTargetSelection({ busId: null, stopId })
      }
    },
    [stopMap, selectedBusId, routeMap, openBus],
  )

  const onMapClick = useCallback(() => {
    if (selectedBusId) closeSheet()
  }, [selectedBusId, closeSheet])

  const showError = Boolean(error) && !hydrated
  const detailReady = Boolean(selectedBus && selectedPosition && selectedRoute)

  return (
    <div className="flex h-full min-h-0 flex-col md:flex-row">
      <aside className="flex shrink-0 flex-col gap-3 p-4 md:h-full md:w-[400px] md:overflow-y-auto md:border-r md:border-line">
        <RouteControls
          route={activeRoute}
          activeRouteId={activeRouteId}
          onRouteChange={setActiveRouteId}
          activeBusCount={activeBusCount}
          loading={loading && !hydrated}
        />

        <div className="hidden md:flex md:flex-col md:gap-3">
          {nearest && fastest && <FastestBusCard nearest={nearest} fastest={fastest} />}
          {showError ? (
            <ErrorState message={error ?? ''} onRetry={() => void load()} />
          ) : !hydrated ? (
            <PanelSkeleton />
          ) : detailReady && selectedBus && selectedPosition && selectedRoute ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Detail Bus</p>
                <button
                  type="button"
                  onClick={closeSheet}
                  aria-label="Tutup detail"
                  className="flex h-7 w-7 items-center justify-center rounded-full text-muted hover:bg-primary-soft hover:text-ink"
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </div>
              <BusDetailContent
                key={selectedBus.id}
                bus={selectedBus}
                route={selectedRoute}
                position={selectedPosition}
                stopMap={stopMap}
                projection={projection}
                targetStopId={targetStopId}
                onSelectStop={onSelectStop}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Armada Aktif</p>
              {activeBusCount === 0 ? (
                <EmptyBusesState />
              ) : (
                buses
                  .filter((bus) => Boolean(positions[bus.id]))
                  .map((bus) => (
                    <BusCard
                      key={bus.id}
                      bus={bus}
                      route={routeMap.get(bus.routeId)}
                      position={positions[bus.id]}
                      onSelect={openBus}
                      selected={bus.id === selectedBusId}
                    />
                  ))
              )}
            </div>
          )}
        </div>
      </aside>

      <div className="relative min-h-0 flex-1">
        {!connected && <ConnectionBanner lastUpdatedTs={lastUpdatedTs} />}
        <MapView
          activeRouteId={activeRouteId}
          selectedBusId={selectedBusId}
          onSelectBus={openBus}
          onSelectStop={onSelectStop}
          onMapClick={onMapClick}
          mapRef={mapRef}
          schematic={schematic}
        />
        <SchematicToggle
          active={schematic}
          onToggle={() => setSchematic((value) => !value)}
        />
        {nearest && (
          <div className={cn('absolute inset-x-0 z-20', connected ? 'top-3' : 'top-14')}>
            <NearestStopChip nearest={nearest} />
          </div>
        )}
        <UserLocationControl className="bottom-3 right-3" />
        {nearest && fastest && (
          <div className="absolute inset-x-3 bottom-[4.5rem] z-20 md:hidden">
            <FastestBusCard nearest={nearest} fastest={fastest} />
          </div>
        )}
        <MapHintToast
          visible={!hintDismissed && !selectedBusId && activeBusCount > 0 && !fastest}
          onAction={() => setHintDismissed(true)}
        />
        {hydrated && activeBusCount === 0 && (
          <div className="absolute inset-x-3 bottom-20 z-20 md:hidden">
            <EmptyBusesState />
          </div>
        )}
      </div>

      <div className="md:hidden">
        <Sheet
          open={Boolean(detailReady)}
          snap={sheetSnap}
          onSnapChange={setSheetSnap}
          onClose={closeSheet}
        >
          {detailReady && selectedBus && selectedPosition && selectedRoute ? (
            <BusDetailContent
              key={selectedBus.id}
              bus={selectedBus}
              route={selectedRoute}
              position={selectedPosition}
              stopMap={stopMap}
              projection={projection}
              targetStopId={targetStopId}
              onSelectStop={onSelectStop}
            />
          ) : null}
        </Sheet>
      </div>
    </div>
  )
}
