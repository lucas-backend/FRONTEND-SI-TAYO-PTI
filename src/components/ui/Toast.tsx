import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { ToastContext } from './toast-context'
import type { ToastContextValue, ToastOptions, ToastTone } from './toast-context'

interface ToastItem {
  id: number
  message: string
  tone: ToastTone
  durationMs: number
  action?: ToastOptions['action']
}

const toneClasses: Record<ToastTone, string> = {
  info: 'bg-night text-white',
  success: 'bg-success text-white',
  danger: 'bg-danger text-white',
  warning: 'bg-warning text-white',
}

function ToastCard({ item, onDismiss }: { item: ToastItem; onDismiss: (id: number) => void }) {
  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(item.id), item.durationMs)
    return () => window.clearTimeout(timer)
  }, [item.id, item.durationMs, onDismiss])

  return (
    <div
      role="status"
      className={cn(
        'pointer-events-auto flex w-[min(92vw,420px)] items-center gap-3 rounded-[18px] px-4 py-3 text-sm font-medium shadow-[var(--shadow-lg)]',
        toneClasses[item.tone],
      )}
    >
      <span className="flex-1">{item.message}</span>
      {item.action && (
        <button
          type="button"
          onClick={() => {
            item.action?.onClick()
            onDismiss(item.id)
          }}
          className="shrink-0 text-xs font-bold uppercase tracking-[0.08em] text-blue-300 hover:text-blue-200"
        >
          {item.action.label}
        </button>
      )}
    </div>
  )
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const idRef = useRef(0)

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const show = useCallback<ToastContextValue['show']>((message, options) => {
    idRef.current += 1
    const item: ToastItem = {
      id: idRef.current,
      message,
      tone: options?.tone ?? 'info',
      durationMs: options?.durationMs ?? 4200,
      action: options?.action,
    }
    setToasts((current) => [...current, item])
  }, [])

  const value = useMemo<ToastContextValue>(() => ({ show, dismiss }), [show, dismiss])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex flex-col items-center gap-2 px-4">
        {toasts.map((toast) => (
          <ToastCard key={toast.id} item={toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}
