import type { ReactNode } from 'react'
import { CircleAlert, RefreshCw } from 'lucide-react'
import { Button, Skeleton } from '@/components/ui'

interface TableSkeletonProps {
  rows?: number
  cols: number
}

export function TableSkeleton({ rows = 5, cols }: TableSkeletonProps) {
  return (
    <div className="space-y-3 p-4" aria-busy>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-3">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-6 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
      {icon && (
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">{icon}</span>
      )}
      <p className="text-base font-bold text-ink">{title}</p>
      {description && <p className="max-w-sm text-sm text-muted">{description}</p>}
      {action}
    </div>
  )
}

interface ErrorStateProps {
  message: string
  onRetry: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-danger-soft text-danger">
        <CircleAlert className="h-6 w-6" aria-hidden />
      </span>
      <p className="text-base font-bold text-ink">Gagal memuat data</p>
      <p className="max-w-sm text-sm text-muted">{message}</p>
      <Button variant="soft" icon={<RefreshCw className="h-4 w-4" />} onClick={onRetry}>
        Coba lagi
      </Button>
    </div>
  )
}
