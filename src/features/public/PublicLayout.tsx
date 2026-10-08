import { Outlet } from 'react-router-dom'
import { PublicHeader } from './components/PublicHeader'
import { BottomNav } from './components/BottomNav'

export function PublicLayout() {
  return (
    <div className="flex h-full flex-col bg-bg">
      <PublicHeader />
      <main className="relative min-h-0 flex-1">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
