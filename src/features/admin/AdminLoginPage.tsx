import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Bus, ShieldCheck } from 'lucide-react'
import { Button, Card, Chip } from '@/components/ui'
import { DEMO_MODE } from '@/config'
import { useAdminStore } from '@/store/useAdminStore'

interface LocationState {
  from?: string
}

export function AdminLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAdminStore((state) => state.user)
  const login = useAdminStore((state) => state.login)
  const loading = useAdminStore((state) => state.loading)
  const error = useAdminStore((state) => state.error)

  const [username, setUsername] = useState('')
  const [pin, setPin] = useState('')
  const [showPin, setShowPin] = useState(false)

  if (user && user.role === 'ADMIN') {
    const from = (location.state as LocationState | null)?.from
    return <Navigate to={from && from.startsWith('/admin') ? from : '/admin/dashboard'} replace />
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const ok = await login(username.trim(), pin)
    if (ok) {
      const from = (location.state as LocationState | null)?.from
      navigate(from && from.startsWith('/admin') ? from : '/admin/dashboard', { replace: true })
    }
  }

  return (
    <div className="flex min-h-full items-center justify-center bg-bg px-4 py-10">
      <Card className="w-full max-w-md p-7 shadow-[var(--shadow-card)]">
        <span className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-primary text-white shadow-[var(--shadow-soft)]">
          <Bus className="h-7 w-7" aria-hidden />
        </span>
        <h1 className="mt-6 text-3xl font-extrabold tracking-[-0.03em] text-ink">Masuk Admin</h1>
        <p className="mt-2 text-sm text-muted">Sistem Pelacak Bus Unila • Panel Pengelolaan Armada</p>

        <form onSubmit={onSubmit} className="mt-7 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="admin-username" className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted">
              Nama Pengguna
            </label>
            <input
              id="admin-username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="admin"
              autoComplete="username"
              className="h-14 w-full rounded-[18px] bg-primary-soft px-5 text-base font-semibold text-ink placeholder:font-semibold placeholder:text-muted/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label htmlFor="admin-pin" className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted">
                Kata Sandi
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
              id="admin-pin"
              value={pin}
              onChange={(event) => setPin(event.target.value)}
              type={showPin ? 'text' : 'password'}
              placeholder="••••••"
              autoComplete="current-password"
              className="h-14 w-full rounded-[18px] bg-primary-soft px-5 text-base font-semibold text-ink placeholder:tracking-[0.3em] placeholder:text-muted/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-xl bg-danger-soft px-3 py-2 text-sm font-semibold text-danger">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" fullWidth loading={loading} className="mt-1">
            Masuk
          </Button>
        </form>

        {DEMO_MODE && (
          <div className="mt-5 flex items-start gap-2 rounded-[16px] bg-primary-soft px-4 py-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            <p className="text-xs font-medium text-muted">
              Mode demo — masuk dengan <span className="font-bold text-ink">admin</span> /{' '}
              <span className="font-bold text-ink">admin123</span>.
            </p>
          </div>
        )}

        <div className="mt-5 flex items-center justify-between">
          <Chip dot tone="success">
            Server UPT TIK Aktif
          </Chip>
          <Link to="/" className="text-xs font-bold uppercase tracking-[0.08em] text-primary hover:brightness-110">
            Kembali ke peta
          </Link>
        </div>
      </Card>
    </div>
  )
}
