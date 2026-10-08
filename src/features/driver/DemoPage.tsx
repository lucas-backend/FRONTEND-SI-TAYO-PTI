import { PhoneFrame } from './PhoneFrame'
import { DriverSimulator } from './DriverSimulator'
import { PublicMapPage } from '@/features/public/pages/PublicMapPage'

/**
 * Route /demo: simulator supir di kiri dan peta publik di kanan DALAM SATU TAB.
 * Ini jalur utama presentasi karena tab latar depan tidak di-throttle browser.
 */
export function DemoPage() {
  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-bg">
      <div className="flex h-full w-[410px] shrink-0 items-center justify-center border-r border-line bg-primary-soft/40 p-2.5">
        <PhoneFrame>
          <DriverSimulator />
        </PhoneFrame>
      </div>
      <div className="relative min-w-0 flex-1 overflow-hidden">
        <PublicMapPage />
      </div>
    </div>
  )
}
