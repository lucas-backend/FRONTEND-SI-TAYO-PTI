import { KeyRound } from 'lucide-react'
import { Button } from '@/components/ui'

interface PinRevealDialogProps {
  open: boolean
  name: string
  pin: string
  onClose: () => void
}

/** Menampilkan PIN acak SEKALI saja (tidak dapat dibuka lagi). */
export function PinRevealDialog({ open, name, pin, onClose }: PinRevealDialogProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-5">
      <button type="button" aria-label="Tutup" className="absolute inset-0 bg-night/40" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="PIN baru"
        className="relative w-full max-w-sm rounded-[24px] bg-surface p-6 shadow-[var(--shadow-lg)]"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <KeyRound className="h-5 w-5" aria-hidden />
        </span>
        <h2 className="mt-3 text-lg font-extrabold tracking-[-0.02em] text-ink">PIN Baru</h2>
        <p className="mt-1 text-sm text-muted">
          PIN untuk <span className="font-semibold text-ink">{name}</span>. Catat sekarang — PIN tidak akan ditampilkan lagi.
        </p>
        <p className="mt-4 rounded-[16px] bg-primary-soft py-4 text-center text-3xl font-extrabold tracking-[0.3em] text-ink">
          {pin}
        </p>
        <Button fullWidth className="mt-5" onClick={onClose}>
          Sudah saya catat
        </Button>
      </div>
    </div>
  )
}
