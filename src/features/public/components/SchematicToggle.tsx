import { Compass } from 'lucide-react'
import { cn } from '@/lib/cn'

interface SchematicToggleProps {
  active: boolean
  onToggle: () => void
  raised?: boolean
}

export function SchematicToggle({ active, onToggle, raised = false }: SchematicToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      aria-label="Mode skematik peta"
      className={cn(
        'absolute left-3 z-20 flex h-11 w-11 flex-col items-center justify-center rounded-2xl border border-line bg-surface/90 text-ink shadow-[var(--shadow-card)] backdrop-blur transition',
        raised ? 'bottom-[4.5rem]' : 'bottom-3',
        active && 'text-primary',
      )}
    >
      <Compass className="h-5 w-5" aria-hidden />
      <span className="text-[9px] font-bold leading-none">U</span>
    </button>
  )
}
