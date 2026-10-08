import { cn } from '@/lib/cn'

export interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('animate-pulse rounded-[var(--radius-input)] bg-line', className)} aria-hidden />
}
