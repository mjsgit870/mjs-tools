import type { LucideIcon } from 'lucide-react'
import { GitBranch, Receipt } from 'lucide-react'

export type ToolStatus = 'available' | 'coming-soon'

export type ToolRoute = '/tools/splitbill'

export interface Tool {
  id: string
  name: string
  description: string
  icon: LucideIcon
  status: ToolStatus
  to?: ToolRoute
}

export const tools: Tool[] = [
  {
    id: 'splitbill',
    name: 'Split Bill',
    description: 'Bagi tagihan bersama teman secara adil dan cepat.',
    icon: Receipt,
    status: 'available',
    to: '/tools/splitbill',
  },
  {
    id: 'gitlab-activity',
    name: 'GitLab Activity',
    description: 'Rekap aktivitas GitLab menjadi timesheet.',
    icon: GitBranch,
    status: 'coming-soon',
  },
]
