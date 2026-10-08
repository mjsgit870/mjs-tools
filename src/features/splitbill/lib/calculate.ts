import type { AmountOrPercent, BillForm, BillItem } from './schema'

export interface PersonResult {
  participantId: string
  name: string
  subtotal: number
  discountShare: number
  taxShare: number
  serviceShare: number
  total: number
  paid: number
  balance: number
}

export interface Settlement {
  fromId: string
  fromName: string
  toId: string
  toName: string
  amount: number
}

export interface BillResult {
  subtotal: number
  discountAmount: number
  taxAmount: number
  serviceAmount: number
  grandTotal: number
  people: PersonResult[]
  settlements: Settlement[]
}

function itemTotal(item: BillItem): number {
  return item.price * item.quantity
}

function resolveAmount(entry: AmountOrPercent, base: number): number {
  return entry.type === 'percent' ? (base * entry.value) / 100 : entry.value
}

function round2(value: number): number {
  return Math.round(value * 100) / 100
}

function allocateRoundedTotals(values: number[], target: number): number[] {
  if (values.length === 0) return []

  const result = values.map((value) => Math.floor(value))
  let diff = target - result.reduce((sum, value) => sum + value, 0)
  const order = values
    .map((value, index) => ({
      index,
      remainder: value - Math.floor(value),
    }))
    .sort((a, b) => b.remainder - a.remainder || a.index - b.index)

  let cursor = 0
  while (diff > 0) {
    result[order[cursor % order.length].index] += 1
    diff -= 1
    cursor += 1
  }

  cursor = 0
  while (diff < 0) {
    result[order[order.length - 1 - (cursor % order.length)].index] -= 1
    diff += 1
    cursor += 1
  }

  return result
}

function computeSettlements(people: PersonResult[]): Settlement[] {
  const creditors = people
    .filter((person) => person.balance > 0)
    .map((person) => ({ ...person, remaining: person.balance }))
    .sort((a, b) => b.remaining - a.remaining)
  const debtors = people
    .filter((person) => person.balance < 0)
    .map((person) => ({ ...person, remaining: -person.balance }))
    .sort((a, b) => b.remaining - a.remaining)

  const settlements: Settlement[] = []
  let creditorIndex = 0
  let debtorIndex = 0

  while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
    const creditor = creditors[creditorIndex]
    const debtor = debtors[debtorIndex]
    const amount = Math.min(creditor.remaining, debtor.remaining)

    if (amount >= 1) {
      settlements.push({
        fromId: debtor.participantId,
        fromName: debtor.name,
        toId: creditor.participantId,
        toName: creditor.name,
        amount: Math.round(amount),
      })
    }

    creditor.remaining -= amount
    debtor.remaining -= amount
    if (creditor.remaining < 1) creditorIndex += 1
    if (debtor.remaining < 1) debtorIndex += 1
  }

  return settlements
}

export function calculateBill(bill: BillForm): BillResult {
  const subtotal = bill.items.reduce((sum, item) => sum + itemTotal(item), 0)
  const hasSubtotal = subtotal > 0

  const discountAmount = hasSubtotal
    ? Math.min(resolveAmount(bill.discount, subtotal), subtotal)
    : 0
  const taxableBase = subtotal - discountAmount
  const taxAmount = hasSubtotal ? resolveAmount(bill.tax, taxableBase) : 0
  const serviceAmount = hasSubtotal ? resolveAmount(bill.service, taxableBase) : 0

  const grandTotal = Math.round(
    subtotal - discountAmount + taxAmount + serviceAmount,
  )

  const subtotalById = new Map<string, number>()
  for (const participant of bill.participants) {
    subtotalById.set(participant.id, 0)
  }

  for (const item of bill.items) {
    const sharers = item.participantIds.filter((id) => subtotalById.has(id))
    if (sharers.length === 0) continue
    const share = itemTotal(item) / sharers.length
    for (const id of sharers) {
      subtotalById.set(id, (subtotalById.get(id) ?? 0) + share)
    }
  }

  const paidById = new Map<string, number>()
  for (const participant of bill.participants) {
    paidById.set(participant.id, 0)
  }

  let assignedSubtotal = 0
  for (const item of bill.items) {
    if (item.payerId && paidById.has(item.payerId)) {
      paidById.set(item.payerId, (paidById.get(item.payerId) ?? 0) + itemTotal(item))
      assignedSubtotal += itemTotal(item)
    }
  }

  const ratio = (value: number) => (hasSubtotal ? value / subtotal : 0)
  const paidScale = assignedSubtotal > 0 ? grandTotal / assignedSubtotal : 0

  const rawTotals = bill.participants.map((participant) => {
    const sub = subtotalById.get(participant.id) ?? 0
    const share = ratio(sub)
    return sub - discountAmount * share + taxAmount * share + serviceAmount * share
  })

  let rawPaid = bill.participants.map(
    (participant) => (paidById.get(participant.id) ?? 0) * paidScale,
  )

  if (assignedSubtotal === 0 && grandTotal !== 0 && bill.participants.length > 0) {
    rawPaid = bill.participants.map(() => grandTotal / bill.participants.length)
  }

  const roundedTotals = allocateRoundedTotals(rawTotals, grandTotal)
  const roundedPaid = allocateRoundedTotals(rawPaid, grandTotal)

  const people: PersonResult[] = bill.participants.map((participant, index) => {
    const sub = subtotalById.get(participant.id) ?? 0
    const share = ratio(sub)
    return {
      participantId: participant.id,
      name: participant.name,
      subtotal: round2(sub),
      discountShare: round2(discountAmount * share),
      taxShare: round2(taxAmount * share),
      serviceShare: round2(serviceAmount * share),
      total: roundedTotals[index],
      paid: roundedPaid[index],
      balance: roundedPaid[index] - roundedTotals[index],
    }
  })

  return {
    subtotal: round2(subtotal),
    discountAmount: round2(discountAmount),
    taxAmount: round2(taxAmount),
    serviceAmount: round2(serviceAmount),
    grandTotal,
    people,
    settlements: computeSettlements(people),
  }
}
