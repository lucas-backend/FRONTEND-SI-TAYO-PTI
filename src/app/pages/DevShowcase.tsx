import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Activity, Bus as BusIcon, RefreshCw, Wifi, WifiOff } from 'lucide-react'
import {
  Badge,
  Button,
  Card,
  Chip,
  SegmentedControl,
  Sheet,
  Skeleton,
  Toggle,
  useToast,
} from '@/components/ui'
import type { SheetSnap } from '@/components/ui'
import { useSimStore } from '@/store/useSimStore'
import { formatEta, formatSpeed } from '@/lib/format'
import { formatAgo } from '@/lib/time'

type LabTab = 'komponen' | 'simulasi'

export function DevShowcase() {
  const [tab, setTab] = useState<LabTab>('komponen')
  return (
    <div className="mx-auto max-w-5xl px-5 py-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-ink">Lab Pengembangan</h1>
          <p className="mt-1 text-sm text-muted">Pratinjau token desain, komponen UI, dan simulasi bus.</p>
        </div>
        <SegmentedControl<LabTab>
          ariaLabel="Pilih bagian lab"
          value={tab}
          onChange={setTab}
          options={[
            { value: 'komponen', label: 'Komponen' },
            { value: 'simulasi', label: 'Simulasi' },
          ]}
        />
      </header>
      {tab === 'komponen' ? <ComponentLab /> : <SimulationMonitor />}
    </div>
  )
}

const SWATCHES = [
  { token: '--primary', css: 'var(--primary)' },
  { token: '--primary-soft', css: 'var(--primary-soft)' },
  { token: '--bg', css: 'var(--bg)' },
  { token: '--surface', css: 'var(--surface)' },
  { token: '--text', css: 'var(--text)' },
  { token: '--text-muted', css: 'var(--text-muted)' },
  { token: '--success', css: 'var(--success)' },
  { token: '--danger', css: 'var(--danger)' },
  { token: '--route-2', css: 'var(--route-2)' },
  { token: '--dark', css: 'var(--dark)' },
] as const

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.08em] text-muted">{title}</h2>
      {children}
    </section>
  )
}

