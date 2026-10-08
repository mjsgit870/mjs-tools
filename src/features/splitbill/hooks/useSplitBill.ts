import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm, useSelector } from '@tanstack/react-form'
import { calculateBill } from '../lib/calculate'
import { createEmptyBill } from '../lib/defaults'
import { billSchema } from '../lib/schema'
import { clearBill, loadBill, saveBill } from '../lib/storage'
import { validateBill } from '../lib/validate'

export function useSplitBill() {
  const [initialValues] = useState(() => loadBill() ?? createEmptyBill())

  const form = useForm({
    defaultValues: initialValues,
    validators: {
      onChange: billSchema,
    },
  })

  const values = useSelector(form.store, (state) => state.values)

  useEffect(() => {
    saveBill(values)
  }, [values])

  const validation = useMemo(() => validateBill(values), [values])
  const result = useMemo(() => calculateBill(values), [values])

  const reset = useCallback(() => {
    clearBill()
    form.reset(createEmptyBill())
  }, [form])

  return { form, values, validation, result, reset }
}

export type SplitBillFormApi = ReturnType<typeof useSplitBill>['form']
