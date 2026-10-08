import { ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { formatIDR } from '@/lib/format'
import type { Settlement } from '../lib/calculate'

export function SettlementSection({
  settlements,
}: {
  settlements: Settlement[]
}) {
  return (
    <Card className="p-5">
      <h2 className="font-semibold">Settlemen</h2>
      {settlements.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">
          Tidak ada transfer yang diperlukan.
        </p>
      ) : (
        <ul className="mt-3 space-y-2 text-sm">
          {settlements.map((settlement, index) => (
            <li
              key={`${settlement.fromId}-${settlement.toId}-${index}`}
              className="flex items-center gap-2"
            >
              <span className="font-medium">
                {settlement.fromName || 'Tanpa nama'}
              </span>
              <ArrowRight className="size-3.5 text-muted-foreground" />
              <span className="font-medium">
                {settlement.toName || 'Tanpa nama'}
              </span>
              <span className="ml-auto font-semibold">
                {formatIDR(settlement.amount)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
