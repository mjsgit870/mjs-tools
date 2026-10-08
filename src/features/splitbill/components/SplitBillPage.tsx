import { RotateCcw } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useSplitBill } from '../hooks/useSplitBill'
import { getError } from '../lib/validate'
import { ChargesSection } from './ChargesSection'
import { CopySummaryButton } from './CopySummaryButton'
import { FieldError } from './FieldError'
import { ItemsSection } from './ItemsSection'
import { ParticipantsSection } from './ParticipantsSection'
import { PeopleResultSection } from './PeopleResultSection'
import { SettlementSection } from './SettlementSection'
import { ShareImageButton } from './ShareImageButton'
import { SummarySection } from './SummarySection'

export function SplitBillPage() {
  const { form, values, validation, result, reset } = useSplitBill()

  return (
    <Container className="py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Split Bill</h1>
          <p className="text-sm text-muted-foreground">
            Bagi tagihan bersama teman secara adil.
          </p>
        </div>
        <div className="flex gap-2">
          <CopySummaryButton title={values.title} result={result} />
          <ShareImageButton title={values.title} result={result} />
          <Button type="button" variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" /> Reset
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <Card className="space-y-2 p-5">
            <span className="text-sm font-medium">Judul tagihan</span>
            <form.Field name="title">
              {(field) => (
                <Input
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="Mis. Makan malam (opsional)"
                />
              )}
            </form.Field>
          </Card>

          {!validation.isValid ? (
            <Card className="space-y-1 border-red-300 p-4 dark:border-red-900">
              <FieldError message={getError(validation.errors, 'participants')} />
              <FieldError message={getError(validation.errors, 'items')} />
            </Card>
          ) : null}

          <ParticipantsSection form={form} errors={validation.errors} />
          <ItemsSection
            form={form}
            participants={values.participants}
            errors={validation.errors}
          />
          <ChargesSection form={form} errors={validation.errors} />
        </div>

        <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <SummarySection result={result} />
          <PeopleResultSection people={result.people} />
          {validation.isValid ? (
            <SettlementSection settlements={result.settlements} />
          ) : null}
        </div>
      </div>
    </Container>
  )
}
