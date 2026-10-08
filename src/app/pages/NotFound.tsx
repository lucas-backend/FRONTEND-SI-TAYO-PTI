import { Link } from 'react-router-dom'
import { Button, Card } from '@/components/ui'

export function NotFound() {
  return (
    <div className="mx-auto flex min-h-full max-w-xl items-center px-5 py-10">
      <Card className="w-full p-8 text-center">
        <p className="text-5xl font-extrabold tracking-[-0.04em] text-primary">404</p>
        <h1 className="mt-3 text-xl font-bold text-ink">Halaman tidak ditemukan</h1>
        <p className="mt-2 text-sm text-muted">Tautan yang Anda tuju tidak tersedia.</p>
        <Link to="/" className="mt-6 inline-block">
          <Button>Kembali ke Beranda</Button>
        </Link>
      </Card>
    </div>
  )
}
