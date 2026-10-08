import { startSimulation, stopSimulation } from '@/mock/simulator/runner'

/** Titik masuk infrastruktur: menyalakan mesin simulasi + gateway mock. */
export function bootstrapSimulation(forceLeader = false): void {
  startSimulation(forceLeader)
}

export function teardownSimulation(): void {
  stopSimulation()
}
