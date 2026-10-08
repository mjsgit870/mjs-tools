import { formatIDR } from '@/lib/format'
import type { BillResult } from './calculate'

export function buildSummaryText(title: string, result: BillResult): string {
  const lines: string[] = []
  lines.push(title.trim() ? `Split Bill: ${title.trim()}` : 'Split Bill')
  lines.push(`Total: ${formatIDR(result.grandTotal)}`)
  lines.push('')
  lines.push('Rincian per orang:')
  for (const person of result.people) {
    lines.push(`- ${person.name || 'Tanpa nama'}: ${formatIDR(person.total)}`)
  }

  if (result.settlements.length > 0) {
    lines.push('')
    lines.push('Settlemen:')
    for (const settlement of result.settlements) {
      lines.push(
        `- ${settlement.fromName || 'Tanpa nama'} → ${settlement.toName || 'Tanpa nama'}: ${formatIDR(settlement.amount)}`,
      )
    }
  }

  return lines.join('\n')
}
