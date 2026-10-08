import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type ChipTone = 'default' | 'primary' | 'success' | 'muted' | 'night' | 'warning' | 'danger'

const toneClasses: Record<ChipTone, string> = {
  default: 'bg-primary-soft text-ink',
  primary: 'bg-primary text-white',
  success: 'bg-success-soft text-success',
  muted: 'bg-surface text-muted shadow-[var(--shadow-soft)]',
  night: 'bg-night text-white',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
}

const dotClasses: Record<ChipTone, string> = {
  default: 'bg-primary',
  primary: 'bg-white',
  success: 'bg-success',
  muted: 'bg-muted',
  night: 'bg-white',
  warning: 'bg-warning',
  danger: 'bg-danger',
}

export interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: ChipTone
  dot?: boolean
  icon?: ReactNode
}

export function Chip({ tone = 'default', dot = false, icon, className, children, ...rest }: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.06em]',
        toneClasses[tone],
        className,
      )}
      {...rest}
    >
      {dot && <span className={cn('h-2 w-2 rounded-full', dotClasses[tone])} aria-hidden />}
      {icon}
      {children}
    </span>
  )
}
