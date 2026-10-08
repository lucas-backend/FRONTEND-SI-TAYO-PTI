import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/api/client'
import type { Bus, BusInput, PinResetResult, User, UserInput } from '@/api/types'

const KEYS = {
  buses: ['admin', 'buses'] as const,
  users: ['admin', 'users'] as const,
}

export function useBusesQuery() {
  return useQuery({ queryKey: KEYS.buses, queryFn: () => api.getBuses() })
}

export function useUsersQuery() {
  return useQuery({ queryKey: KEYS.users, queryFn: () => api.getUsers() })
}

export function useInvalidateBuses() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: KEYS.buses })
}

export function useInvalidateUsers() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: KEYS.users })
}

export function useCreateBus() {
  const invalidate = useInvalidateBuses()
  return useMutation<Bus, Error, BusInput>({ mutationFn: (input) => api.createBus(input), onSuccess: invalidate })
}

export function useUpdateBus() {
  const invalidate = useInvalidateBuses()
  return useMutation<Bus, Error, { id: string; input: BusInput }>({
    mutationFn: ({ id, input }) => api.updateBus(id, input),
    onSuccess: invalidate,
  })
}

export function useDeleteBus() {
  const invalidate = useInvalidateBuses()
  return useMutation<void, Error, string>({ mutationFn: (id) => api.deleteBus(id), onSuccess: invalidate })
}

export function useSetBusActive() {
  const invalidate = useInvalidateBuses()
  return useMutation<Bus, Error, { id: string; active: boolean }>({
    mutationFn: ({ id, active }) => api.setBusActive(id, active),
    onSuccess: invalidate,
  })
}

export function useCreateUser() {
  const invalidate = useInvalidateUsers()
  return useMutation<PinResetResult, Error, UserInput>({ mutationFn: (input) => api.createUser(input), onSuccess: invalidate })
}

export function useUpdateUser() {
  const invalidate = useInvalidateUsers()
  return useMutation<User, Error, { id: string; input: UserInput }>({
    mutationFn: ({ id, input }) => api.updateUser(id, input),
    onSuccess: invalidate,
  })
}

export function useSetUserActive() {
  const invalidate = useInvalidateUsers()
  return useMutation<User, Error, { id: string; active: boolean }>({
    mutationFn: ({ id, active }) => api.setUserActive(id, active),
    onSuccess: invalidate,
  })
}

export function useResetUserPin() {
  const invalidate = useInvalidateUsers()
  return useMutation<PinResetResult, Error, string>({
    mutationFn: (id) => api.resetUserPin(id),
    onSuccess: invalidate,
  })
}
