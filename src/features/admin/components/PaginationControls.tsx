import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationControlsProps {
  pageIndex: number
  pageCount: number
  total: number
  onPrevious: () => void
  onNext: () => void
}

export function PaginationControls({
  pageIndex,
  pageCount,
  total,
  onPrevious,
  onNext,
}: PaginationControlsProps) {
  const safePageCount = Math.max(1, pageCount)
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
      <p className="text-xs font-medium text-muted">
        Menampilkan halaman {pageIndex + 1} dari {safePageCount} • {total} data
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrevious}
          disabled={pageIndex <= 0}
          aria-label="Halaman sebelumnya"
          className="flex h-9 items-center gap-1 rounded-full bg-primary-soft px-3 text-sm font-semibold text-primary transition disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
          Sebelumnya
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={pageIndex >= safePageCount - 1}
          aria-label="Halaman berikutnya"
          className="flex h-9 items-center gap-1 rounded-full bg-primary-soft px-3 text-sm font-semibold text-primary transition disabled:opacity-40"
        >
          Berikutnya
          <ChevronRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  )
}
