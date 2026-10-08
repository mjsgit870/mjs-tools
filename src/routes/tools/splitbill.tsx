import { createFileRoute } from '@tanstack/react-router'
import { SplitBillPage } from '@/features/splitbill'

export const Route = createFileRoute('/tools/splitbill')({
  component: SplitBillPage,
})
