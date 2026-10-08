import { Card } from '@/components/ui/card'
import { getError } from '../lib/validate'
import type { SplitBillFormApi } from '../hooks/useSplitBill'
import { AmountOrPercentField } from './AmountOrPercentField'

interface ChargesSectionProps {
  form: SplitBillFormApi
  errors: Record<string, string>
}

export function ChargesSection({ form, errors }: ChargesSectionProps) {
  return (
    <Card className="p-5">
      <h2 className="font-semibold">Biaya tambahan</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <form.Field name="tax">
          {(field) => (
            <AmountOrPercentField
              label="Pajak"
              value={field.state.value}
              onChange={field.handleChange}
              error={getError(errors, 'tax.value')}
            />
          )}
        </form.Field>
        <form.Field name="service">
          {(field) => (
            <AmountOrPercentField
              label="Service"
              value={field.state.value}
              onChange={field.handleChange}
              error={getError(errors, 'service.value')}
            />
          )}
        </form.Field>
        <form.Field name="discount">
          {(field) => (
            <AmountOrPercentField
              label="Diskon"
              value={field.state.value}
              onChange={field.handleChange}
              error={getError(errors, 'discount.value')}
            />
          )}
        </form.Field>
      </div>
    </Card>
  )
}
