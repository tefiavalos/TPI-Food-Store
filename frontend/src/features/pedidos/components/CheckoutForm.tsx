import { useForm } from '@tanstack/react-form'
import { Button } from '@/shared/ui/Button'
import { Input, Select, Textarea } from '@/shared/ui/Input'
import { errorDeCampo, largo } from '@/shared/utils/validaciones'
import type { FormaPago } from '../types/pedido'

export interface DatosCheckout {
  direccion_entrega: string
  forma_pago: FormaPago
  notas: string | null
}

interface CheckoutFormProps {
  enviando: boolean
  onConfirmar: (datos: DatosCheckout) => void
}

const formasPago: { valor: FormaPago; texto: string }[] = [
  { valor: 'EFECTIVO', texto: 'Efectivo' },
  { valor: 'TRANSFERENCIA', texto: 'Transferencia' },
]

export const CheckoutForm = ({ enviando, onConfirmar }: CheckoutFormProps) => {
  const form = useForm({
    defaultValues: {
      direccion_entrega: '',
      forma_pago: 'EFECTIVO' as FormaPago,
      notas: '',
    },
    onSubmit: ({ value }) => {
      onConfirmar({
        direccion_entrega: value.direccion_entrega.trim(),
        forma_pago: value.forma_pago,
        notas: value.notas.trim() || null,
      })
    },
  })

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        void form.handleSubmit()
      }}
    >
      <form.Field
        name="direccion_entrega"
        validators={{ onChange: ({ value }) => largo(5, 200, 'Dirección')(value) }}
      >
        {(field) => (
          <Input
            id="checkout-direccion"
            label="Dirección de entrega"
            placeholder="Calle, número, piso, departamento"
            autoComplete="street-address"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            error={errorDeCampo(field.state.meta)}
          />
        )}
      </form.Field>

      <form.Field name="forma_pago">
        {(field) => (
          <Select
            id="checkout-pago"
            label="Forma de pago"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => {
              const elegida = formasPago.find((f) => f.valor === e.target.value)
              if (elegida) field.handleChange(elegida.valor)
            }}
          >
            {formasPago.map((f) => (
              <option key={f.valor} value={f.valor}>
                {f.texto}
              </option>
            ))}
          </Select>
        )}
      </form.Field>

      <form.Field
        name="notas"
        validators={{ onChange: ({ value }) => (value.length > 500 ? 'Notas: máximo 500 caracteres' : undefined) }}
      >
        {(field) => (
          <Textarea
            id="checkout-notas"
            label="Notas (opcional)"
            placeholder="Ej.: tocar timbre 2B, sin cebolla..."
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            error={errorDeCampo(field.state.meta)}
          />
        )}
      </form.Field>

      <form.Subscribe selector={(s) => s.canSubmit}>
        {(puedeEnviar) => (
          <Button type="submit" className="w-full" disabled={!puedeEnviar || enviando}>
            {enviando ? 'Enviando pedido...' : 'Confirmar pedido'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
