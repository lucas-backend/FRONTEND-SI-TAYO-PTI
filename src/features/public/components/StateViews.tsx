import { Bus, RefreshCw, TriangleAlert } from 'lucide-react'
import { Button, Card, Skeleton } from '@/components/ui'

export function PanelSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-16 w-full" />
    </div>
  )
}

export function EmptyBusesState({ message = 'Belum ada bus beroperasi' }: { message?: string }) {
  return (
    <Card className="flex flex-col items-center gap-3 p-8 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
        <Bus className="h-6 w-6" aria-hidden />
      </span>
      <p className="text-sm font-semibold text-ink">{message}</p>
      <p className="text-xs text-muted">Bus akan muncul di peta saat supir memulai pelacakan.</p>
    </Card>
  )
}

interface ErrorStateProps {
  message: string
  onRetry: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <Card className="flex flex-col items-center gap-3 p-8 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-danger-soft text-danger">
        <TriangleAlert className="h-6 w-6" aria-hidden />
      </span>
      <p className="text-sm font-semibold text-ink">Gagal memuat data</p>
      <p className="text-xs text-muted">{message}</p>
      <Button size="sm" variant="soft" icon={<RefreshCw className="h-4 w-4" />} onClick={onRetry}>
        Coba lagi
      </Button>
    </Card>
  )
}
