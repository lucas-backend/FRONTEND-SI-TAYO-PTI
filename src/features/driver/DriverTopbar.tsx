import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'

interface DriverTopbarProps {
  title: string
  onBack?: () => void
  trailing?: ReactNode
}

export function DriverTopbar({ title, onBack, trailing }: DriverTopbarProps) {
  return (
    <header className="flex shrink-0 items-center gap-3 px-5 py-5">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="Kembali"
          className="-ml-1 flex h-9 w-9 items-center justify-center rounded-full text-ink transition hover:bg-primary-soft"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden />
        </button>
      )}
      <h1 className="flex-1 text-lg font-bold tracking-[-0.01em] text-ink">{title}</h1>
      {trailing}
    </header>
  )
}
