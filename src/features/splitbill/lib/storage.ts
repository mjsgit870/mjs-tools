import { z } from 'zod'
import { createId } from '@/lib/id'
import type { BillForm } from './schema'

const STORAGE_KEY = 'mjs-tools:splitbill'

const storedAmountOrPercent = z.object({
  type: z.enum(['percent', 'amount']).catch('percent'),
  value: z.number().catch(0),
})

const storedParticipant = z.object({
  id: z.string().catch(() => createId()),
  name: z.string().catch(''),
})

const storedItem = z.object({
  id: z.string().catch(() => createId()),
  name: z.string().catch(''),
  price: z.number().catch(0),
  quantity: z.number().catch(1),
  participantIds: z.array(z.string()).catch([]),
  payerId: z.string().catch(''),
})

const storedBill = z.object({
  title: z.string().catch(''),
  participants: z.array(storedParticipant).catch([]),
  items: z.array(storedItem).catch([]),
  tax: storedAmountOrPercent.catch({ type: 'percent', value: 0 }),
  service: storedAmountOrPercent.catch({ type: 'percent', value: 0 }),
  discount: storedAmountOrPercent.catch({ type: 'percent', value: 0 }),
})

export function loadBill(): BillForm | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = storedBill.safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}

export function saveBill(bill: BillForm): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bill))
  } catch {
    return
  }
}

export function clearBill(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    return
  }
}
