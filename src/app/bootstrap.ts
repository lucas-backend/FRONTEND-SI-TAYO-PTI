import { startSimulation, stopSimulation } from '@/mock/simulator/runner'

/** Titik masuk infrastruktur: menyalakan mesin simulasi + gateway mock. */
export function bootstrapSimulation(): void {
  startSimulation()
}

export function teardownSimulation(): void {
  stopSimulation()
}
