import { useState } from 'react'
import { Crosshair, LocateFixed, MapPin, Navigation, Trash2, X } from 'lucide-react'
import { useStops } from '@/hooks/useSimulation'
import { useUserStore } from '@/store/useUserStore'
import { nearestStop } from '@/lib/geo'
import { PERSONAL } from '@/config'
import { cn } from '@/lib/cn'
import { USER_PRESETS } from '../lib/userPresets'

interface UserLocationControlProps {
  className?: string
}

/**
 * Tombol "Lokasi Saya" (BRIEF 9.4). Meminta `navigator.geolocation`; bila
 * ditolak atau di luar kampus, tawarkan Posisi Simulasi (preset + pin seret).
 */
export function UserLocationControl({ className }: UserLocationControlProps) {
  const stops = useStops()
  const [open, setOpen] = useState(false)
  const location = useUserStore((state) => state.location)
  const source = useUserStore((state) => state.source)
  const status = useUserStore((state) => state.status)
  const simulationMode = useUserStore((state) => state.simulationMode)
  const setStatus = useUserStore((state) => state.setStatus)
  const setLocation = useUserStore((state) => state.setLocation)
  const setSimulationMode = useUserStore((state) => state.setSimulationMode)
  const clearLocation = useUserStore((state) => state.clearLocation)

  const requestGps = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setStatus('unsupported')
      setSimulationMode(true)
      setOpen(true)
      return
    }
    setStatus('locating')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const candidate: [number, number] = [position.coords.latitude, position.coords.longitude]
        const near = nearestStop(candidate, stops)
        if (near && near.distanceKm <= PERSONAL.MAX_USER_DISTANCE_KM) {
          setSimulationMode(false)
          setOpen(false)
          setLocation(candidate, 'gps')
        } else {
          setStatus('out-of-area')
          setSimulationMode(true)
          setOpen(true)
        }
      },
      () => {
        setStatus('denied')
        setSimulationMode(true)
        setOpen(true)
      },
      { enableHighAccuracy: true, timeout: 8000 },
    )
  }

  const handleClick = () => {
    if (location || simulationMode) {
      setOpen((value) => !value)
      return
    }
    requestGps()
  }

  const message =
    status === 'denied'
      ? 'Akses lokasi ditolak. Pilih Posisi Simulasi di bawah.'
      : status === 'out-of-area'
        ? 'Posisi Anda di luar area kampus. Pilih Posisi Simulasi.'
        : status === 'unsupported'
          ? 'Perangkat tidak mendukung GPS. Pilih Posisi Simulasi.'
          : null

  return (
    <div className={cn('absolute z-30', className)}>
      {open && (
        <div className="absolute bottom-14 right-0 w-[17rem] rounded-[20px] bg-surface p-4 shadow-[var(--shadow-lg)]">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted">Posisi Simulasi</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Tutup menu lokasi"
              className="flex h-7 w-7 items-center justify-center rounded-full text-muted hover:bg-primary-soft hover:text-ink"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
          {message && (
            <p className="mt-2 rounded-xl bg-warning-soft px-3 py-2 text-xs font-medium text-warning">{message}</p>
          )}
          <div className="mt-3 flex flex-col gap-2">
            {USER_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  setSimulationMode(true)
                  setLocation(preset.location, 'simulation')
                  setOpen(false)
                }}
                className="flex items-center gap-2 rounded-xl bg-primary-soft px-3 py-2.5 text-sm font-semibold text-ink transition hover:brightness-[0.98]"
              >
                <MapPin className="h-4 w-4 text-primary" aria-hidden />
                {preset.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={requestGps}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-primary hover:bg-primary-soft"
          >
            <LocateFixed className="h-4 w-4" aria-hidden />
            Coba Lokasi GPS Lagi
          </button>
          {location && (
            <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
              <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
                <Navigation className="h-3.5 w-3.5" aria-hidden />
                Sumber: {source === 'gps' ? 'GPS' : 'Simulasi'}
              </span>
              <button
                type="button"
                onClick={() => {
                  clearLocation()
                  setSimulationMode(false)
                  setOpen(false)
                }}
                className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.06em] text-danger hover:brightness-110"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden />
                Hapus
              </button>
            </div>
          )}
          {simulationMode && (
            <p className="mt-3 text-[11px] leading-relaxed text-muted">
              Seret pin biru di peta untuk menyesuaikan posisi Anda.
            </p>
          )}
        </div>
      )}
      <button
        type="button"
        onClick={handleClick}
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full bg-surface px-4 py-3 text-sm font-bold text-ink shadow-[var(--shadow-card)] transition hover:bg-primary-soft"
      >
        <Crosshair className="h-4 w-4 text-primary" aria-hidden />
        {status === 'locating' ? 'Mencari...' : 'Lokasi Saya'}
      </button>
    </div>
  )
}
