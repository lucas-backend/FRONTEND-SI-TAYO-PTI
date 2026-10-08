import { CircleCheck, CircleX } from 'lucide-react'
import { cn } from '@/lib/cn'
import { formatCapacityStatus } from '@/lib/format'

export interface BadgeProps {
  status: 'AVAILABLE' | 'FULL'
  className?: string
}

export function Badge({ status, className }: BadgeProps) {
  const available = status === 'AVAILABLE'
  const Icon = available ? CircleCheck : CircleX
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-[0.04em] text-white',
        available ? 'bg-success' : 'bg-danger',
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {formatCapacityStatus(status)}
    </span>
  )
}
