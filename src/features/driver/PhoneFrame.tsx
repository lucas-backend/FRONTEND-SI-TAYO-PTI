import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface PhoneFrameProps {
  children: ReactNode
  className?: string
}

/**
 * Bingkai ponsel supir (~390x800). Di layar kecil mengisi penuh viewport;
 * di desktop tampil sebagai perangkat dengan sudut membulat. Tinggi mengikuti
 * tinggi induk (dikendalikan oleh halaman pemakai).
 */
export function PhoneFrame({ children, className }: PhoneFrameProps) {
  return (
    <div
      className={cn(
        'relative mx-auto flex h-full w-full flex-col overflow-hidden bg-bg',
        'md:max-w-[390px] md:rounded-[44px] md:border-[10px] md:border-night md:shadow-[var(--shadow-lg)]',
        className,
      )}
    >
      <div className="flex h-full min-h-0 w-full flex-col">{children}</div>
    </div>
  )
}
