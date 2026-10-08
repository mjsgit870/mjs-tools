import { Loader2 } from 'lucide-react'

export function RoutePending() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[60vh] items-center justify-center gap-2 text-muted-foreground"
    >
      <Loader2 className="size-5 animate-spin" />
      <span className="text-sm">Memuat…</span>
    </div>
  )
}
