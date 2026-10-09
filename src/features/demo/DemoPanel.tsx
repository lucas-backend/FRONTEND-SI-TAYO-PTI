import { useEffect, useMemo, useState } from 'react'
import { Pause, Play, RotateCcw, Signal, Square, UserRound, X, Zap } from 'lucide-react'
import { DEMO_MODE, DRIVER, SIM, type SpeedMultiplier } from '@/config'
import { api } from '@/api/client'
import { gateway } from '@/realtime'
import { useBuses, useRoutes } from '@/hooks/useSimulation'
import { useUserStore } from '@/store/useUserStore'
import { USER_PRESETS } from '@/features/public/lib/userPresets'
import { useToast } from '@/components/ui'

export function DemoPanel() {
  const buses = useBuses()
  const routes = useRoutes()
  const setUserLocation = useUserStore((state) => state.setLocation)
  const [open, setOpen] = useState(true)
  const [paused, setPaused] = useState(false)
  const [speed, setSpeed] = useState<SpeedMultiplier>(SIM.DEFAULT_SPEED_MULTIPLIER)
  const [selectedBusId, setSelectedBusId] = useState<string>(DRIVER.demoBusId)
  const [busy, setBusy] = useState(false)
  const { show } = useToast()

  useEffect(() => {
    if (!DEMO_MODE) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.shiftKey && event.key.toLowerCase() === 'd') {
        event.preventDefault()
        setOpen((value) => !value)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (!DEMO_MODE) return
    return gateway.subscribe('demo:user-location', (event) => setUserLocation(event.location, 'simulation'))
  }, [setUserLocation])

  const selectedBus = buses.find((bus) => bus.id === selectedBusId) ?? buses.find((bus) => bus.status === 'ACTIVE')
  const activeRoutes = useMemo(() => routes.filter((route) => route.active), [routes])
  if (!DEMO_MODE || !open) return null

  const run = async (action: () => Promise<void>) => {
    setBusy(true)
    try {
      await action()
    } catch (error) {
      show(error instanceof Error ? error.message : 'Aksi panel demo gagal', { tone: 'danger' })
    } finally {
      setBusy(false)
    }
  }

  const addBus = async (routeId: string) => {
    await api.createBus({
      plate: `BE ${3000 + buses.length} UZ`,
      label: `Bus Demo ${buses.length + 1}`,
      routeId,
      driverId: buses[0]?.driverId ?? 'drv-bambang',
      capacity: 28,
      active: true,
    })
  }

  return (
    <aside className="fixed bottom-4 right-4 z-[2000] w-[min(360px,calc(100vw-2rem))] rounded-3xl border border-line bg-surface/95 p-4 shadow-[var(--shadow-lg)] backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <div><p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-primary">Panel demo</p><p className="text-xs text-muted">Shift+D untuk sembunyikan</p></div>
        <button type="button" aria-label="Sembunyikan panel demo" className="rounded-full p-2 text-muted hover:bg-primary-soft hover:text-ink" onClick={() => setOpen(false)}><X className="h-4 w-4" aria-hidden /></button>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {([1, 2, 5] as const).map((value) => <button key={value} type="button" disabled={busy} className={`rounded-xl px-2 py-2 text-xs font-bold ${speed === value ? 'bg-primary text-white' : 'bg-primary-soft text-primary'}`} onClick={() => void run(async () => { setSpeed(value); await api.setSimulationSpeed(value) })}><Zap className="mr-1 inline h-3 w-3" aria-hidden />{value}x</button>)}
      </div>
      <button type="button" disabled={busy} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-bg px-3 py-2 text-sm font-bold text-ink" onClick={() => void run(async () => { const next = !paused; setPaused(next); await api.setSimulationPaused(next) })}>{paused ? <Play className="h-4 w-4" aria-hidden /> : <Pause className="h-4 w-4" aria-hidden />}{paused ? 'Lanjutkan semua bus' : 'Jeda semua bus'}</button>
      <div className="mt-3 grid grid-cols-2 gap-2">{activeRoutes.map((route) => <button key={route.id} type="button" disabled={busy} className="rounded-xl bg-bg px-2 py-2 text-xs font-semibold text-ink" onClick={() => void run(() => addBus(route.id))}>+ Bus {route.code}</button>)}</div>
      <label className="mt-3 block text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted">Bus sasaran<select className="mt-1 h-9 w-full rounded-xl border border-line bg-bg px-2 text-sm font-semibold text-ink" value={selectedBus?.id ?? ''} onChange={(event) => setSelectedBusId(event.target.value)}>{buses.map((bus) => <option key={bus.id} value={bus.id}>{bus.label} · {bus.status}</option>)}</select></label>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <button type="button" disabled={busy || !selectedBus} className="rounded-xl bg-success-soft px-2 py-2 text-xs font-bold text-success" onClick={() => void run(() => api.setCapacity(selectedBus?.id ?? '', 'AVAILABLE'))}>Tersedia</button>
        <button type="button" disabled={busy || !selectedBus} className="rounded-xl bg-danger-soft px-2 py-2 text-xs font-bold text-danger" onClick={() => void run(() => api.setCapacity(selectedBus?.id ?? '', 'FULL'))}>Penuh</button>
        <button type="button" disabled={busy || !selectedBus} className="rounded-xl bg-warning-soft px-2 py-2 text-xs font-bold text-ink" onClick={() => void run(() => api.simulateSignalLoss(selectedBus?.id ?? '', SIM.OFFLINE_SECONDS))}><Signal className="mr-1 inline h-3 w-3" aria-hidden />Putus 20 dtk</button>
        <button type="button" disabled={busy || !selectedBus} className="rounded-xl bg-bg px-2 py-2 text-xs font-bold text-ink" onClick={() => void run(() => api.simulateGeofenceExit(selectedBus?.id ?? '', SIM.OFFLINE_SECONDS))}>Keluar area</button>
        <button type="button" disabled={busy || !selectedBus} className="col-span-2 rounded-xl bg-danger px-2 py-2 text-xs font-bold text-white" onClick={() => void run(() => api.stopTracking(selectedBus?.id ?? ''))}><Square className="mr-1 inline h-3 w-3" aria-hidden />Hentikan bus</button>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">{USER_PRESETS.map((preset) => <button key={preset.id} type="button" disabled={busy} className="rounded-full bg-primary-soft px-2.5 py-1.5 text-[11px] font-bold text-primary" onClick={() => void run(() => api.setDemoUserLocation({ location: preset.location, label: preset.label }))}><UserRound className="mr-1 inline h-3 w-3" aria-hidden />{preset.label}</button>)}</div>
      <button type="button" disabled={busy} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-bg px-3 py-2 text-xs font-bold text-muted hover:text-danger" onClick={() => { if (window.confirm('Reset semua perubahan data demo?')) void run(() => api.resetDemo()) }}><RotateCcw className="h-3.5 w-3.5" aria-hidden />Reset Data Demo</button>
    </aside>
  )
}
