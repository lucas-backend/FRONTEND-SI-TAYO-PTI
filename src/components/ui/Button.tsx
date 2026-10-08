import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type ButtonVariant = 'primary' | 'danger' | 'soft' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-hover active:scale-[0.99] shadow-[var(--shadow-soft)]',
  danger: 'bg-danger text-white hover:brightness-110 active:scale-[0.99] shadow-[var(--shadow-soft)]',
  soft: 'bg-primary-soft text-primary hover:brightness-[0.98] active:scale-[0.99]',
  ghost: 'bg-transparent text-ink hover:bg-primary-soft',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-5 text-[15px]',
  lg: 'h-14 px-6 text-base',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  loading?: boolean
  icon?: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  icon,
  className,
  children,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        'inline-flex select-none items-center justify-center gap-2 rounded-[var(--radius-input)] font-semibold tracking-[-0.01em] transition',
        'disabled:pointer-events-none disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {loading ? (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden
        />
      ) : (
        icon
      )}
      {children}
    </button>
  )
}
