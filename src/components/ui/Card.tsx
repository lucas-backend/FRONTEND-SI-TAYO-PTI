import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export type CardProps = HTMLAttributes<HTMLDivElement>

export function Card({ className, ...rest }: CardProps) {
  return (
    <div
      className={cn('rounded-[var(--radius-card)] bg-surface shadow-[var(--shadow-soft)]', className)}
      {...rest}
    />
  )
}
