import { describe, expect, it } from 'vitest'
import { calculateBill } from './calculate'
import type { BillForm, BillItem, Participant } from './schema'

function participant(id: string, name: string): Participant {
  return { id, name }
}

function item(
  id: string,
  price: number,
  participantIds: string[],
  payerId: string,
  quantity = 1,
): BillItem {
  return { id, name: id, price, quantity, participantIds, payerId }
}

function bill(overrides: Partial<BillForm> = {}): BillForm {
  return {
    title: overrides.title ?? '',
    participants: overrides.participants ?? [],
    items: overrides.items ?? [],
    tax: overrides.tax ?? { type: 'percent', value: 0 },
    service: overrides.service ?? { type: 'percent', value: 0 },
    discount: overrides.discount ?? { type: 'percent', value: 0 },
  }
}

describe('calculateBill', () => {
  it('membagi rata satu item ke semua penanggung', () => {
    const result = calculateBill(
      bill({
        participants: [participant('a', 'Andi'), participant('b', 'Budi')],
        items: [item('i1', 100000, ['a', 'b'], 'a')],
      }),
    )

    expect(result.subtotal).toBe(100000)
    expect(result.grandTotal).toBe(100000)

    const andi = result.people.find((person) => person.participantId === 'a')
    const budi = result.people.find((person) => person.participantId === 'b')

    expect(andi?.total).toBe(50000)
    expect(budi?.total).toBe(50000)
    expect(andi?.paid).toBe(100000)
    expect(budi?.paid).toBe(0)
    expect(andi?.balance).toBe(50000)
    expect(budi?.balance).toBe(-50000)
    expect(result.settlements).toEqual([
      {
        fromId: 'b',
        fromName: 'Budi',
        toId: 'a',
        toName: 'Andi',
        amount: 50000,
      },
    ])
  })

  it('menghitung item dengan penanggung berbeda', () => {
    const result = calculateBill(
      bill({
        participants: [participant('a', 'A'), participant('b', 'B')],
        items: [
          item('i1', 60000, ['a', 'b'], 'a'),
          item('i2', 40000, ['a'], 'a'),
        ],
      }),
    )

    const a = result.people.find((person) => person.participantId === 'a')
    const b = result.people.find((person) => person.participantId === 'b')

    expect(a?.subtotal).toBe(70000)
    expect(b?.subtotal).toBe(30000)
    expect(a?.total).toBe(70000)
    expect(b?.total).toBe(30000)
  })

  it('mengalikan harga dengan jumlah', () => {
    const result = calculateBill(
      bill({
        participants: [participant('a', 'A')],
        items: [item('i1', 25000, ['a'], 'a', 3)],
      }),
    )

    expect(result.subtotal).toBe(75000)
  })

  it('menghitung pajak dan service persen', () => {
    const result = calculateBill(
      bill({
        participants: [participant('a', 'Andi'), participant('b', 'Budi')],
        items: [item('i1', 100000, ['a', 'b'], 'a')],
        tax: { type: 'percent', value: 11 },
        service: { type: 'percent', value: 5 },
      }),
    )

    expect(result.taxAmount).toBe(11000)
    expect(result.serviceAmount).toBe(5000)
    expect(result.grandTotal).toBe(116000)
  })

  it('mendukung pajak dan service nominal', () => {
    const result = calculateBill(
      bill({
        participants: [participant('a', 'Andi')],
        items: [item('i1', 100000, ['a'], 'a')],
        tax: { type: 'amount', value: 11000 },
        service: { type: 'amount', value: 5000 },
      }),
    )

    expect(result.taxAmount).toBe(11000)
    expect(result.serviceAmount).toBe(5000)
    expect(result.grandTotal).toBe(116000)
  })

  it('menerapkan diskon persen sebelum pajak', () => {
    const result = calculateBill(
      bill({
        participants: [participant('a', 'Andi')],
        items: [item('i1', 100000, ['a'], 'a')],
        discount: { type: 'percent', value: 10 },
        tax: { type: 'percent', value: 10 },
      }),
    )

    expect(result.discountAmount).toBe(10000)
    expect(result.taxAmount).toBe(9000)
    expect(result.grandTotal).toBe(99000)
  })

  it('membatasi diskon nominal agar tidak melebihi subtotal', () => {
    const result = calculateBill(
      bill({
        participants: [participant('a', 'Andi')],
        items: [item('i1', 50000, ['a'], 'a')],
        discount: { type: 'amount', value: 80000 },
      }),
    )

    expect(result.discountAmount).toBe(50000)
    expect(result.grandTotal).toBe(0)
  })

  it('membulatkan total sehingga jumlah per orang tetap sama dengan total', () => {
    const result = calculateBill(
      bill({
        participants: [
          participant('a', 'A'),
          participant('b', 'B'),
          participant('c', 'C'),
        ],
        items: [item('i1', 10000, ['a', 'b', 'c'], 'a')],
      }),
    )

    const sum = result.people.reduce((acc, person) => acc + person.total, 0)
    expect(sum).toBe(result.grandTotal)
    expect(result.grandTotal).toBe(10000)
  })

  it('menghitung settlemen multi-pembayar dan balance selalu nol', () => {
    const result = calculateBill(
      bill({
        participants: [
          participant('a', 'A'),
          participant('b', 'B'),
          participant('c', 'C'),
        ],
        items: [
          item('i1', 30000, ['a', 'b', 'c'], 'a'),
          item('i2', 30000, ['a', 'b', 'c'], 'b'),
        ],
      }),
    )

    const a = result.people.find((person) => person.participantId === 'a')
    const b = result.people.find((person) => person.participantId === 'b')
    const c = result.people.find((person) => person.participantId === 'c')

    expect(a?.balance).toBe(10000)
    expect(b?.balance).toBe(10000)
    expect(c?.balance).toBe(-20000)

    const sumBalances = result.people.reduce(
      (acc, person) => acc + person.balance,
      0,
    )
    expect(sumBalances).toBe(0)

    const totalSettled = result.settlements.reduce(
      (acc, settlement) => acc + settlement.amount,
      0,
    )
    expect(totalSettled).toBe(20000)
  })

  it('menangani tagihan tanpa item', () => {
    const result = calculateBill(
      bill({ participants: [participant('a', 'A'), participant('b', 'B')] }),
    )

    expect(result.grandTotal).toBe(0)
    expect(result.people.every((person) => person.total === 0)).toBe(true)
  })
})
