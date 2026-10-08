import { createContext, useContext } from 'react'

export type ToastTone = 'info' | 'success' | 'danger' | 'warning'

export interface ToastAction {
  label: string
  onClick: () => void
}

export interface ToastOptions {
  tone?: ToastTone
  action?: ToastAction
  durationMs?: number
}

export interface ToastContextValue {
  show: (message: string, options?: ToastOptions) => void
  dismiss: (id: number) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast harus dipakai di dalam <ToastProvider>')
  return ctx
}
