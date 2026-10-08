import * as React from 'react'
import { Input } from '@/components/ui/input'
import { formatNumberID, parseNumberID } from '@/lib/format'

interface MoneyInputProps extends Omit<
  React.ComponentProps<typeof Input>,
  'value' | 'onChange' | 'type'
> {
  value: number
  onChange: (value: number) => void
}

function MoneyInput({ value, onChange, ...props }: MoneyInputProps) {
  return (
    <Input
      {...props}
      type="text"
      inputMode="numeric"
      placeholder="0"
      value={value === 0 ? '' : formatNumberID(value)}
      onChange={(event) => onChange(parseNumberID(event.target.value))}
    />
  )
}

export { MoneyInput }
