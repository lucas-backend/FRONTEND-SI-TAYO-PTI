import { Link } from 'react-router-dom'
import { Bus, MapPinned, ShieldCheck } from 'lucide-react'
import { Card, Chip } from '@/components/ui'

export function PublicHome() {
  return (
    <div className="mx-auto flex min-h-full max-w-4xl flex-col gap-8 px-5 py-10">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-[var(--shadow-soft)]">
            <Bus className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="text-lg font-extrabold tracking-[-0.02em]">BUS UNILA</p>
            <Chip tone="default" dot className="mt-1">
              Pelacak Rute
            </Chip>
          </div>
        </div>
      </header>

      <Card className="p-6">
        <h1 className="text-3xl font-extrabold tracking-[-0.03em] text-ink">
          Sistem Pelacak Bus Unila
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
          Mockup web publik, web admin, dan simulator supir. Tahap 1&ndash;3
          (token desain, data dummy, mesin simulasi) sudah berjalan. Peta hidup
          menyusul pada tahap 4.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/dev"
            className="inline-flex h-12 items-center gap-2 rounded-[var(--radius-input)] bg-primary px-5 font-semibold text-white shadow-[var(--shadow-soft)] transition hover:bg-primary-hover"
          >
            <MapPinned className="h-4 w-4" aria-hidden />
            Buka Lab Pengembangan
          </Link>
          <Link
            to="/driver"
            className="inline-flex h-12 items-center gap-2 rounded-[var(--radius-input)] bg-primary-soft px-5 font-semibold text-primary transition hover:brightness-[0.98]"
          >
            <ShieldCheck className="h-4 w-4" aria-hidden />
            Simulator Supir
          </Link>
        </div>
      </Card>
    </div>
  )
}
