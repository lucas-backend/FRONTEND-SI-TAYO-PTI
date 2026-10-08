import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface StatCardProps {
  icon: ReactNode
  label: string
  value: string
  hint?: string
  tone?: 'primary' | 'success' | 'warning' | 'danger'
}

const TONE: Record<NonNullable<StatCardProps['tone']>, string> = {
  primary: 'bg-primary-soft text-primary',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
}

export function StatCard({ icon, label, value, hint, tone = 'primary' }: StatCardProps) {
  return (
    <div className="rounded-[var(--radius-card)] bg-surface p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted">{label}</span>
        <span className={cn('flex h-9 w-9 items-center justify-center rounded-xl', TONE[tone])}>{icon}</span>
      </div>
      <p className="mt-3 text-3xl font-extrabold tracking-[-0.03em] text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  )
}
