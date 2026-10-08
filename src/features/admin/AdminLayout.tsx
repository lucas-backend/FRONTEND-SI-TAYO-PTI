import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AdminSidebar } from './components/AdminSidebar'
import { AdminTopbar } from './components/AdminTopbar'

export function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="flex h-full min-h-0 bg-bg">
      <aside className="hidden w-64 shrink-0 border-r border-line bg-surface lg:flex lg:flex-col">
        <AdminSidebar />
      </aside>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Tutup menu"
            className="absolute inset-0 bg-night/40"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[82vw] bg-surface shadow-[var(--shadow-lg)]">
            <AdminSidebar onNavigate={() => setDrawerOpen(false)} onClose={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar onOpenMenu={() => setDrawerOpen(true)} />
        <main className="relative min-h-0 flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
