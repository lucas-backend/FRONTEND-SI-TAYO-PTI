import { useCallback, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  flexRender,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ArrowUpDown, Bus as BusIcon, Pencil, Plus, Trash2 } from 'lucide-react'
import type { Bus } from '@/api/types'
import { Button, Chip, Toggle, useToast } from '@/components/ui'
import { cn } from '@/lib/cn'
import { formatBusStatus } from '@/lib/format'
import { useRoutes } from '@/hooks/useSimulation'
import {
  useBusesQuery,
  useCreateBus,
  useDeleteBus,
  useSetBusActive,
  useUpdateBus,
  useUsersQuery,
} from '../hooks/useAdminQueries'
import { EmptyState, ErrorState, TableSkeleton } from '../components/TableStates'
import { PaginationControls } from '../components/PaginationControls'
import { BusFormDrawer } from '../components/BusFormDrawer'
import { ConfirmDialog } from '../components/ConfirmDialog'
import type { BusFormValues } from '../lib/busForm'

const fleetFeatures = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns,
  sortFns,
})

type RouteFilter = 'ALL' | 'J1' | 'J2'

const STATUS_TONE = { ACTIVE: 'success', STANDBY: 'default', OFFLINE: 'danger' } as const

export function FleetPage() {
  const [searchParams] = useSearchParams()
  const busesQuery = useBusesQuery()
  const usersQuery = useUsersQuery()
  const routes = useRoutes()

  const routeMap = useMemo(() => new Map(routes.map((route) => [route.id, route.name])), [routes])
  const drivers = useMemo(() => (usersQuery.data ?? []).filter((user) => user.role === 'DRIVER'), [usersQuery.data])
  const driverMap = useMemo(() => new Map(drivers.map((driver) => [driver.id, driver.name])), [drivers])

  const [routeFilter, setRouteFilter] = useState<RouteFilter>('ALL')
  const [drawer, setDrawer] = useState<{ open: boolean; bus: Bus | null }>({ open: false, bus: null })
  const [confirmBus, setConfirmBus] = useState<Bus | null>(null)

  const createBus = useCreateBus()
  const updateBus = useUpdateBus()
  const deleteBus = useDeleteBus()
  const setBusActive = useSetBusActive()
  const { show } = useToast()

  const onToggle = useCallback(
    (bus: Bus, active: boolean) => {
      setBusActive.mutate(
        { id: bus.id, active },
        {
          onSuccess: () => show(active ? `${bus.label} diaktifkan` : `${bus.label} dinonaktifkan`, { tone: 'success' }),
          onError: (error) => show(error.message, { tone: 'danger' }),
        },
      )
    },
    [setBusActive, show],
  )

  const columns = useMemo<ColumnDef<typeof fleetFeatures, Bus>[]>(
    () => [
      {
        accessorKey: 'plate',
        header: 'Plat',
        cell: (info) => <span className="font-bold text-ink">{info.getValue() as string}</span>,
      },
      { accessorKey: 'label', header: 'Armada' },
      {
        accessorKey: 'routeId',
        header: 'Jalur',
        cell: (info) => routeMap.get(info.getValue() as string) ?? '-',
      },
      {
        accessorKey: 'driverId',
        header: 'Supir',
        enableSorting: false,
        cell: (info) => driverMap.get(info.getValue() as string) ?? '-',
      },
      {
        accessorKey: 'capacity',
        header: 'Kapasitas',
        cell: (info) => `${info.getValue() as number} kursi`,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => {
          const status = info.getValue() as Bus['status']
          return <Chip tone={STATUS_TONE[status]}>{formatBusStatus(status)}</Chip>
        },
      },
      {
        id: 'active',
        header: 'Aktif',
        enableSorting: false,
        cell: ({ row }) => (
          <Toggle
            checked={row.original.active}
            onChange={(value) => onToggle(row.original, value)}
            label={`Aktifkan ${row.original.label}`}
          />
        ),
      },
      {
        id: 'aksi',
        header: 'Aksi',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setDrawer({ open: true, bus: row.original })}
              aria-label={`Ubah ${row.original.label}`}
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-primary-soft hover:text-ink"
            >
              <Pencil className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => setConfirmBus(row.original)}
              aria-label={`Hapus ${row.original.label}`}
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-danger-soft hover:text-danger"
            >
              <Trash2 className="h-4 w-4" aria-hidden />
            </button>
          </div>
        ),
      },
    ],
    [routeMap, driverMap, onToggle],
  )

  const table = useTable({
    features: fleetFeatures,
    columns,
    data: busesQuery.data ?? [],
    initialState: {
      globalFilter: searchParams.get('q') ?? '',
      pagination: { pageIndex: 0, pageSize: 5 },
    },
  })

  const onRouteFilter = (value: RouteFilter) => {
    setRouteFilter(value)
    table.getColumn('routeId')?.setFilterValue(value === 'ALL' ? undefined : value)
  }

  const onSubmit = async (values: BusFormValues) => {
    try {
      if (drawer.bus) {
        await updateBus.mutateAsync({ id: drawer.bus.id, input: values })
        show('Armada berhasil diperbarui', { tone: 'success' })
      } else {
        await createBus.mutateAsync(values)
        show('Armada baru berhasil ditambahkan', { tone: 'success' })
      }
      setDrawer({ open: false, bus: null })
    } catch (error) {
      show(error instanceof Error ? error.message : 'Gagal menyimpan armada', { tone: 'danger' })
    }
  }

  const onConfirmDelete = async () => {
    if (!confirmBus) return
    try {
      await deleteBus.mutateAsync(confirmBus.id)
      show(`${confirmBus.label} dihapus`, { tone: 'success' })
      setConfirmBus(null)
    } catch (error) {
      show(error instanceof Error ? error.message : 'Gagal menghapus armada', { tone: 'danger' })
    }
  }

  const rows = table.getRowModel().rows
  const total = table.getFilteredRowModel().rows.length

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-ink">Kelola Armada</h1>
          <p className="mt-1 text-sm text-muted">Tambah, ubah, aktifkan, atau hapus bus armada.</p>
        </div>
        <Button icon={<Plus className="h-4 w-4" />} onClick={() => setDrawer({ open: true, bus: null })}>
          Tambah Bus
        </Button>
      </header>

      <div className="rounded-[var(--radius-card)] bg-surface shadow-[var(--shadow-soft)]">
        <div className="flex flex-wrap items-center gap-3 border-b border-line p-4">
          <input
            type="search"
            value={(table.state.globalFilter as string) ?? ''}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            placeholder="Cari plat, armada, supir..."
            aria-label="Cari armada"
            className="h-11 flex-1 min-w-[200px] rounded-[14px] bg-primary-soft px-4 text-sm font-medium text-ink placeholder:text-muted/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
          <select
            value={routeFilter}
            onChange={(event) => onRouteFilter(event.target.value as RouteFilter)}
            aria-label="Filter jalur"
            className="h-11 rounded-[14px] bg-primary-soft px-4 text-sm font-semibold text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <option value="ALL">Semua jalur</option>
            {routes.map((route) => (
              <option key={route.id} value={route.id}>
                {route.name}
              </option>
            ))}
          </select>
        </div>

        {busesQuery.isLoading ? (
          <TableSkeleton cols={7} />
        ) : busesQuery.isError ? (
          <ErrorState
            message={busesQuery.error instanceof Error ? busesQuery.error.message : 'Terjadi kesalahan'}
            onRetry={() => void busesQuery.refetch()}
          />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={<BusIcon className="h-6 w-6" />}
            title="Belum ada armada"
            description="Tambahkan bus pertama untuk mulai mengelola armada."
            action={
              <Button icon={<Plus className="h-4 w-4" />} onClick={() => setDrawer({ open: true, bus: null })}>
                Tambah Bus
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b border-line">
                    {headerGroup.headers.map((header) => {
                      const canSort = header.column.getCanSort()
                      const sorted = header.column.getIsSorted()
                      return (
                        <th key={header.id} className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-muted">
                          {header.isPlaceholder ? null : canSort ? (
                            <button
                              type="button"
                              onClick={header.column.getToggleSortingHandler()}
                              className="inline-flex items-center gap-1.5 hover:text-ink"
                            >
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {sorted === 'asc' ? (
                                <ArrowUp className="h-3.5 w-3.5" aria-hidden />
                              ) : sorted === 'desc' ? (
                                <ArrowDown className="h-3.5 w-3.5" aria-hidden />
                              ) : (
                                <ArrowUpDown className="h-3.5 w-3.5 opacity-50" aria-hidden />
                              )}
                            </button>
                          ) : (
                            flexRender(header.column.columnDef.header, header.getContext())
                          )}
                        </th>
                      )
                    })}
                  </tr>
                ))}
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className={cn('border-b border-line last:border-0 hover:bg-primary-soft/50')}>
                    {row.getAllCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 text-ink">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!busesQuery.isLoading && !busesQuery.isError && rows.length > 0 && (
          <div className="border-t border-line">
            <PaginationControls
              pageIndex={table.state.pagination.pageIndex}
              pageCount={table.getPageCount()}
              total={total}
              onPrevious={() => table.previousPage()}
              onNext={() => table.nextPage()}
            />
          </div>
        )}
      </div>

      <BusFormDrawer
        open={drawer.open}
        mode={drawer.bus ? 'edit' : 'create'}
        bus={drawer.bus}
        routes={routes}
        drivers={drivers}
        loading={createBus.isPending || updateBus.isPending}
        onClose={() => setDrawer({ open: false, bus: null })}
        onSubmit={onSubmit}
      />

      <ConfirmDialog
        open={Boolean(confirmBus)}
        title="Hapus armada?"
        description={
          confirmBus ? `${confirmBus.label} (${confirmBus.plate}) akan dihapus dari armada. Tindakan ini tidak dapat dibatalkan.` : ''
        }
        confirmLabel="Hapus"
        loading={deleteBus.isPending}
        onConfirm={() => void onConfirmDelete()}
        onCancel={() => setConfirmBus(null)}
      />
    </div>
  )
}
