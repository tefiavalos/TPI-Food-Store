import { useForm } from '@tanstack/react-form'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { errorDeCampo, minimo } from '@/shared/utils/validaciones'
import type { Producto, ProductoStockUpdate } from '../types/producto'

interface StockFormProps {
  producto: Producto
  enviando: boolean
  onGuardar: (datos: ProductoStockUpdate) => void
  onCancelar: () => void
}

export const StockForm = ({ producto, enviando, onGuardar, onCancelar }: StockFormProps) => {
  const form = useForm({
    defaultValues: { stock: producto.stock, disponible: producto.disponible },
    onSubmit: ({ value }) => onGuardar(value),
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
      <p className="text-sm text-stone-600">
        Producto: <strong>{producto.nombre}</strong>
      </p>

      <form.Field name="stock" validators={{ onChange: ({ value }) => minimo(0, 'El stock')(value) }}>
        {(field) => (
          <Input
            id="stock-cantidad"
            label="Stock"
            type="number"
            min={0}
            step="1"
            value={Number.isNaN(field.state.value) ? '' : field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(Math.trunc(e.target.valueAsNumber))}
            error={errorDeCampo(field.state.meta)}
          />
        )}
      </form.Field>

      <form.Field name="disponible">
        {(field) => (
          <label className="flex items-center gap-2 text-sm font-medium text-stone-700">
            <input
              type="checkbox"
              checked={field.state.value}
              onChange={(e) => field.handleChange(e.target.checked)}
              className="h-4 w-4 accent-marca-500"
            />
            Disponible para la venta
          </label>
        )}
      </form.Field>

      <div className="flex justify-end gap-2 pt-2">
        <Button variante="fantasma" onClick={onCancelar}>
          Cancelar
        </Button>
        <form.Subscribe selector={(s) => s.canSubmit}>
          {(puedeEnviar) => (
            <Button type="submit" disabled={!puedeEnviar || enviando}>
              {enviando ? 'Guardando...' : 'Guardar'}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  )
}
