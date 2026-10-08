import { billSchema, type BillForm } from './schema'

export interface BillValidation {
  isValid: boolean
  errors: Record<string, string>
}

export function validateBill(bill: BillForm): BillValidation {
  const parsed = billSchema.safeParse(bill)
  if (parsed.success) {
    return { isValid: true, errors: {} }
  }

  const errors: Record<string, string> = {}
  for (const issue of parsed.error.issues) {
    const key = issue.path.join('.')
    if (!(key in errors)) errors[key] = issue.message
  }
  return { isValid: false, errors }
}

export function getError(
  errors: Record<string, string>,
  fieldName: string,
): string | undefined {
  return errors[fieldName.replace(/\[(\d+)\]/g, '.$1')]
}
