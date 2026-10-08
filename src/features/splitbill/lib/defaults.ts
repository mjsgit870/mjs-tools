import { createId } from '@/lib/id'
import type { BillForm, BillItem, Participant } from './schema'

export function createEmptyBill(): BillForm {
  return {
    title: '',
    participants: [],
    items: [],
    tax: { type: 'percent', value: 0 },
    service: { type: 'percent', value: 0 },
    discount: { type: 'percent', value: 0 },
  }
}

export function createParticipant(): Participant {
  return { id: createId(), name: '' }
}

export function createItem(payerId: string): BillItem {
  return {
    id: createId(),
    name: '',
    price: 0,
    quantity: 1,
    participantIds: [],
    payerId,
  }
}
