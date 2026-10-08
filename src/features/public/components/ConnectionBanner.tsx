import { TriangleAlert } from 'lucide-react'
import { formatAgo } from '@/lib/time'

interface ConnectionBannerProps {
  lastUpdatedTs: number
}

export function ConnectionBanner({ lastUpdatedTs }: ConnectionBannerProps) {
  return (
    <div className="absolute inset-x-3 top-3 z-20 flex items-center gap-2 rounded-2xl bg-warning-soft px-3 py-2 text-xs font-semibold text-warning shadow-[var(--shadow-soft)]">
      <TriangleAlert className="h-4 w-4 shrink-0" aria-hidden />
      <span className="flex-1">Koneksi terputus, mencoba menyambung kembali</span>
      <span className="font-bold">terakhir diperbarui {formatAgo(lastUpdatedTs)}</span>
    </div>
  )
}
