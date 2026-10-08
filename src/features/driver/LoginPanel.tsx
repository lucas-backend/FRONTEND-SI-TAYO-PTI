import { useState } from 'react'
import type { FormEvent } from 'react'
import { Bus } from 'lucide-react'
import { Button, Chip } from '@/components/ui'
import { useDriverStore } from '@/store/useDriverStore'

export function LoginPanel() {
  const login = useDriverStore((state) => state.login)
  const loading = useDriverStore((state) => state.loading)
  const error = useDriverStore((state) => state.error)
  const [username, setUsername] = useState('')
  const [pin, setPin] = useState('')
  const [showPin, setShowPin] = useState(false)

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    await login(username.trim(), pin)
  }

  return (
    <form onSubmit={onSubmit} className="flex h-full min-h-0 flex-col overflow-y-auto px-5 pb-6 pt-10">
      <span className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-primary text-white shadow-[var(--shadow-soft)]">
        <Bus className="h-8 w-8" aria-hidden />
      </span>

      <h1 className="mt-8 text-[40px] font-extrabold leading-none tracking-[-0.03em] text-ink">Driver Login</h1>
      <p className="mt-3 text-sm text-muted">Sistem Pelacak Bus Unila • Gerbang &amp; Jalur Lingkar</p>

      <div className="mt-9 flex flex-col gap-2">
        <label htmlFor="driver-id" className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted">
          ID Pengemudi
        </label>
        <input
          id="driver-id"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="DRV-19842"
          autoComplete="username"
          className="h-14 w-full rounded-[18px] bg-primary-soft px-5 text-lg font-semibold text-ink placeholder:font-semibold placeholder:text-muted/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="driver-pin" className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted">
            PIN Akses
          </label>
          <button
            type="button"
            onClick={() => setShowPin((value) => !value)}
            className="text-[11px] font-bold uppercase tracking-[0.1em] text-primary hover:brightness-110"
          >
            {showPin ? 'Sembunyi' : 'Lihat'}
          </button>
        </div>
        <input
          id="driver-pin"
          value={pin}
          onChange={(event) => setPin(event.target.value)}
          type={showPin ? 'text' : 'password'}
          inputMode="numeric"
          placeholder="••••••"
          autoComplete="current-password"
          className="h-14 w-full rounded-[18px] bg-primary-soft px-5 text-lg font-semibold tracking-[0.4em] text-ink placeholder:tracking-[0.4em] placeholder:text-muted/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>

      {error && (
        <p role="alert" className="mt-3 rounded-xl bg-danger-soft px-3 py-2 text-sm font-semibold text-danger">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" fullWidth loading={loading} className="mt-6 h-14">
        Login
      </Button>

      <div className="flex-1" />

      <div className="flex flex-col items-center gap-3 pb-2 pt-8">
        <Chip dot tone="success" icon={null} className="bg-surface shadow-[var(--shadow-soft)]">
          Server UPT TIK Aktif
        </Chip>
        <p className="text-[11px] font-semibold text-muted">Bantuan Teknis UPT TIK Unila • v2.4</p>
      </div>
    </form>
  )
}
