import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type SheetSnap = 'peek' | 'half' | 'full'

const SNAP_RATIO: Record<SheetSnap, number> = { peek: 0, half: 0.58, full: 0.92 }
const PEEK_PX = 156

function snapToPx(snap: SheetSnap, viewportHeight: number): number {
  if (snap === 'peek') return PEEK_PX
  return Math.round(viewportHeight * SNAP_RATIO[snap])
}

export interface SheetProps {
  open: boolean
  snap: SheetSnap
  onSnapChange: (snap: SheetSnap) => void
  onClose?: () => void
  header?: ReactNode
  children: ReactNode
  className?: string
}

/**
 * Bottom sheet tiga posisi (peek/half/full) dengan drag handle.
 * Dapat dioperasikan mouse, sentuh, dan keyboard (Esc untuk menutup).
 */
export function Sheet({ open, snap, onSnapChange, onClose, header, children, className }: SheetProps) {
  const [dragHeight, setDragHeight] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragStart = useRef<{ y: number; height: number } | null>(null)

  const viewportHeight = typeof window === 'undefined' ? 800 : window.innerHeight

  useEffect(() => {
    if (!open || !onClose) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  const onPointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    dragStart.current = { y: event.clientY, height: rect.height }
    event.currentTarget.setPointerCapture(event.pointerId)
  }, [])

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const start = dragStart.current
      if (!start) return
      const next = start.height + (start.y - event.clientY)
      setDragHeight(Math.min(Math.max(next, PEEK_PX), Math.round(viewportHeight * SNAP_RATIO.full)))
    },
    [viewportHeight],
  )

  const onPointerUp = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!dragStart.current) return
      dragStart.current = null
      const current = dragHeight ?? snapToPx(snap, viewportHeight)
      const candidates: SheetSnap[] = ['peek', 'half', 'full']
      let nearest: SheetSnap = snap
      let smallest = Number.POSITIVE_INFINITY
      for (const candidate of candidates) {
        const delta = Math.abs(snapToPx(candidate, viewportHeight) - current)
        if (delta < smallest) {
          smallest = delta
          nearest = candidate
        }
      }
      setDragHeight(null)
      onSnapChange(nearest)
      event.currentTarget.releasePointerCapture(event.pointerId)
    },
    [dragHeight, onSnapChange, snap, viewportHeight],
  )

  if (!open) return null

  const height = dragHeight ?? snapToPx(snap, viewportHeight)
  const style: CSSProperties = { height }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center">
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="false"
        className={cn(
          'pointer-events-auto w-full max-w-[520px] overflow-hidden rounded-t-[var(--radius-sheet)] bg-surface shadow-[var(--shadow-lg)]',
          dragHeight === null && 'transition-[height] duration-300 ease-out',
          className,
        )}
        style={style}
      >
        <div
          className="flex cursor-grab touch-none items-center justify-center py-3 active:cursor-grabbing"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <span className="h-1.5 w-12 rounded-full bg-line" aria-hidden />
        </div>
        {header && <div className="px-5 pb-2">{header}</div>}
        <div className="h-[calc(100%-3.5rem)] overflow-y-auto px-5 pb-8">{children}</div>
      </div>
    </div>
  )
}
