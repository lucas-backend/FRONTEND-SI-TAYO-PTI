import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Bus, Route, User } from '@/api/types'
import { Button, Toggle } from '@/components/ui'
import type { z } from 'zod'
import { Drawer } from './Drawer'
import { busSchema } from '../lib/busForm'
import type { BusFormValues } from '../lib/busForm'

type BusFormInput = z.input<typeof busSchema>

interface BusFormDrawerProps {
  open: boolean
  mode: 'create' | 'edit'
  bus: Bus | null
  routes: Route[]
  drivers: User[]
  loading: boolean
  onClose: () => void
  onSubmit: (values: BusFormValues) => void
}

const FIELD =
  'h-12 w-full rounded-[14px] bg-primary-soft px-4 text-sm font-semibold text-ink placeholder:font-medium placeholder:text-muted/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary'
const LABEL = 'text-[11px] font-bold uppercase tracking-[0.08em] text-muted'

const EMPTY: BusFormValues = { plate: '', label: '', routeId: 'J1', driverId: '', capacity: 28, active: true }

export function BusFormDrawer({ open, mode, bus, routes, drivers, loading, onClose, onSubmit }: BusFormDrawerProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<BusFormInput, unknown, BusFormValues>({ resolver: zodResolver(busSchema), defaultValues: EMPTY })

  useEffect(() => {
    if (!open) return
    reset(
      bus
        ? {
            plate: bus.plate,
            label: bus.label,
            routeId: bus.routeId,
            driverId: bus.driverId,
            capacity: bus.capacity,
            active: bus.active,
          }
        : EMPTY,
    )
  }, [open, bus, reset])

  const active = useWatch({ control, name: 'active' })

  return (
    <Drawer
      open={open}
      title={mode === 'create' ? 'Tambah Armada' : 'Ubah Armada'}
      description={mode === 'create' ? 'Daftarkan bus baru ke dalam armada.' : 'Perbarui data bus yang dipilih.'}
      onClose={onClose}
      footer={
        <div className="flex gap-3">
          <Button variant="soft" fullWidth onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button type="submit" form="bus-form" fullWidth loading={loading}>
            {mode === 'create' ? 'Simpan Bus' : 'Simpan Perubahan'}
          </Button>
        </div>
      }
    >
      <form id="bus-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
        <div className="flex flex-col gap-2">
          <label htmlFor="bus-plate" className={LABEL}>
            Nomor Plat
          </label>
          <input
            id="bus-plate"
            {...register('plate')}
            placeholder="BE 1234 XX"
            className={FIELD}
            style={{ textTransform: 'uppercase' }}
          />
          {errors.plate && <p className="text-xs font-semibold text-danger">{errors.plate.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="bus-label" className={LABEL}>
            Nama Armada
          </label>
          <input id="bus-label" {...register('label')} placeholder="Bus 04" className={FIELD} />
          {errors.label && <p className="text-xs font-semibold text-danger">{errors.label.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="bus-route" className={LABEL}>
            Jalur
          </label>
          <select id="bus-route" {...register('routeId')} className={FIELD}>
            <option value="">Pilih jalur</option>
            {routes.map((route) => (
              <option key={route.id} value={route.id}>
                {route.name}
              </option>
            ))}
          </select>
          {errors.routeId && <p className="text-xs font-semibold text-danger">{errors.routeId.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="bus-driver" className={LABEL}>
            Supir
          </label>
          <select id="bus-driver" {...register('driverId')} className={FIELD}>
            <option value="">Pilih supir</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.name}
                {driver.active ? '' : ' (nonaktif)'}
              </option>
            ))}
          </select>
          {errors.driverId && <p className="text-xs font-semibold text-danger">{errors.driverId.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="bus-capacity" className={LABEL}>
            Kapasitas (1-60)
          </label>
          <input
            id="bus-capacity"
            type="number"
            min={1}
            max={60}
            {...register('capacity')}
            className={FIELD}
          />
          {errors.capacity && <p className="text-xs font-semibold text-danger">{errors.capacity.message}</p>}
        </div>

        <div className="flex items-center justify-between rounded-[14px] bg-primary-soft px-4 py-3">
          <div>
            <p className="text-sm font-bold text-ink">Status Aktif</p>
            <p className="text-xs text-muted">Bus nonaktif tidak muncul di peta publik.</p>
          </div>
          <Toggle checked={active} onChange={(value) => setValue('active', value)} label="Status aktif" />
        </div>
      </form>
    </Drawer>
  )
}
