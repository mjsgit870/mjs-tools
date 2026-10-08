import { useId } from 'react'
import { MoneyInput } from '@/components/MoneyInput'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { parseNumber } from '@/lib/format'
import type { AmountOrPercent } from '../lib/schema'

interface AmountOrPercentFieldProps {
  label: string
  value: AmountOrPercent
  onChange: (value: AmountOrPercent) => void
  error?: string
}

export function AmountOrPercentField({
  label,
  value,
  onChange,
  error,
}: AmountOrPercentFieldProps) {
  const id = useId()

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex gap-2">
        <Select
          value={value.type}
          onValueChange={(next) =>
            onChange({ ...value, type: next as AmountOrPercent['type'] })
          }
        >
          <SelectTrigger className="w-28" aria-label={`Tipe ${label}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="percent">Persen</SelectItem>
            <SelectItem value="amount">Nominal</SelectItem>
          </SelectContent>
        </Select>
        {value.type === 'amount' ? (
          <MoneyInput
            id={id}
            value={value.value}
            onChange={(next) => onChange({ ...value, value: next })}
          />
        ) : (
          <Input
            id={id}
            type="number"
            min={0}
            step={1}
            value={value.value}
            onChange={(event) =>
              onChange({ ...value, value: parseNumber(event.target.value) })
            }
          />
        )}
      </div>
      {error ? (
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      ) : null}
    </div>
  )
}
