import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { User } from '@/api/types'
import { Button, Toggle } from '@/components/ui'
import { Drawer } from './Drawer'
import { accountSchema } from '../lib/accountForm'
import type { AccountFormValues } from '../lib/accountForm'

interface AccountFormDrawerProps {
  open: boolean
  mode: 'create' | 'edit'
  account: User | null
  loading: boolean
  onClose: () => void
  onSubmit: (values: AccountFormValues) => void
}

const FIELD =
  'h-12 w-full rounded-[14px] bg-primary-soft px-4 text-sm font-semibold text-ink placeholder:font-medium placeholder:text-muted/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary'
const LABEL = 'text-[11px] font-bold uppercase tracking-[0.08em] text-muted'

const EMPTY: AccountFormValues = { name: '', username: '', role: 'DRIVER', active: true }

export function AccountFormDrawer({ open, mode, account, loading, onClose, onSubmit }: AccountFormDrawerProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<AccountFormValues>({ resolver: zodResolver(accountSchema), defaultValues: EMPTY })

  useEffect(() => {
    if (!open) return
    reset(
      account
        ? { name: account.name, username: account.username, role: account.role, active: account.active }
        : EMPTY,
    )
  }, [open, account, reset])

  const active = useWatch({ control, name: 'active' })

  return (
    <Drawer
      open={open}
      title={mode === 'create' ? 'Tambah Akun' : 'Ubah Akun'}
      description={
        mode === 'create'
          ? 'Akun baru akan mendapat PIN acak yang ditampilkan sekali.'
          : 'Perbarui data akun. PIN tidak berubah dari sini.'
      }
      onClose={onClose}
      footer={
        <div className="flex gap-3">
          <Button variant="soft" fullWidth onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button type="submit" form="account-form" fullWidth loading={loading}>
            {mode === 'create' ? 'Simpan Akun' : 'Simpan Perubahan'}
          </Button>
        </div>
      }
    >
      <form id="account-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
        <div className="flex flex-col gap-2">
          <label htmlFor="account-name" className={LABEL}>
            Nama Lengkap
          </label>
          <input id="account-name" {...register('name')} placeholder="Bpk. Contoh Nama" className={FIELD} />
          {errors.name && <p className="text-xs font-semibold text-danger">{errors.name.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="account-username" className={LABEL}>
            Username / ID Pengemudi
          </label>
          <input id="account-username" {...register('username')} placeholder="DRV-00000" className={FIELD} />
          {errors.username && <p className="text-xs font-semibold text-danger">{errors.username.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="account-role" className={LABEL}>
            Peran
          </label>
          <select id="account-role" {...register('role')} className={FIELD}>
            <option value="DRIVER">Supir</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <div className="flex items-center justify-between rounded-[14px] bg-primary-soft px-4 py-3">
          <div>
            <p className="text-sm font-bold text-ink">Akun Aktif</p>
            <p className="text-xs text-muted">Akun nonaktif tidak dapat login.</p>
          </div>
          <Toggle checked={active} onChange={(value) => setValue('active', value)} label="Status akun" />
        </div>
      </form>
    </Drawer>
  )
}
