import { z } from 'zod'

export const PLATE_PATTERN = /^BE \d{4} [A-Z]{2}$/

export const busSchema = z.object({
  plate: z
    .string()
    .trim()
    .regex(PLATE_PATTERN, 'Format plat harus seperti "BE 1234 XX"'),
  label: z.string().trim().min(1, 'Nama armada wajib diisi'),
  routeId: z.string().min(1, 'Jalur wajib dipilih'),
  driverId: z.string().min(1, 'Supir wajib dipilih'),
  capacity: z.coerce.number().int('Kapasitas harus bilangan bulat').min(1, 'Minimal 1 kursi').max(60, 'Maksimal 60 kursi'),
  active: z.boolean(),
})

export type BusFormValues = z.infer<typeof busSchema>
