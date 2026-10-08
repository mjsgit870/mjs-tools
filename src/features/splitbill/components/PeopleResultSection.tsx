import { Card } from '@/components/ui/card'
import { formatIDR } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { PersonResult } from '../lib/calculate'

export function PeopleResultSection({ people }: { people: PersonResult[] }) {
  if (people.length === 0) return null

  return (
    <Card className="p-5">
      <h2 className="font-semibold">Total per orang</h2>
      <ul className="mt-3 space-y-3">
        {people.map((person) => (
          <li
            key={person.participantId}
            className="flex items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <p className="truncate font-medium">
                {person.name || 'Tanpa nama'}
              </p>
              <p className="text-xs text-muted-foreground">
                Dibayar {formatIDR(person.paid)}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{formatIDR(person.total)}</p>
              <p
                className={cn(
                  'text-xs',
                  person.balance > 0
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : person.balance < 0
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-muted-foreground',
                )}
              >
                {person.balance > 0
                  ? `Dibayar lebih ${formatIDR(person.balance)}`
                  : person.balance < 0
                    ? `Kurang ${formatIDR(-person.balance)}`
                    : 'Pas'}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}
