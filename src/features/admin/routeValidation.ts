import { z } from 'zod'

export const routeSchema = z.object({
  name: z.string().trim().min(1, 'Nama rute wajib diisi'),
  intervalMin: z.number().min(1, 'Interval minimal 1 menit').max(60, 'Interval maksimal 60 menit'),
  path: z.array(z.tuple([z.number(), z.number()])).min(2, 'Rute membutuhkan minimal 2 titik'),
  stopIds: z.array(z.string()).min(2, 'Rute membutuhkan minimal 2 halte'),
})
