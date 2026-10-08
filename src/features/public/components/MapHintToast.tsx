import { MousePointerClick } from 'lucide-react'

interface MapHintToastProps {
  visible: boolean
  onAction: () => void
}

/** Toast gelap ajakan menekan bus. Hilang setelah pengguna memilih bus. */
export function MapHintToast({ visible, onAction }: MapHintToastProps) {
  if (!visible) return null
  return (
    <div className="pointer-events-none absolute inset-x-3 bottom-3 z-20 flex justify-center md:hidden">
      <div className="pointer-events-auto flex w-full items-center gap-3 rounded-[18px] bg-night px-4 py-3 text-white shadow-[var(--shadow-lg)]">
        <MousePointerClick className="h-5 w-5 shrink-0 text-blue-300" aria-hidden />
        <span className="flex-1 text-sm font-medium">Tap bus untuk estimasi halte</span>
        <button
          type="button"
          onClick={onAction}
          className="text-xs font-bold uppercase tracking-[0.08em] text-blue-300 hover:text-blue-200"
        >
          Langsung
        </button>
      </div>
    </div>
  )
}
