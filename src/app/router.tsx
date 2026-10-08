import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { PublicLayout } from '@/features/public/PublicLayout'
import { PublicMapPage } from '@/features/public/pages/PublicMapPage'
import { SchedulePage } from '@/features/public/pages/SchedulePage'
import { FleetPage } from '@/features/public/pages/FleetPage'
import { CivitasPage } from '@/features/public/pages/CivitasPage'
import { DriverPage } from '@/features/driver/DriverPage'
import { DemoPage } from '@/features/driver/DemoPage'
import { DevShowcase } from './pages/DevShowcase'
import { Placeholder } from './pages/Placeholder'
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
  { path: '/admin/*', element: <Placeholder title="Web Admin" tahap="tahap 8" /> },
  { path: '*', element: <NotFound /> },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
