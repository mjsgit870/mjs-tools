import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { createParticipant } from '../lib/defaults'
import { getError } from '../lib/validate'
import type { SplitBillFormApi } from '../hooks/useSplitBill'
import { FieldError } from './FieldError'

interface ParticipantsSectionProps {
  form: SplitBillFormApi
  errors: Record<string, string>
}

export function ParticipantsSection({
  form,
  errors,
}: ParticipantsSectionProps) {
  return (
    <Card className="p-5">
      <h2 className="font-semibold">Peserta</h2>
      <form.Field name="participants" mode="array">
        {(participantsField) => (
          <div className="mt-4 space-y-3">
            {participantsField.state.value.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Belum ada peserta. Tambahkan minimal 2 orang.
              </p>
            ) : null}

            {participantsField.state.value.map((participant, index) => (
              <div key={participant.id} className="space-y-1">
                <div className="flex items-center gap-2">
                  <form.Field name={`participants[${index}].name`}>
                    {(field) => (
                      <Input
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        placeholder={`Peserta ${index + 1}`}
                      />
                    )}
                  </form.Field>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Hapus peserta"
                    onClick={() => participantsField.removeValue(index)}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
                <FieldError
                  message={getError(errors, `participants[${index}].name`)}
                />
              </div>
            ))}

            <FieldError message={getError(errors, 'participants')} />

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => participantsField.pushValue(createParticipant())}
            >
              <Plus className="size-4" /> Tambah peserta
            </Button>
          </div>
        )}
      </form.Field>
    </Card>
  )
}
