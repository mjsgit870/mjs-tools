import { useState } from 'react'
import { Check, Loader2, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { buildSummaryImage, shareSummaryImage } from '../lib/summaryImage'
import type { BillResult } from '../lib/calculate'

type Status = 'idle' | 'busy' | 'done'

interface ShareImageButtonProps {
  title: string
  result: BillResult
}

export function ShareImageButton({ title, result }: ShareImageButtonProps) {
  const [status, setStatus] = useState<Status>('idle')

  const handleClick = async () => {
    if (status === 'busy') return
    setStatus('busy')
    try {
      const blob = await buildSummaryImage(title, result)
      await shareSummaryImage(blob, title)
      setStatus('done')
      window.setTimeout(() => setStatus('idle'), 2000)
    } catch {
      setStatus('idle')
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleClick}
      disabled={status === 'busy'}
    >
      {status === 'busy' ? (
        <Loader2 className="size-4 animate-spin" />
      ) : status === 'done' ? (
        <Check className="size-4" />
      ) : (
        <Share2 className="size-4" />
      )}
      {status === 'busy'
        ? 'Membuat gambar'
        : status === 'done'
          ? 'Selesai'
          : 'Bagikan gambar'}
    </Button>
  )
}
