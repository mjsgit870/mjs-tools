import { Card } from '@/components/ui/card'
import { formatIDR } from '@/lib/format'
import type { BillResult } from '../lib/calculate'

interface SummaryRow {
  label: string
  value: number
}

export function SummarySection({ result }: { result: BillResult }) {
  const rows: SummaryRow[] = [{ label: 'Subtotal', value: result.subtotal }]

  if (result.discountAmount > 0) {
    rows.push({ label: 'Diskon', value: -result.discountAmount })
  }
  if (result.taxAmount > 0) {
    rows.push({ label: 'Pajak', value: result.taxAmount })
  }
  if (result.serviceAmount > 0) {
    rows.push({ label: 'Service', value: result.serviceAmount })
  }

  return (
    <Card className="p-5">
      <h2 className="font-semibold">Ringkasan</h2>
      <dl className="mt-3 space-y-2 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between">
            <dt className="text-muted-foreground">{row.label}</dt>
            <dd>{formatIDR(row.value)}</dd>
          </div>
        ))}
        <div className="flex justify-between border-t border-border pt-2 font-semibold">
          <dt>Total</dt>
          <dd>{formatIDR(result.grandTotal)}</dd>
        </div>
      </dl>
    </Card>
  )
}
