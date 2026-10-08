import { TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

/** Dialog konfirmasi aksi destruktif di panel admin. */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-5">
      <button type="button" aria-label="Batal" className="absolute inset-0 bg-night/40" onClick={onCancel} />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full max-w-sm rounded-[24px] bg-surface p-6 shadow-[var(--shadow-lg)]"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-danger-soft text-danger">
          <TriangleAlert className="h-5 w-5" aria-hidden />
        </span>
        <h2 className="mt-3 text-lg font-extrabold tracking-[-0.02em] text-ink">{title}</h2>
        <p className="mt-1 text-sm text-muted">{description}</p>
        <div className="mt-5 flex gap-3">
          <Button variant="soft" fullWidth onClick={onCancel} disabled={loading}>
            Batal
          </Button>
          <Button variant="danger" fullWidth onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
