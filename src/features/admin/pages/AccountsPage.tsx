import { useMemo, useState } from 'react'
import { KeyRound, Pencil, Plus, Power, UserPlus } from 'lucide-react'
import type { User, UserInput } from '@/api/types'
import { Button, Chip, useToast } from '@/components/ui'
import { formatAgo } from '@/lib/time'
import {
  useCreateUser,
  useResetUserPin,
  useSetUserActive,
  useUpdateUser,
  useUsersQuery,
} from '../hooks/useAdminQueries'
import { EmptyState, ErrorState, TableSkeleton } from '../components/TableStates'
import { AccountFormDrawer } from '../components/AccountFormDrawer'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { PinRevealDialog } from '../components/PinRevealDialog'
import type { AccountFormValues } from '../lib/accountForm'

const ROLE_LABEL = { ADMIN: 'Admin', DRIVER: 'Supir' } as const

export function AccountsPage() {
  const usersQuery = useUsersQuery()
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const setUserActive = useSetUserActive()
  const resetUserPin = useResetUserPin()
  const { show } = useToast()

  const [query, setQuery] = useState('')
  const [drawer, setDrawer] = useState<{ open: boolean; account: User | null }>({ open: false, account: null })
  const [confirmDeactivate, setConfirmDeactivate] = useState<User | null>(null)
  const [pinReveal, setPinReveal] = useState<{ open: boolean; name: string; pin: string }>({
    open: false,
    name: '',
    pin: '',
  })

  const users = useMemo(() => {
    const term = query.trim().toLowerCase()
    const list = usersQuery.data ?? []
    if (!term) return list
    return list.filter(
      (user) => user.name.toLowerCase().includes(term) || user.username.toLowerCase().includes(term),
    )
  }, [usersQuery.data, query])

  const onSubmit = async (values: AccountFormValues) => {
    const input: UserInput = values
    try {
      if (drawer.account) {
        await updateUser.mutateAsync({ id: drawer.account.id, input })
        show('Akun berhasil diperbarui', { tone: 'success' })
      } else {
        const result = await createUser.mutateAsync(input)
        show('Akun baru berhasil ditambahkan', { tone: 'success' })
        setPinReveal({ open: true, name: result.user.name, pin: result.pin })
      }
      setDrawer({ open: false, account: null })
    } catch (error) {
      show(error instanceof Error ? error.message : 'Gagal menyimpan akun', { tone: 'danger' })
    }
  }

  const onResetPin = async (account: User) => {
    try {
      const result = await resetUserPin.mutateAsync(account.id)
      setPinReveal({ open: true, name: result.user.name, pin: result.pin })
    } catch (error) {
      show(error instanceof Error ? error.message : 'Gagal mereset PIN', { tone: 'danger' })
    }
  }

  const onActivate = (account: User) => {
    setUserActive.mutate(
      { id: account.id, active: true },
      {
        onSuccess: () => show(`${account.name} diaktifkan`, { tone: 'success' }),
        onError: (error) => show(error.message, { tone: 'danger' }),
      },
    )
  }

  const onConfirmDeactivate = async () => {
    if (!confirmDeactivate) return
    try {
      await setUserActive.mutateAsync({ id: confirmDeactivate.id, active: false })
      show(`${confirmDeactivate.name} dinonaktifkan`, { tone: 'success' })
      setConfirmDeactivate(null)
    } catch (error) {
      show(error instanceof Error ? error.message : 'Gagal menonaktifkan akun', { tone: 'danger' })
    }
  }

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-ink">Kelola Akun</h1>
          <p className="mt-1 text-sm text-muted">Kelola akun supir dan admin beserta aksesnya.</p>
        </div>
        <Button icon={<UserPlus className="h-4 w-4" />} onClick={() => setDrawer({ open: true, account: null })}>
          Tambah Akun
        </Button>
      </header>

      <div className="rounded-[var(--radius-card)] bg-surface shadow-[var(--shadow-soft)]">
        <div className="border-b border-line p-4">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari nama atau username..."
            aria-label="Cari akun"
            className="h-11 w-full max-w-sm rounded-[14px] bg-primary-soft px-4 text-sm font-medium text-ink placeholder:text-muted/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        {usersQuery.isLoading ? (
          <TableSkeleton cols={6} />
        ) : usersQuery.isError ? (
          <ErrorState
            message={usersQuery.error instanceof Error ? usersQuery.error.message : 'Terjadi kesalahan'}
            onRetry={() => void usersQuery.refetch()}
          />
        ) : users.length === 0 ? (
          <EmptyState
            icon={<UserPlus className="h-6 w-6" />}
            title="Belum ada akun"
            description="Tambahkan akun supir atau admin terlebih dahulu."
            action={
              <Button icon={<Plus className="h-4 w-4" />} onClick={() => setDrawer({ open: true, account: null })}>
                Tambah Akun
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-line text-[11px] font-bold uppercase tracking-[0.08em] text-muted">
                  <th className="px-4 py-3">Nama</th>
                  <th className="px-4 py-3">Username / ID</th>
                  <th className="px-4 py-3">Peran</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Login Terakhir</th>
                  <th className="px-4 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((account) => (
                  <tr key={account.id} className="border-b border-line last:border-0 hover:bg-primary-soft/50">
                    <td className="px-4 py-3 font-bold text-ink">{account.name}</td>
                    <td className="px-4 py-3 text-muted">{account.username}</td>
                    <td className="px-4 py-3">
                      <Chip tone={account.role === 'ADMIN' ? 'primary' : 'default'}>{ROLE_LABEL[account.role]}</Chip>
                    </td>
                    <td className="px-4 py-3">
                      <Chip tone={account.active ? 'success' : 'danger'} dot>
                        {account.active ? 'Aktif' : 'Nonaktif'}
                      </Chip>
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {account.lastLoginAt ? formatAgo(account.lastLoginAt) : 'Belum pernah'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setDrawer({ open: true, account })}
                          aria-label={`Ubah ${account.name}`}
                          className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-primary-soft hover:text-ink"
                        >
                          <Pencil className="h-4 w-4" aria-hidden />
                        </button>
                        <button
                          type="button"
                          onClick={() => void onResetPin(account)}
                          aria-label={`Reset PIN ${account.name}`}
                          className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-primary-soft hover:text-ink"
                        >
                          <KeyRound className="h-4 w-4" aria-hidden />
                        </button>
                        <button
                          type="button"
                          onClick={() => (account.active ? setConfirmDeactivate(account) : onActivate(account))}
                          aria-label={account.active ? `Nonaktifkan ${account.name}` : `Aktifkan ${account.name}`}
                          className={
                            account.active
                              ? 'flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-danger-soft hover:text-danger'
                              : 'flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-success-soft hover:text-success'
                          }
                        >
                          <Power className="h-4 w-4" aria-hidden />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AccountFormDrawer
        open={drawer.open}
        mode={drawer.account ? 'edit' : 'create'}
        account={drawer.account}
        loading={createUser.isPending || updateUser.isPending}
        onClose={() => setDrawer({ open: false, account: null })}
        onSubmit={onSubmit}
      />

      <ConfirmDialog
        open={Boolean(confirmDeactivate)}
        title="Nonaktifkan akun?"
        description={
          confirmDeactivate
            ? `${confirmDeactivate.name} tidak akan bisa login sampai diaktifkan kembali.`
            : ''
        }
        confirmLabel="Nonaktifkan"
        loading={setUserActive.isPending}
        onConfirm={() => void onConfirmDeactivate()}
        onCancel={() => setConfirmDeactivate(null)}
      />

      <PinRevealDialog
        open={pinReveal.open}
        name={pinReveal.name}
        pin={pinReveal.pin}
        onClose={() => setPinReveal({ open: false, name: '', pin: '' })}
      />
    </div>
  )
}
