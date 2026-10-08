import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { PublicHome } from './pages/PublicHome'
import { DevShowcase } from './pages/DevShowcase'
import { Placeholder } from './pages/Placeholder'
import { NotFound } from './pages/NotFound'

const router = createBrowserRouter([
  { path: '/', element: <PublicHome /> },
  { path: '/dev', element: <DevShowcase /> },
  { path: '/driver', element: <Placeholder title="Simulator Supir" tahap="tahap 7" /> },
  { path: '/admin/*', element: <Placeholder title="Web Admin" tahap="tahap 8" /> },
  { path: '*', element: <NotFound /> },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
