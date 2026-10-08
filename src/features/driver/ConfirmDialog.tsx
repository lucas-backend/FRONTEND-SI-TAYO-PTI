import { TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}

/** Dialog konfirmasi di dalam bingkai ponsel (mis. STOP TRACKING). */
export function ConfirmDialog({ open, title, description, confirmLabel, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!open) return null
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-night/40 px-6">
      <div role="alertdialog" aria-modal="true" aria-label={title} className="w-full rounded-[24px] bg-surface p-5 shadow-[var(--shadow-lg)]">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-danger-soft text-danger">
          <TriangleAlert className="h-5 w-5" aria-hidden />
        </span>
        <h2 className="mt-3 text-lg font-extrabold tracking-[-0.02em] text-ink">{title}</h2>
        <p className="mt-1 text-sm text-muted">{description}</p>
        <div className="mt-5 flex gap-3">
          <Button variant="soft" fullWidth onClick={onCancel}>
            Batal
          </Button>
          <Button variant="danger" fullWidth onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
