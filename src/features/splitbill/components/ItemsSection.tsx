import { Plus, Scale } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createItem } from '../lib/defaults'
import { getError } from '../lib/validate'
import type { Participant } from '../lib/schema'
import type { SplitBillFormApi } from '../hooks/useSplitBill'
import { FieldError } from './FieldError'
import { ItemRow } from './ItemRow'

interface ItemsSectionProps {
  form: SplitBillFormApi
  participants: Participant[]
  errors: Record<string, string>
}

export function ItemsSection({
  form,
  participants,
  errors,
}: ItemsSectionProps) {
  const disabled = participants.length < 2

  return (
    <Card className="p-5">
      <h2 className="font-semibold">Item</h2>
      <form.Field name="items" mode="array">
        {(itemsField) => (
          <div className="mt-4 space-y-4">
            {itemsField.state.value.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Belum ada item.
              </p>
            ) : null}

            {itemsField.state.value.map((item, index) => (
              <ItemRow
                key={item.id}
                form={form}
                index={index}
                participants={participants}
                errors={errors}
                onRemove={() => itemsField.removeValue(index)}
              />
            ))}

            <FieldError message={getError(errors, 'items')} />

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled}
                onClick={() => {
                  const payer = participants[0]
                  if (!payer) return
                  itemsField.pushValue(createItem(payer.id))
                }}
              >
                <Plus className="size-4" /> Tambah item
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={itemsField.state.value.length === 0}
                onClick={() =>
                  itemsField.setValue(
                    itemsField.state.value.map((entry) => ({
                      ...entry,
                      participantIds: participants.map(
                        (participant) => participant.id,
                      ),
                    })),
                  )
                }
              >
                <Scale className="size-4" /> Bagi rata semua
              </Button>
            </div>

            {disabled ? (
              <p className="text-xs text-muted-foreground">
                Tambahkan minimal 2 peserta untuk menambah item.
              </p>
            ) : null}
          </div>
        )}
      </form.Field>
    </Card>
  )
}
