import { lazy, Suspense, type ReactNode } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { Skeleton } from '@/components/ui'
import { PublicLayout } from '@/features/public/PublicLayout'
import { AdminLayout } from '@/features/admin/AdminLayout'
import { AdminLoginPage } from '@/features/admin/AdminLoginPage'
import { RequireAdmin } from '@/features/admin/RequireAdmin'
import { DevShowcase } from './pages/DevShowcase'
import { NotFound } from './pages/NotFound'

const PublicMapPage = lazy(() => import('@/features/public/pages/PublicMapPage').then((module) => ({ default: module.PublicMapPage })))
const SchedulePage = lazy(() => import('@/features/public/pages/SchedulePage').then((module) => ({ default: module.SchedulePage })))
const PublicFleetPage = lazy(() => import('@/features/public/pages/FleetPage').then((module) => ({ default: module.FleetPage })))
const CivitasPage = lazy(() => import('@/features/public/pages/CivitasPage').then((module) => ({ default: module.CivitasPage })))
const DriverPage = lazy(() => import('@/features/driver/DriverPage').then((module) => ({ default: module.DriverPage })))
const DemoPage = lazy(() => import('@/features/driver/DemoPage').then((module) => ({ default: module.DemoPage })))
const DashboardPage = lazy(() => import('@/features/admin/pages/DashboardPage').then((module) => ({ default: module.DashboardPage })))
const LiveMonitorPage = lazy(() => import('@/features/admin/pages/LiveMonitorPage').then((module) => ({ default: module.LiveMonitorPage })))
const AdminFleetPage = lazy(() => import('@/features/admin/pages/FleetPage').then((module) => ({ default: module.FleetPage })))
const RoutePages = lazy(() => import('@/features/admin/pages/RoutesStubPage'))
const AccountsPage = lazy(() => import('@/features/admin/pages/AccountsPage').then((module) => ({ default: module.AccountsPage })))

function Lazy({ children }: { children: ReactNode }) {
  return <Suspense fallback={<div className="flex h-full items-center justify-center p-6"><Skeleton className="h-24 w-full max-w-xl" /></div>}>{children}</Suspense>
}

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <Lazy><PublicMapPage /></Lazy> },
      { path: '/jadwal', element: <Lazy><SchedulePage /></Lazy> },
      { path: '/armada', element: <Lazy><PublicFleetPage /></Lazy> },
      { path: '/civitas', element: <Lazy><CivitasPage /></Lazy> },
    ],
  },
  { path: '/dev', element: <DevShowcase /> },
  { path: '/driver', element: <Lazy><DriverPage /></Lazy> },
  { path: '/demo', element: <Lazy><DemoPage /></Lazy> },
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
      { path: 'dashboard', element: <Lazy><DashboardPage /></Lazy> },
      { path: 'monitor', element: <Lazy><LiveMonitorPage /></Lazy> },
      { path: 'armada', element: <Lazy><AdminFleetPage /></Lazy> },
      { path: 'rute', element: <Lazy><RoutePages /></Lazy> },
      { path: 'rute/:id', element: <Lazy><RoutePages /></Lazy> },
      { path: 'rute-halte', element: <Lazy><RoutePages /></Lazy> },
      { path: 'rute-halte/:id', element: <Lazy><RoutePages /></Lazy> },
      { path: 'akun', element: <Lazy><AccountsPage /></Lazy> },
    ],
  },
  { path: '*', element: <NotFound /> },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
