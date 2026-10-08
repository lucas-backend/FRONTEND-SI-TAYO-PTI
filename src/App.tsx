import { useEffect } from 'react'
import { AppProviders } from '@/app/providers'
import { AppRouter } from '@/app/router'
import { bootstrapSimulation, teardownSimulation } from '@/app/bootstrap'

export default function App() {
  useEffect(() => {
    bootstrapSimulation()
    return () => teardownSimulation()
  }, [])

  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  )
}
