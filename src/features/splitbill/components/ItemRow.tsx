import { Trash2 } from 'lucide-react'
import { MoneyInput } from '@/components/MoneyInput'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { parseNumber } from '@/lib/format'
import { getError } from '../lib/validate'
import type { Participant } from '../lib/schema'
import type { SplitBillFormApi } from '../hooks/useSplitBill'
import { FieldError } from './FieldError'

interface ItemRowProps {
  form: SplitBillFormApi
  index: number
  participants: Participant[]
  errors: Record<string, string>
  onRemove: () => void
}

export function ItemRow({
  form,
  index,
  participants,
  errors,
  onRemove,
}: ItemRowProps) {
  return (
    <div className="space-y-3 rounded-lg border border-border p-3">
      <div className="space-y-1">
        <div className="flex items-start gap-2">
          <form.Field name={`items[${index}].name`}>
            {(field) => (
              <Input
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="Nama item"
              />
            )}
          </form.Field>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Hapus item"
            onClick={onRemove}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
        <FieldError message={getError(errors, `items[${index}].name`)} />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground">Harga</span>
          <form.Field name={`items[${index}].price`}>
            {(field) => (
              <MoneyInput
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(next) => field.handleChange(next)}
              />
            )}
          </form.Field>
          <FieldError message={getError(errors, `items[${index}].price`)} />
        </div>

        <div className="space-y-1">
          <span className="text-xs text-muted-foreground">Jumlah</span>
          <form.Field name={`items[${index}].quantity`}>
            {(field) => (
              <Input
                type="number"
                min={1}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) =>
                  field.handleChange(parseNumber(event.target.value))
                }
              />
            )}
          </form.Field>
          <FieldError message={getError(errors, `items[${index}].quantity`)} />
        </div>

        <div className="space-y-1">
          <span className="text-xs text-muted-foreground">Dibayar oleh</span>
          <form.Field name={`items[${index}].payerId`}>
            {(field) => (
              <Select
                value={field.state.value}
                onValueChange={(next) => field.handleChange(next)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih pembayar" />
                </SelectTrigger>
                <SelectContent>
                  {participants.map((participant) => (
                    <SelectItem key={participant.id} value={participant.id}>
                      {participant.name || 'Tanpa nama'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </form.Field>
          <FieldError message={getError(errors, `items[${index}].payerId`)} />
        </div>
      </div>

      <form.Field name={`items[${index}].participantIds`}>
        {(field) => (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Ditanggung oleh
              </span>
              <button
                type="button"
                className="text-xs font-medium text-primary hover:underline"
                onClick={() =>
                  field.handleChange(
                    participants.map((participant) => participant.id),
                  )
                }
              >
                Bagi rata
              </button>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {participants.map((participant) => {
                const checked = field.state.value.includes(participant.id)
                return (
                  <label
                    key={participant.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() =>
                        field.handleChange(
                          checked
                            ? field.state.value.filter(
                                (id) => id !== participant.id,
                              )
                            : [...field.state.value, participant.id],
                        )
                      }
                    />
                    {participant.name || 'Tanpa nama'}
                  </label>
                )
              })}
            </div>
            <FieldError
              message={getError(errors, `items[${index}].participantIds`)}
            />
          </div>
        )}
      </form.Field>
    </div>
  )
}
