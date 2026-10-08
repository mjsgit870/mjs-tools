import { Link } from '@tanstack/react-router'
import type { Tool } from '@/config/tools'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

function ToolCardContent({ tool }: { tool: Tool }) {
  const Icon = tool.icon

  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" />
        </span>
        {tool.status === 'coming-soon' ? (
          <Badge variant="secondary">Segera hadir</Badge>
        ) : (
          <Badge variant="outline">Tersedia</Badge>
        )}
      </div>
      <div className="mt-4 space-y-1">
        <h3 className="font-semibold">{tool.name}</h3>
        <p className="text-sm text-muted-foreground">{tool.description}</p>
      </div>
    </>
  )
}

export function ToolCard({ tool }: { tool: Tool }) {
  if (tool.status === 'available' && tool.to) {
    return (
      <Link
        to={tool.to}
        className="block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Card className="h-full p-5 transition hover:border-primary/40 hover:shadow-sm">
          <ToolCardContent tool={tool} />
        </Card>
      </Link>
    )
  }

  return (
    <Card
      aria-disabled="true"
      className="h-full cursor-not-allowed p-5 opacity-70"
    >
      <ToolCardContent tool={tool} />
    </Card>
  )
}
