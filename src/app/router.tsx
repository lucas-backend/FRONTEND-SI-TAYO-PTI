import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { PublicLayout } from '@/features/public/PublicLayout'
import { PublicMapPage } from '@/features/public/pages/PublicMapPage'
import { SchedulePage } from '@/features/public/pages/SchedulePage'
import { FleetPage } from '@/features/public/pages/FleetPage'
import { CivitasPage } from '@/features/public/pages/CivitasPage'
import { DriverPage } from '@/features/driver/DriverPage'
import { DemoPage } from '@/features/driver/DemoPage'
import { AdminLayout } from '@/features/admin/AdminLayout'
import { AdminLoginPage } from '@/features/admin/AdminLoginPage'
import { RequireAdmin } from '@/features/admin/RequireAdmin'
import { DashboardPage } from '@/features/admin/pages/DashboardPage'
import { LiveMonitorPage } from '@/features/admin/pages/LiveMonitorPage'
import { FleetPage as AdminFleetPage } from '@/features/admin/pages/FleetPage'
import { RoutesStubPage } from '@/features/admin/pages/RoutesStubPage'
import { AccountsPage } from '@/features/admin/pages/AccountsPage'
import { DevShowcase } from './pages/DevShowcase'
import { NotFound } from './pages/NotFound'

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <PublicMapPage /> },
      { path: '/jadwal', element: <SchedulePage /> },
      { path: '/armada', element: <FleetPage /> },
      { path: '/civitas', element: <CivitasPage /> },
    ],
  },
  { path: '/dev', element: <DevShowcase /> },
  { path: '/driver', element: <DriverPage /> },
  { path: '/demo', element: <DemoPage /> },
  { path: '/admin/login', element: <AdminLoginPage /> },
  {
    path: '/admin',
    element: (
      <RequireAdmin>
        <AdminLayout />
      </RequireAdmin>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'monitor', element: <LiveMonitorPage /> },
      { path: 'armada', element: <AdminFleetPage /> },
      { path: 'rute-halte', element: <RoutesStubPage /> },
      { path: 'akun', element: <AccountsPage /> },
    ],
  },
  { path: '*', element: <NotFound /> },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
