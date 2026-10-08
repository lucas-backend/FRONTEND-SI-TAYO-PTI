import { Link } from 'react-router-dom'
import { ArrowLeft, Construction } from 'lucide-react'
import { Card, Chip } from '@/components/ui'

export interface PlaceholderProps {
  title: string
  tahap: string
}

export function Placeholder({ title, tahap }: PlaceholderProps) {
  return (
    <div className="mx-auto flex min-h-full max-w-2xl flex-col gap-6 px-5 py-10">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Kembali
      </Link>
      <Card className="flex flex-col items-start gap-4 p-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <Construction className="h-6 w-6" aria-hidden />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold tracking-[-0.02em] text-ink">{title}</h1>
          <p className="mt-2 text-[15px] text-muted">
            Halaman ini dikerjakan pada {tahap} sesuai urutan di BRIEF bagian 16.
          </p>
        </div>
        <Chip tone="warning">Belum tersedia</Chip>
      </Card>
    </div>
  )
}
