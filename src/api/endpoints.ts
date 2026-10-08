/** Path endpoint mengikuti kontrak REST di BRIEF bagian 6. */
export const ENDPOINTS = {
  login: '/auth/login',
  routes: '/routes',
  route: (id: string) => `/routes/${id}`,
  stops: '/stops',
  stop: (id: string) => `/stops/${id}`,
  buses: '/buses',
  bus: (id: string) => `/buses/${id}`,
  users: '/users',
  user: (id: string) => `/users/${id}`,
  busEta: (id: string) => `/buses/${id}/eta`,
  busCapacity: (id: string) => `/buses/${id}/capacity`,
  trackingStart: '/tracking/start',
  trackingStop: '/tracking/stop',
  trackingLocation: '/tracking/location',
} as const
