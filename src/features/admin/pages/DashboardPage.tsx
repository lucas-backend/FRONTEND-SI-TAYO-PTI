import { useCallback, useMemo } from 'react'
import { Activity, Bus, Gauge, Timer, Users } from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useActivities, useBuses, useLatencies, usePositions } from '@/hooks/useSimulation'
import { formatDecimal, formatSpeed } from '@/lib/format'
import { StatCard } from '../components/StatCard'
import { ActivityFeed } from '../components/ActivityFeed'
import { passengersPerHour, tripsPerDay } from '../lib/dashboardData'

const CHART_AXIS = { fontSize: 11, fill: 'var(--text-muted)' }
const TOOLTIP_STYLE = {
  borderRadius: 14,
  border: '1px solid var(--border)',
  background: 'var(--surface)',
  fontSize: 12,
  color: 'var(--text)',
}

export function DashboardPage() {
  const buses = useBuses()
  const positions = usePositions()
  const latencies = useLatencies()
  const activities = useActivities()

  const activePositions = Object.values(positions)
  const activeCount = activePositions.length

  const avgSpeed = activeCount > 0 ? activePositions.reduce((sum, p) => sum + p.speedKmh, 0) / activeCount : 0

  const passengers = useMemo(
    () => buses.filter((bus) => positions[bus.id]).reduce((sum, bus) => sum + bus.seatsTaken, 0),
    [buses, positions],
  )

  const avgLatencyMs = latencies.length > 0 ? latencies.reduce((sum, value) => sum + value, 0) / latencies.length : 0

  const busLabel = useCallback((busId: string) => buses.find((bus) => bus.id === busId)?.label, [buses])

  const hourly = useMemo(() => passengersPerHour(), [])
  const daily = useMemo(() => tripsPerDay(), [])

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <header className="mb-5">
        <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-ink">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">Ringkasan operasional armada Bus Unila secara langsung.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          icon={<Bus className="h-4 w-4" aria-hidden />}
          label="Bus Aktif / Total"
          value={`${activeCount} / ${buses.length}`}
          hint="Beroperasi saat ini"
          tone="primary"
        />
        <StatCard
          icon={<Gauge className="h-4 w-4" aria-hidden />}
          label="Rata-rata Kecepatan"
          value={activeCount > 0 ? formatSpeed(avgSpeed) : '-'}
          hint="Seluruh bus aktif"
          tone="success"
        />
        <StatCard
          icon={<Users className="h-4 w-4" aria-hidden />}
          label="Penumpang Saat Ini"
          value={String(passengers)}
          hint="Total kursi terisi"
          tone="warning"
        />
        <StatCard
          icon={<Activity className="h-4 w-4" aria-hidden />}
          label="Uptime 24 Jam"
          value="99,2%"
          hint="Dummy operasional"
          tone="success"
        />
        <StatCard
          icon={<Timer className="h-4 w-4" aria-hidden />}
          label="Latensi Data"
          value={latencies.length > 0 ? `${formatDecimal(avgLatencyMs / 1000, 1)} dtk` : '-'}
          hint="Rata-rata selisih timestamp"
          tone="primary"
        />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-[var(--radius-card)] bg-surface p-5 shadow-[var(--shadow-soft)]">
          <h2 className="text-sm font-extrabold tracking-[-0.01em] text-ink">Penumpang per Jam</h2>
          <p className="mb-3 text-xs text-muted">Estimasi jumlah penumpang sepanjang jam operasional.</p>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourly} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
                <defs>
                  <linearGradient id="passengerFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="label" tick={CHART_AXIS} axisLine={false} tickLine={false} />
                <YAxis tick={CHART_AXIS} axisLine={false} tickLine={false} width={40} />
                <Tooltip contentStyle={TOOLTIP_STYLE} labelStyle={{ color: 'var(--text-muted)' }} />
                <Area type="monotone" dataKey="penumpang" stroke="var(--primary)" strokeWidth={2.5} fill="url(#passengerFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[var(--radius-card)] bg-surface p-5 shadow-[var(--shadow-soft)]">
          <h2 className="text-sm font-extrabold tracking-[-0.01em] text-ink">Perjalanan per Hari</h2>
          <p className="mb-3 text-xs text-muted">Jumlah perjalanan armada dalam sepekan terakhir.</p>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={daily} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="label" tick={CHART_AXIS} axisLine={false} tickLine={false} />
                <YAxis tick={CHART_AXIS} axisLine={false} tickLine={false} width={40} />
                <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'var(--primary-soft)' }} />
                <Bar dataKey="perjalanan" fill="var(--primary)" radius={[8, 8, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <ActivityFeed activities={activities} busLabel={busLabel} />
      </div>
    </div>
  )
}
