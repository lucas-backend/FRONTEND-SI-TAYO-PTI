import { WifiOff, UploadCloud } from 'lucide-react'

interface SignalBannerProps {
  offline: boolean
  queued: number
  recovering: boolean
  pending: number
}

/** Banner oranye status sinyal GPS (BRIEF 10.4). */
export function SignalBanner({ offline, queued, recovering, pending }: SignalBannerProps) {
  if (recovering) {
    return (
      <div role="status" className="flex items-center gap-2 rounded-2xl bg-warning-soft px-3 py-2.5 text-xs font-bold text-warning">
        <UploadCloud className="h-4 w-4 shrink-0" aria-hidden />
        Mengirim {pending} lokasi tertunda...
      </div>
    )
  }
  if (offline) {
    return (
      <div role="status" className="flex items-center gap-2 rounded-2xl bg-warning-soft px-3 py-2.5 text-xs font-bold text-warning">
        <WifiOff className="h-4 w-4 shrink-0" aria-hidden />
        Sinyal putus: lokasi masuk antrean lokal ({queued})
      </div>
    )
  }
  return null
}
