export type ClassValue = string | number | false | null | undefined

/** Gabungkan className secara kondisional tanpa dependensi tambahan. */
export function cn(...values: ClassValue[]): string {
  return values.filter((value): value is string | number => Boolean(value)).join(' ')
}
