import { cn } from '@/lib/cn'

export interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
  id?: string
  className?: string
}

export function Toggle({ checked, onChange, label, disabled = false, id, className }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition disabled:opacity-50',
        checked ? 'bg-primary' : 'bg-line',
        className,
      )}
    >
      <span
        className={cn(
          'inline-block h-5 w-5 transform rounded-full bg-white shadow transition',
          checked ? 'translate-x-6' : 'translate-x-1',
        )}
        aria-hidden
      />
    </button>
  )
}
