import { Link } from 'react-router-dom'
import { ExternalLink, KeyRound, MonitorPlay, ShieldCheck } from 'lucide-react'
import { Card } from '@/components/ui'
import { PhoneFrame } from './PhoneFrame'
import { DriverSimulator } from './DriverSimulator'

/** Route /driver: bingkai ponsel supir + panel penjelasan (desktop). */
export function DriverPage() {
  return (
    <div className="min-h-[100dvh] bg-bg">
      <div className="mx-auto flex min-h-[100dvh] max-w-6xl flex-col items-stretch gap-8 lg:flex-row lg:items-center lg:justify-center lg:px-6 lg:py-10">
        <div className="h-[100dvh] w-full lg:h-[85vh] lg:max-h-[800px] lg:w-[390px]">
          <PhoneFrame>
            <DriverSimulator />
          </PhoneFrame>
        </div>

        <aside className="hidden w-full max-w-md flex-col gap-4 lg:flex">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted">Simulator Supir</p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-[-0.03em] text-ink">Aplikasi Pengemudi Bus Unila</h1>
            <p className="mt-2 text-sm text-muted">
              Replika aplikasi Android supir. Aksi di sini menggerakkan bus nyata di peta publik pada tab lain
              lewat BroadcastChannel.
            </p>
          </div>

          <Card className="flex items-center gap-3 p-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
              <KeyRound className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted">Kredensial Demo</p>
              <p className="text-sm font-semibold text-ink">ID DRV-19842 • PIN 123456</p>
            </div>
          </Card>

          <Card className="flex items-center gap-3 p-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-success-soft text-success">
              <ShieldCheck className="h-5 w-5" aria-hidden />
            </span>
            <p className="text-sm text-muted">
              Login memakai JWT palsu role DRIVER, disimpan lokal sebagai persistensi demo.
            </p>
          </Card>

          <div className="flex flex-col gap-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-[var(--shadow-soft)] transition hover:bg-primary-hover"
            >
              <ExternalLink className="h-4 w-4" aria-hidden />
              Buka Peta Publik di tab baru
            </a>
            <Link
              to="/demo"
              className="inline-flex items-center gap-2 rounded-2xl bg-primary-soft px-4 py-3 text-sm font-bold text-primary transition hover:brightness-[0.98]"
            >
              <MonitorPlay className="h-4 w-4" aria-hidden />
              Mode Demo (satu tab: ponsel + peta)
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
