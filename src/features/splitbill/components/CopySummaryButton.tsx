import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { buildSummaryText } from '../lib/summary'
import type { BillResult } from '../lib/calculate'

interface CopySummaryButtonProps {
  title: string
  result: BillResult
}

export function CopySummaryButton({
  title,
  result,
}: CopySummaryButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildSummaryText(title, result))
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      return
    }
  }

  return (
    <Button type="button" variant="outline" onClick={handleCopy}>
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      {copied ? 'Tersalin' : 'Salin ringkasan'}
    </Button>
  )
}
