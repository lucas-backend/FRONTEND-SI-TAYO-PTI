import { useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react'
import { MapContainer, Marker, Polyline, TileLayer, useMapEvents } from 'react-leaflet'
import * as L from 'leaflet'
import { ChevronLeft, Download, Edit3, GripVertical, MapPin, Plus, Redo2, Save, Trash2, Undo2, Upload } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, Chip, Toggle, useToast } from '@/components/ui'
import { api } from '@/api/client'
import type { Route, Stop } from '@/api/types'
import { useRoutes, useStops } from '@/hooks/useSimulation'
import { MAP_CONFIG } from '@/config'
import { routeLengthKm, distanceMeters, toLngLat, snapPointToPath, distanceAlongRoute } from '@/lib/geo'
import { routeSchema } from '@/features/admin/routeValidation'

function pointIcon(kind: 'route' | 'stop' = 'route') {
  return L.divIcon({
    className: '',
    html: `<span class="${kind === 'stop' ? 'admin-stop-pin' : 'admin-route-pin'}"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  })
}

function MapClick({ onClick }: { onClick: (point: [number, number]) => void }) {
  useMapEvents({ click: (event) => onClick([event.latlng.lat, event.latlng.lng]) })
  return null
}

function MapBridge({ mapRef }: { mapRef: MutableRefObject<L.Map | null> }) {
  const map = useMapEvents({})
  useEffect(() => {
    mapRef.current = map
    return () => {
      mapRef.current = null
    }
  }, [map, mapRef])
  return null
}

const snapToPath = snapPointToPath

function insertOnPath(path: [number, number][], target: [number, number]): [number, number][] {
  if (path.length < 2) return [...path, target]
  let best = 0
  let bestDistance = Number.POSITIVE_INFINITY
  path.slice(0, -1).forEach((point, index) => {
    const a = distanceMeters(point, target)
    const b = distanceMeters(path[index + 1], target)
    if (a + b < bestDistance) {
      bestDistance = a + b
      best = index
    }
  })
  return [...path.slice(0, best + 1), target, ...path.slice(best + 1)]
}

export function RoutesStubPage() {
  const routes = useRoutes()
  const stops = useStops()
  const navigate = useNavigate()
  const [message, setMessage] = useState<string | null>(null)
  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">Konfigurasi layanan</p><h1 className="mt-1 text-2xl font-extrabold tracking-[-0.03em] text-ink">Rute &amp; Halte</h1><p className="mt-1 text-sm text-muted">Atur jalur perjalanan dan titik naik penumpang.</p></div>
        <Button icon={<Plus className="h-4 w-4" />} onClick={() => navigate('/admin/rute-halte/new')}>Tambah Rute</Button>
      </header>
      {message && <div className="mb-4 rounded-2xl bg-danger-soft px-4 py-3 text-sm font-semibold text-danger">{message}</div>}
      {routes.length === 0 ? <Card className="p-8 text-center text-muted">Belum ada rute. Tambahkan rute untuk memulai.</Card> : (
        <div className="grid gap-4 xl:grid-cols-2">
          {routes.map((route) => <RouteCard key={route.id} route={route} stops={stops} onEdit={() => navigate(`/admin/rute-halte/${route.id}`)} onToggle={async (active) => { try { await api.saveRoute(route.id, { ...route, active }) } catch (error) { setMessage(error instanceof Error ? error.message : 'Gagal menyimpan rute') } }} />)}
        </div>
      )}
    </div>
  )
}

function RouteCard({ route, stops, onEdit, onToggle }: { route: Route; stops: Stop[]; onEdit: () => void; onToggle: (active: boolean) => Promise<void> }) {
  const routeStops = route.stopIds.map((id) => stops.find((stop) => stop.id === id)).filter((stop): stop is Stop => Boolean(stop))
  return <Card className="overflow-hidden p-0">
    <div className="h-2" style={{ background: route.color }} />
    <div className="p-5">
      <div className="flex items-start justify-between gap-3"><div><div className="flex items-center gap-2"><span className="rounded-lg px-2 py-1 text-xs font-extrabold text-white" style={{ background: route.color }}>{route.code}</span><h2 className="font-extrabold text-ink">{route.name}</h2></div><p className="mt-2 text-sm text-muted">{route.dashed ? 'Garis putus-putus' : 'Garis solid'} · {routeLengthKm(route.path).toFixed(2)} km</p></div><Toggle checked={route.active} label={`${route.name} aktif`} onChange={(checked) => void onToggle(checked)} /></div>
      <div className="mt-5 grid grid-cols-3 gap-2 border-t border-line pt-4 text-center"><div><strong className="block text-lg text-ink">{routeStops.length}</strong><span className="text-xs text-muted">Halte</span></div><div><strong className="block text-lg text-ink">{route.intervalMin} mnt</strong><span className="text-xs text-muted">Interval</span></div><div><strong className="block text-lg text-ink">{Math.max(1, Math.round(routeLengthKm(route.path) / 0.25))} mnt</strong><span className="text-xs text-muted">Satu putaran</span></div></div>
      <Button className="mt-5" fullWidth variant="soft" icon={<Edit3 className="h-4 w-4" />} onClick={onEdit}>Edit rute</Button>
    </div>
  </Card>
}

export function RouteEditorPage() {
  const { id } = useParams()
  const routes = useRoutes()
  const initial = routes.find((route) => route.id === id)
  const isNew = id === 'new'
  const route = initial ?? (isNew ? { id: 'new', code: 'J1', name: 'Rute baru', color: '#1D4ED8', dashed: false, intervalMin: 10, path: [], stopIds: [], active: true } : undefined)
  if (!route) return <div className="p-6 text-muted">Rute tidak ditemukan.</div>
  return <RouteEditor route={route} isNew={isNew} />
}

export default function RoutePages() {
  const { id } = useParams()
  return id ? <RouteEditorPage /> : <RoutesStubPage />
}

function RouteEditor({ route, isNew }: { route: Route; isNew: boolean }) {
  const navigate = useNavigate()
  const { show } = useToast()
  const allStops = useStops()
  const [path, setPath] = useState<[number, number][]>(route.path)
  const [stopIds, setStopIds] = useState(route.stopIds)
  const [draftStops, setDraftStops] = useState<Stop[]>(allStops)
  const [name, setName] = useState(route.name)
  const [color, setColor] = useState(route.color)
  const [dashed, setDashed] = useState(route.dashed)
  const [intervalMin, setIntervalMin] = useState(route.intervalMin)
  const [active, setActive] = useState(route.active)
  const [mode, setMode] = useState<'route' | 'stop'>('route')
  const [history, setHistory] = useState<[number, number][][]>([])
  const [future, setFuture] = useState<[number, number][][]>([])
  const [dirty, setDirty] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const fileRef = useRef<HTMLInputElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const routeLength = useMemo(() => routeLengthKm(path), [path])
  const loopClosed = path.length > 1 && path[path.length - 1][0] === path[0][0] && path[path.length - 1][1] === path[0][1]
  const stopSource = draftStops.length > 0 ? draftStops : allStops
  const currentStops = stopIds.map((stopId) => stopSource.find((stop) => stop.id === stopId)).filter((stop): stop is Stop => Boolean(stop))
  useEffect(() => { const handler = (event: BeforeUnloadEvent) => { if (dirty) event.preventDefault() }; window.addEventListener('beforeunload', handler); return () => window.removeEventListener('beforeunload', handler) }, [dirty])

  const changePath = (next: [number, number][]) => { setHistory((items) => [...items.slice(-49), path]); setFuture([]); setPath(next); setDirty(true) }
  const toggleLoop = () => { if (path.length < 2) return; changePath(path[path.length - 1][0] === path[0][0] && path[path.length - 1][1] === path[0][1] ? path.slice(0, -1) : [...path, path[0]]) }
  const handleMapClick = (point: [number, number]) => {
    if (mode === 'route') changePath(insertOnPath(path, point))
    else if (path.length >= 2) {
      const snapped = snapToPath(path, point)
      const stop: Stop = { id: `tj-halte-${Date.now().toString(36)}`, name: 'Halte baru', lat: snapped.point[0], lng: snapped.point[1], routeIds: [route.id] }
      setDraftStops((items) => [...items, stop]); setStopIds((items) => [...items, stop.id]); setDirty(true)
    }
  }
  const save = async () => {
    const result = routeSchema.safeParse({ name, intervalMin, path: path.filter((point, index) => index === 0 || point[0] !== path[index - 1][0] || point[1] !== path[index - 1][1]), stopIds })
    const nextErrors = result.success ? [] : result.error.issues.map((issue) => issue.message)
    if (path.length > 2 && path[path.length - 1][0] === path[0][0] && path[path.length - 1][1] === path[0][1] && path.length < 3) nextErrors.push('Loop tertutup membutuhkan minimal 3 titik')
    if (new Set(stopIds).size !== stopIds.length) nextErrors.push('Tidak boleh ada halte duplikat dalam satu rute')
    if (nextErrors.length) { setErrors(nextErrors); return }
    try {
      const savedStops = await Promise.all(currentStops.map((stop) => api.saveStop(stop.id.startsWith('tj-halte-') ? null : stop.id, { name: stop.name, lat: stop.lat, lng: stop.lng, routeIds: Array.from(new Set([...stop.routeIds, route.id])) })))
      const savedIdByDraft = new Map(currentStops.map((stop, index) => [stop.id, savedStops[index].id]))
      const persistedStopIds = stopIds.map((stopId) => savedIdByDraft.get(stopId) ?? stopId)
      const saved = await api.saveRoute(isNew ? null : route.id, { code: route.code, name, color, dashed, intervalMin, path, stopIds: persistedStopIds, active })
      if (isNew) await Promise.all(savedStops.map((stop) => api.saveStop(stop.id, { name: stop.name, lat: stop.lat, lng: stop.lng, routeIds: Array.from(new Set([...stop.routeIds.filter((routeId) => routeId !== route.id), saved.id])) })))
      setDirty(false); setErrors([]); show('Rute berhasil disimpan', { tone: 'success' }); navigate('/admin/rute-halte')
    } catch (error) { setErrors([error instanceof Error ? error.message : 'Gagal menyimpan rute']) }
  }
  const importGeoJson = (file: File) => { void file.text().then((text) => { try { const parsed = JSON.parse(text) as { type?: string; geometry?: { type?: string; coordinates?: [number, number][] } }; if (parsed.type !== 'Feature' || parsed.geometry?.type !== 'LineString' || !parsed.geometry.coordinates || parsed.geometry.coordinates.length < 2) throw new Error('GeoJSON harus berupa Feature LineString dengan minimal 2 koordinat.'); const next = parsed.geometry.coordinates.map(([lng, lat]) => [lat, lng] as [number, number]); changePath(next) } catch (error) { setErrors([error instanceof Error ? error.message : 'GeoJSON tidak valid']) } }).catch(() => setErrors(['Berkas GeoJSON tidak dapat dibaca.'])) }
  const exportGeoJson = () => { const blob = new Blob([JSON.stringify({ type: 'Feature', properties: { name }, geometry: { type: 'LineString', coordinates: path.map(toLngLat) } }, null, 2)], { type: 'application/geo+json' }); const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = `${name.toLowerCase().replace(/\s+/g, '-') || 'rute'}.geojson`; anchor.click(); URL.revokeObjectURL(url) }
  const reorder = (from: number, to: number) => { const next = [...stopIds]; const [item] = next.splice(from, 1); next.splice(to, 0, item); setStopIds(next); setDirty(true) }
  const autoSort = () => setStopIds([...stopIds].sort((a, b) => { const sa = draftStops.find((stop) => stop.id === a); const sb = draftStops.find((stop) => stop.id === b); if (!sa || !sb) return 0; return distanceAlong(path, [sa.lat, sa.lng]) - distanceAlong(path, [sb.lat, sb.lng]) }))
  const stopCorrection = (stop: Stop) => path.length >= 2 ? distanceMeters([stop.lat, stop.lng], snapToPath(path, [stop.lat, stop.lng]).point) : 0
  return <div className="flex h-full min-h-0 flex-col bg-bg">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface px-4 py-3 md:px-6"><div className="flex items-center gap-3"><Button variant="ghost" size="sm" icon={<ChevronLeft className="h-4 w-4" />} onClick={() => navigate('/admin/rute-halte')}>Kembali</Button><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">Editor rute</p><h1 className="font-extrabold text-ink">{name}</h1></div>{dirty && <Chip tone="warning">Belum disimpan</Chip>}</div><div className="flex gap-2"><Button variant="soft" size="sm" icon={<Upload className="h-4 w-4" />} onClick={() => fileRef.current?.click()}>Impor GeoJSON</Button><input ref={fileRef} className="hidden" type="file" accept=".geojson,.json,application/geo+json" onChange={(event) => { const file = event.target.files?.[0]; if (file) importGeoJson(file); event.target.value = '' }} /><Button variant="soft" size="sm" icon={<Download className="h-4 w-4" />} onClick={exportGeoJson}>Ekspor</Button><Button size="sm" icon={<Save className="h-4 w-4" />} onClick={() => void save()}>Simpan</Button></div></div>
    <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_380px]"><div className="relative min-h-[420px]"><MapContainer center={[MAP_CONFIG.center[0], MAP_CONFIG.center[1]]} zoom={MAP_CONFIG.zoom} className="h-full w-full" zoomControl><TileLayer url={MAP_CONFIG.tileUrl} attribution={MAP_CONFIG.attribution} /><MapBridge mapRef={mapRef} /><MapClick onClick={handleMapClick} /><Polyline positions={path} pathOptions={{ color, weight: 6, dashArray: dashed ? '10 12' : undefined, lineCap: 'round' }} eventHandlers={{ click: (event) => { L.DomEvent.stopPropagation(event.originalEvent); if (mode === 'route') changePath(insertOnPath(path, [event.latlng.lat, event.latlng.lng])) } }} />{path.map((point, index) => <Marker key={`${index}-${point[0]}-${point[1]}`} position={point} icon={pointIcon()} draggable eventHandlers={{ dragend: (event) => { const marker = event.target as L.Marker; const position = marker.getLatLng(); const next = [...path]; next[index] = [position.lat, position.lng]; changePath(next) }, contextmenu: () => changePath(path.filter((_, itemIndex) => itemIndex !== index)) }} />)}{currentStops.map((stop) => <Marker key={stop.id} position={[stop.lat, stop.lng]} icon={pointIcon('stop')} draggable eventHandlers={{ dragend: (event) => { const marker = event.target as L.Marker; const snapped = snapToPath(path, [marker.getLatLng().lat, marker.getLatLng().lng]); setDraftStops((items) => items.map((item) => item.id === stop.id ? { ...item, lat: snapped.point[0], lng: snapped.point[1] } : item)); setDirty(true) }, contextmenu: () => setStopIds((items) => items.filter((item) => item !== stop.id)) }} />)}</MapContainer><div className="absolute bottom-4 left-4 z-[1000] flex flex-wrap gap-2 rounded-2xl bg-surface/95 p-2 shadow-[var(--shadow-card)]"><Button size="sm" variant={mode === 'route' ? 'primary' : 'soft'} onClick={() => setMode('route')}>Gambar rute</Button><Button size="sm" variant={mode === 'stop' ? 'primary' : 'soft'} onClick={() => setMode('stop')} icon={<MapPin className="h-4 w-4" />}>Tambah halte</Button><Button size="sm" variant="soft" icon={<Undo2 className="h-4 w-4" />} aria-label="Undo" disabled={!history.length} onClick={() => { const previous = history[history.length - 1]; setHistory(history.slice(0, -1)); setFuture([path, ...future]); setPath(previous) }}>Undo</Button><Button size="sm" variant="soft" icon={<Redo2 className="h-4 w-4" />} aria-label="Redo" disabled={!future.length} onClick={() => { const next = future[0]; setFuture(future.slice(1)); setHistory([...history, path]); setPath(next) }}>Redo</Button></div></div>
      <aside className="min-h-0 overflow-y-auto border-l border-line bg-surface p-5">
        <div className="space-y-5">
          <section className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-[0.1em] text-muted">Nama rute
              <input className="mt-2 h-11 w-full rounded-xl border border-line bg-bg px-3 text-sm text-ink" value={name} onChange={(event) => { setName(event.target.value); setDirty(true) }} />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs font-bold uppercase tracking-[0.1em] text-muted">Interval (menit)
                <input className="mt-2 h-11 w-full rounded-xl border border-line bg-bg px-3 text-sm text-ink" type="number" min="1" max="60" value={intervalMin} onChange={(event) => { setIntervalMin(Number(event.target.value)); setDirty(true) }} />
              </label>
              <label className="text-xs font-bold uppercase tracking-[0.1em] text-muted">Warna
                <input className="mt-2 h-11 w-full rounded-xl border border-line bg-bg px-2" type="color" value={color} onChange={(event) => { setColor(event.target.value); setDirty(true) }} />
                <input className="mt-1 h-9 w-full rounded-lg border border-line px-2 text-xs" value={color} onChange={(event) => { setColor(event.target.value); setDirty(true) }} />
              </label>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-bg px-3 py-3 text-sm font-semibold text-ink"><span>Garis putus-putus</span><Toggle checked={dashed} label="Garis putus-putus" onChange={(checked) => { setDashed(checked); setDirty(true) }} /></div>
            <div className="flex items-center justify-between rounded-xl bg-bg px-3 py-3 text-sm font-semibold text-ink"><span>Rute aktif</span><Toggle checked={active} label="Rute aktif" onChange={(checked) => { setActive(checked); setDirty(true) }} /></div>
            <div className="grid grid-cols-3 gap-2 rounded-2xl bg-primary-soft p-3 text-center"><div><strong className="block text-lg text-primary">{routeLength.toFixed(2)}</strong><span className="text-[11px] text-muted">km</span></div><div><strong className="block text-lg text-primary">{path.length}</strong><span className="text-[11px] text-muted">titik</span></div><div><strong className="block text-lg text-primary">{Math.max(1, Math.round(routeLength / 0.25))}</strong><span className="text-[11px] text-muted">mnt/putaran</span></div></div>
            <Button fullWidth variant="soft" onClick={toggleLoop}>{loopClosed ? 'Buka loop' : 'Tutup loop'}</Button>
            <p className="text-xs text-muted">Status: {loopClosed ? 'loop tertutup' : 'terbuka'}</p>
            <Button fullWidth variant="soft" onClick={() => { const snapped = path.map((point) => snapToPath(path, point).point); setPath(snapped); setDirty(true) }}>Pasang ke jalan</Button>
          </section>
        <section><div className="flex items-center justify-between"><h2 className="font-extrabold text-ink">Halte di rute ({currentStops.length})</h2><Button size="sm" variant="ghost" onClick={autoSort}>Urutkan otomatis</Button></div><div className="mt-3 space-y-2">{currentStops.map((stop, index) => { const correction = stopCorrection(stop); return <div key={stop.id} className="flex items-center gap-2 rounded-xl border border-line bg-bg p-2"><GripVertical className="h-4 w-4 shrink-0 text-muted" aria-hidden /><button className="min-w-0 flex-1 text-left" onClick={() => mapRef.current?.flyTo([stop.lat, stop.lng], 17)}><input aria-label={`Nama halte ${index + 1}`} className="w-full bg-transparent px-1 text-sm font-semibold text-ink outline-none" value={stop.name} onChange={(event) => { setDraftStops((items) => items.map((item) => item.id === stop.id ? { ...item, name: event.target.value } : item)); setDirty(true) }} onKeyDown={(event) => { if (event.key === 'ArrowUp' && index > 0) reorder(index, index - 1); if (event.key === 'ArrowDown' && index < currentStops.length - 1) reorder(index, index + 1) }} /></button><span className={correction > 25 ? 'text-xs font-bold text-warning' : 'text-xs text-muted'}>{correction.toFixed(0)} m{correction > 25 ? ' · jauh dari rute' : ''}</span><button className="rounded-lg p-2 text-muted hover:bg-danger-soft hover:text-danger" aria-label={`Hapus ${stop.name}`} onClick={() => setStopIds((items) => items.filter((item) => item !== stop.id))}><Trash2 className="h-4 w-4" /></button></div> })}</div></section>
        {errors.length > 0 && <div className="rounded-xl bg-danger-soft p-3 text-sm text-danger"><strong className="block">Periksa sebelum menyimpan</strong><ul className="mt-1 list-disc pl-5">{errors.map((error) => <li key={error}>{error}</li>)}</ul></div>}</div></aside></div>
  </div>
}

function distanceAlong(path: [number, number][], target: [number, number]): number {
  return distanceAlongRoute(path, target)
}
