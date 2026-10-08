import { tools } from '@/config/tools'
import { Container } from '@/components/layout/Container'
import { ToolCard } from './ToolCard'

export function HomePage() {
  return (
    <Container className="py-14">
      <section className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight">
          Pusat tools untuk mempercepat kerja
        </h1>
        <p className="mt-3 text-muted-foreground">
          Kumpulan tools kecil untuk kebutuhan sehari-hari. Pilih tool untuk
          mulai.
        </p>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </section>
    </Container>
  )
}
