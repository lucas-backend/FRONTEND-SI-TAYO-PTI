import { Construction, Route as RouteIcon } from 'lucide-react'
import { Card, Chip } from '@/components/ui'

/** Placeholder Kelola Rute & Halte (editor dikerjakan pada tahap 8B). */
export function RoutesStubPage() {
  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <header className="mb-5">
        <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-ink">Rute &amp; Halte</h1>
        <p className="mt-1 text-sm text-muted">Kelola jalur dan halte Bus Unila.</p>
      </header>

      <Card className="flex max-w-xl flex-col items-start gap-4 p-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <RouteIcon className="h-6 w-6" aria-hidden />
        </span>
        <div>
          <h2 className="text-xl font-extrabold tracking-[-0.02em] text-ink">Editor rute segera hadir</h2>
          <p className="mt-2 text-sm text-muted">
            Editor interaktif peta untuk menambah titik jalur, memindahkan halte, dan mengatur urutan halte
            dikerjakan pada tahap berikutnya (8B).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Chip tone="warning" icon={<Construction className="h-3.5 w-3.5" />}>
            Segera hadir
          </Chip>
        </div>
      </Card>
    </div>
  )
}
