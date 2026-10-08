const idrFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

export function formatIDR(value: number): string {
  return idrFormatter.format(Number.isFinite(value) ? Math.round(value) : 0)
}

export function parseNumber(value: string): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const numberFormatter = new Intl.NumberFormat('id-ID', {
  maximumFractionDigits: 0,
})

export function formatNumberID(value: number): string {
  return numberFormatter.format(Number.isFinite(value) ? Math.round(value) : 0)
}

export function parseNumberID(value: string): number {
  const digits = value.replace(/\D/g, '')
  if (!digits) return 0
  const parsed = Number(digits)
  return Number.isFinite(parsed) ? parsed : 0
}
