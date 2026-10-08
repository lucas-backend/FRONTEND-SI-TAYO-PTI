import { z } from 'zod'

export const accountSchema = z.object({
  name: z.string().trim().min(1, 'Nama wajib diisi'),
  username: z.string().trim().min(3, 'Username minimal 3 karakter'),
  role: z.enum(['ADMIN', 'DRIVER']),
  active: z.boolean(),
})

export type AccountFormValues = z.infer<typeof accountSchema>
