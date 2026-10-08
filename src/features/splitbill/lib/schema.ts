import { z } from 'zod'

export const amountOrPercentSchema = z
  .object({
    type: z.enum(['percent', 'amount']),
    value: z.number().min(0, 'Nilai tidak boleh negatif'),
  })
  .refine((data) => data.type !== 'percent' || data.value <= 100, {
    message: 'Persen maksimal 100',
    path: ['value'],
  })

export const participantSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1, 'Nama peserta wajib diisi'),
})

export const itemSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1, 'Nama item wajib diisi'),
  price: z.number().min(0, 'Harga tidak boleh negatif'),
  quantity: z.number().int('Jumlah harus bilangan bulat').min(1, 'Minimal 1'),
  participantIds: z.array(z.string()).min(1, 'Pilih minimal satu penanggung'),
  payerId: z.string().min(1, 'Pilih pembayar'),
})

export const billSchema = z
  .object({
    title: z.string(),
    participants: z.array(participantSchema).min(2, 'Minimal 2 peserta'),
    items: z.array(itemSchema).min(1, 'Minimal 1 item'),
    tax: amountOrPercentSchema,
    service: amountOrPercentSchema,
    discount: amountOrPercentSchema,
  })
  .refine(
    (bill) => {
      const names = bill.participants.map((p) => p.name.trim().toLowerCase())
      return new Set(names).size === names.length
    },
    { message: 'Nama peserta tidak boleh sama', path: ['participants'] },
  )
  .refine(
    (bill) => {
      const ids = new Set(bill.participants.map((p) => p.id))
      return bill.items.every(
        (item) =>
          item.participantIds.every((id) => ids.has(id)) &&
          ids.has(item.payerId),
      )
    },
    { message: 'Peserta pada item tidak valid', path: ['items'] },
  )

export type AmountOrPercent = z.infer<typeof amountOrPercentSchema>
export type Participant = z.infer<typeof participantSchema>
export type BillItem = z.infer<typeof itemSchema>
export type BillForm = z.infer<typeof billSchema>
