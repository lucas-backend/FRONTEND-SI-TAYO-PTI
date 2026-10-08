import { useEffect } from 'react'
import { AppProviders } from '@/app/providers'
import { AppRouter } from '@/app/router'
import { ReminderWatcher } from '@/app/ReminderWatcher'
import { bootstrapSimulation, teardownSimulation } from '@/app/bootstrap'

export default function App() {
  useEffect(() => {
    // Route /demo menampilkan simulator supir + peta publik dalam satu tab,
    // jadi mesin simulasi dipaksa menjadi leader di tab ini.
    const forceLeader = typeof window !== 'undefined' && window.location.pathname.startsWith('/demo')
    bootstrapSimulation(forceLeader)
    return () => teardownSimulation()
  }, [])

  return (
    <AppProviders>
      <ReminderWatcher />
      <AppRouter />
    </AppProviders>
  )
}
