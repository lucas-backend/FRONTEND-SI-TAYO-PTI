import { CircleCheck, CircleX } from 'lucide-react'
import type { CapacityStatus } from '@/api/types'
import { cn } from '@/lib/cn'

interface CapacitySelectorProps {
  value: CapacityStatus
  onChange: (status: CapacityStatus) => void
  busy?: boolean
}

/** Pilihan STATUS KURSI PENUMPANG (Tersedia / Penuh) seperti gambar supir. */
export function CapacitySelector({ value, onChange, busy = false }: CapacitySelectorProps) {
  const options: { status: CapacityStatus; label: string; Icon: typeof CircleCheck }[] = [
    { status: 'AVAILABLE', label: 'Tersedia', Icon: CircleCheck },
    { status: 'FULL', label: 'Penuh', Icon: CircleX },
  ]
  return (
    <div className="flex gap-3">
      {options.map(({ status, label, Icon }) => {
        const active = value === status
        return (
          <button
            key={status}
            type="button"
            disabled={busy}
            aria-pressed={active}
            onClick={() => onChange(status)}
            className={cn(
              'flex h-14 flex-1 items-center justify-center gap-2 rounded-[20px] text-sm font-bold transition disabled:opacity-60',
              active
                ? status === 'AVAILABLE'
                  ? 'bg-success text-white shadow-[var(--shadow-soft)]'
                  : 'bg-danger text-white shadow-[var(--shadow-soft)]'
                : 'bg-surface text-muted shadow-[var(--shadow-soft)] hover:text-ink',
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {label}
          </button>
        )
      })}
    </div>
  )
}