function ComponentLab() {
  const { show } = useToast()
  const [full, setFull] = useState(true)
  const [route, setRoute] = useState<'J1' | 'J2'>('J1')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [snap, setSnap] = useState<SheetSnap>('half')

  return (
    <div>
      <Section title="Token warna">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {SWATCHES.map((item) => (
            <Card key={item.token} className="overflow-hidden">
              <div className="h-14 w-full" style={{ background: item.css }} />
              <p className="px-3 py-2 text-[11px] font-semibold text-muted">{item.token}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Tipografi">
        <Card className="space-y-2 p-5">
          <p className="text-4xl font-extrabold tracking-[-0.03em] text-ink">BE 2045 UZ</p>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Nomor Armada</p>
          <p className="text-[15px] text-ink">Jalur Lingkar Luar (Gedung Serba Guna - FMIPA - Rektorat)</p>
        </Card>
      </Section>

      <Section title="Tombol">
        <div className="flex flex-wrap gap-3">
          <Button icon={<BusIcon className="h-4 w-4" />}>Start Tracking</Button>
          <Button variant="danger">Stop Tracking</Button>
          <Button variant="soft">Lihat Rute</Button>
          <Button variant="ghost">Batal</Button>
          <Button loading>Memuat</Button>
          <Button size="sm">Kecil</Button>
        </div>
      </Section>

      <Section title="Chip, badge, toggle, segmented">
        <Card className="flex flex-wrap items-center gap-3 p-5">
          <Chip dot tone="success">
            Status: Standby
          </Chip>
          <Chip dot>Pelacak Rute</Chip>
          <Chip tone="night">2 Bus Beroperasi</Chip>
          <Badge status="AVAILABLE" />
          <Badge status="FULL" />
          <div className="flex items-center gap-2">
            <Toggle checked={full} onChange={setFull} label="Status penuh" />
            <span className="text-sm text-muted">{full ? 'Penuh' : 'Tersedia'}</span>
          </div>
          <SegmentedControl<'J1' | 'J2'>
            ariaLabel="Pilih jalur"
            value={route}
            onChange={setRoute}
            options={[
              { value: 'J1', label: 'Jalur 1' },
              { value: 'J2', label: 'Jalur 2' },
            ]}
          />
        </Card>
      </Section>

      <Section title="Skeleton, toast, bottom sheet">
        <Card className="space-y-3 p-5">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
          <div className="flex flex-wrap gap-3">
            <Button variant="soft" onClick={() => show('Tap bus untuk estimasi halte', { action: { label: 'Langsung', onClick: () => undefined }, durationMs: 3000 })}>
              Toast gelap
            </Button>
            <Button variant="soft" onClick={() => show('Jalur berhasil disimpan', { tone: 'success' })}>
              Toast sukses
            </Button>
            <Button variant="soft" onClick={() => show('Koneksi terputus', { tone: 'danger' })}>
              Toast galat
            </Button>
            <Button
              variant="soft"
              onClick={() => {
                setSnap('half')
                setSheetOpen(true)
              }}
            >
              Buka Bottom Sheet
            </Button>
          </div>
        </Card>
      </Section>

      <Sheet open={sheetOpen} snap={snap} onSnapChange={setSnap} onClose={() => setSheetOpen(false)}>
        <h3 className="text-lg font-bold text-ink">Contoh Bottom Sheet</h3>
        <p className="mt-2 text-sm text-muted">Tiga posisi: peek, setengah, penuh. Geser handle untuk berpindah posisi.</p>
        <div className="mt-4 space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Button fullWidth onClick={() => setSheetOpen(false)}>
            Tutup
          </Button>
        </div>
      </Sheet>
    </div>
  )
}

function SimulationMonitor() {
  const positions = useSimStore((state) => state.positions)
  const buses = useSimStore((state) => state.buses)
  const stops = useSimStore((state) => state.stops)
  const connected = useSimStore((state) => state.connected)
  const lastUpdatedTs = useSimStore((state) => state.lastUpdatedTs)
  const resetDemo = useSimStore((state) => state.resetDemo)

  const stopName = useMemo(() => {
    const map = new Map(stops.map((stop) => [stop.id, stop.name]))
    return (id: string) => map.get(id) ?? id
  }, [stops])

  useEffect(() => {
    const timer = window.setInterval(() => {
      const rows = Object.values(useSimStore.getState().positions).map((position) => ({
        busId: position.busId,
        lat: position.lat.toFixed(5),
        lng: position.lng.toFixed(5),
        heading: Math.round(position.heading),
        speedKmh: Math.round(position.speedKmh),
        nextStop: position.nextStopId,
        etaNextMin: position.etaToStops[position.nextStopId]?.toFixed(2) ?? '-',
      }))
      if (rows.length > 0) {
        console.info('[simulasi] posisi bus')
        console.table(rows)
      }
    }, 3000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div>
      <Card className="mb-5 flex flex-wrap items-center justify-between gap-3 p-5">
        <div className="flex items-center gap-3">
          <Chip dot tone={connected ? 'success' : 'danger'} icon={connected ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}>
            {connected ? 'Gateway tersambung' : 'Gateway terputus'}
          </Chip>
          <span className="text-sm text-muted">
            Diperbarui {lastUpdatedTs ? formatAgo(lastUpdatedTs) : '-'}
          </span>
        </div>
        <Button variant="soft" icon={<RefreshCw className="h-4 w-4" />} onClick={() => void resetDemo()}>
          Reset Data Demo
        </Button>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {buses.map((bus) => {
          const position = positions[bus.id]
          const active = Boolean(position)
          return (
            <Card key={bus.id} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">{bus.label}</p>
                  <p className="text-xl font-extrabold tracking-[-0.02em] text-ink">{bus.plate}</p>
                  <p className="mt-1 text-sm text-muted">Jalur {bus.routeId === 'J1' ? 'Lingkar Luar' : 'Lingkar Dalam'}</p>
                </div>
                <Badge status={bus.capacityStatus} />
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-muted">
                <Activity className={`h-4 w-4 ${active ? 'text-success' : 'text-muted'}`} aria-hidden />
                {active && position ? (
                  <span>
                    {formatSpeed(position.speedKmh)} • menuju {stopName(position.nextStopId)} •{' '}
                    {formatEta(position.etaToStops[position.nextStopId] ?? 0, 'NEXT')}
                  </span>
                ) : (
                  <span>Belum beroperasi (standby)</span>
                )}
              </div>
              {active && position && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {Object.entries(position.etaToStops).map(([stopId, minutes]) => (
                    <Chip key={stopId} tone={stopId === position.nextStopId ? 'primary' : 'default'}>
                      {stopName(stopId)} • {minutes < 1 ? 'segera' : `${Math.round(minutes)} mnt`}
                    </Chip>
                  ))}
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
