import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ChevronDown, LifeBuoy, Mail, MapPin, MessageSquare, Phone } from 'lucide-react'
import { Button, Card, Chip, Toggle, useToast } from '@/components/ui'
import { cn } from '@/lib/cn'

const schema = z.object({
  nama: z.string().min(2, 'Nama minimal 2 karakter'),
  pesan: z.string().min(5, 'Pesan minimal 5 karakter'),
})

type FormValues = z.infer<typeof schema>

const STEPS = [
  'Buka peta dan pilih jalur (Jalur 1 atau Jalur 2).',
  'Ketuk marker bus untuk melihat kapasitas dan ETA ke tiap halte.',
  'Ketuk "Lokasi Saya" untuk estimasi bus tercepat ke posisi Anda.',
]

const FAQ = [
  {
    q: 'Seberapa sering posisi bus diperbarui?',
    a: 'Posisi diperbarui setiap 3 detik dari aplikasi supir, lalu digerakkan mulus di peta.',
  },
  {
    q: 'Apa arti status Penuh?',
    a: 'Status Penuh berarti tidak ada kursi tersisa; tunggu bus berikutnya yang tercantum di tab Jadwal Halte.',
  },
  {
    q: 'Apakah aplikasi ini bisa dipakai tanpa login?',
    a: 'Ya, web publik dapat diakses tanpa login. Login hanya untuk admin dan supir.',
  },
]

export function CivitasPage() {
  const { show } = useToast()
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [notifBus, setNotifBus] = useState(true)
  const [notifFull, setNotifFull] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { nama: '', pesan: '' } })

  const onSubmit = handleSubmit(async (values) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    void values
    show('Terima kasih! Saran Anda terkirim ke UPT TIK.', { tone: 'success' })
    reset()
  })

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-4">
        <div>
          <h1 className="text-xl font-extrabold tracking-[-0.02em] text-ink">Civitas</h1>
          <p className="text-sm text-muted">Panduan, bantuan, dan masukan untuk layanan Bus Unila.</p>
        </div>

        <Card className="p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted">Cara Membaca Aplikasi</p>
          <ol className="mt-3 flex flex-col gap-3">
            {STEPS.map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {index + 1}
                </span>
                <span className="text-sm text-ink">{step}</span>
              </li>
            ))}
          </ol>
        </Card>

        <Card className="p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted">Pertanyaan Umum</p>
          <ul className="mt-2 flex flex-col divide-y divide-line">
            {FAQ.map((item, index) => {
              const open = openFaq === index
              return (
                <li key={item.q}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : index)}
                    aria-expanded={open}
                    className="flex w-full items-center gap-3 py-3 text-left"
                  >
                    <span className="flex-1 text-sm font-semibold text-ink">{item.q}</span>
                    <ChevronDown
                      className={cn('h-4 w-4 shrink-0 text-muted transition', open && 'rotate-180')}
                      aria-hidden
                    />
                  </button>
                  {open && <p className="pb-3 text-sm text-muted">{item.a}</p>}
                </li>
              )
            })}
          </ul>
        </Card>

        <Card className="p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted">Kontak UPT TIK Unila</p>
          <ul className="mt-3 flex flex-col gap-3 text-sm text-ink">
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-primary" aria-hidden />
              (0721) 701609
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-primary" aria-hidden />
              upttik@unila.ac.id
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-primary" aria-hidden />
              Gedung UPT TIK, Kampus Unila, Bandar Lampung
            </li>
          </ul>
        </Card>

        <Card className="p-5">
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] text-muted">
            <MessageSquare className="h-4 w-4" aria-hidden />
            Kirim Saran
          </p>
          <form className="mt-3 flex flex-col gap-3" onSubmit={onSubmit} noValidate>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="nama" className="text-[11px] font-bold uppercase tracking-[0.06em] text-muted">
                Nama
              </label>
              <input
                id="nama"
                {...register('nama')}
                placeholder="Nama Anda"
                className={cn(
                  'h-12 rounded-[var(--radius-input)] border border-line bg-primary-soft px-4 text-[15px] text-ink outline-none focus:border-primary',
                  errors.nama && 'border-danger',
                )}
              />
              {errors.nama && <p className="text-xs font-medium text-danger">{errors.nama.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="pesan" className="text-[11px] font-bold uppercase tracking-[0.06em] text-muted">
                Pesan
              </label>
              <textarea
                id="pesan"
                {...register('pesan')}
                rows={4}
                placeholder="Tulis masukan Anda"
                className={cn(
                  'resize-none rounded-[var(--radius-input)] border border-line bg-primary-soft px-4 py-3 text-[15px] text-ink outline-none focus:border-primary',
                  errors.pesan && 'border-danger',
                )}
              />
              {errors.pesan && <p className="text-xs font-medium text-danger">{errors.pesan.message}</p>}
            </div>
            <Button type="submit" fullWidth loading={isSubmitting}>
              Kirim Saran
            </Button>
          </form>
        </Card>

        <Card className="flex flex-col gap-4 p-5">
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] text-muted">
            <LifeBuoy className="h-4 w-4" aria-hidden />
            Pengaturan Notifikasi
          </p>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-ink">Ingatkan saat bus tiba 5 menit lagi</span>
            <Toggle
              checked={notifBus}
              onChange={(value) => {
                setNotifBus(value)
                show(value ? 'Pengingat bus diaktifkan' : 'Pengingat bus dimatikan', { tone: 'info' })
              }}
              label="Pengingat bus"
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-ink">Beri tahu saat bus berubah menjadi penuh</span>
            <Toggle
              checked={notifFull}
              onChange={(value) => {
                setNotifFull(value)
                show(value ? 'Notifikasi kapasitas diaktifkan' : 'Notifikasi kapasitas dimatikan', { tone: 'info' })
              }}
              label="Notifikasi kapasitas"
            />
          </div>
          <Chip tone="muted" className="self-start">
            Mode demo
          </Chip>
        </Card>
      </div>
    </div>
  )
}
