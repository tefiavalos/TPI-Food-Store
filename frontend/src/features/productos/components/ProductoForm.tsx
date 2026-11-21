import { useForm } from '@tanstack/react-form'
import { Button } from '@/shared/ui/Button'
import { Input, Select, Textarea } from '@/shared/ui/Input'
import { errorDeCampo, largo, minimo } from '@/shared/utils/validaciones'
import type { Categoria } from '@/features/categorias'
import type { Producto, ProductoCreate } from '../types/producto'

interface ProductoFormProps {
  producto?: Producto
  categorias: Categoria[]
  enviando: boolean
  onGuardar: (datos: ProductoCreate) => void
  onCancelar: () => void
}

export const ProductoForm = ({ producto, categorias, enviando, onGuardar, onCancelar }: ProductoFormProps) => {
  const form = useForm({
    defaultValues: {
      nombre: producto?.nombre ?? '',
      descripcion: producto?.descripcion ?? '',
      precio_base: producto?.precio_base ?? 0,
      imagen_url: producto?.imagen_url ?? '',
      stock: producto?.stock ?? 0,
      disponible: producto?.disponible ?? true,
      categoria_id: producto?.categoria_id ?? categorias[0]?.id ?? 0,
    },
    onSubmit: ({ value }) => {
      onGuardar({
        nombre: value.nombre.trim(),
        descripcion: value.descripcion.trim() || null,
        precio_base: value.precio_base,
        imagen_url: value.imagen_url.trim() || null,
        stock: value.stock,
        disponible: value.disponible,
        categoria_id: value.categoria_id,
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
      <form.Field name="nombre" validators={{ onChange: ({ value }) => largo(2, 150, 'Nombre')(value) }}>
        {(field) => (
          <Input
            id="producto-nombre"
            label="Nombre"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            error={errorDeCampo(field.state.meta)}
          />
        )}
      </form.Field>

      <form.Field name="descripcion">
        {(field) => (
          <Textarea
            id="producto-descripcion"
            label="Descripción"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        )}
      </form.Field>

      <div className="grid grid-cols-2 gap-4">
        <form.Field name="precio_base" validators={{ onChange: ({ value }) => minimo(0, 'El precio')(value) }}>
          {(field) => (
            <Input
              id="producto-precio"
              label="Precio"
              type="number"
              min={0}
              step="0.01"
              value={Number.isNaN(field.state.value) ? '' : field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.valueAsNumber)}
              error={errorDeCampo(field.state.meta)}
            />
          )}
        </form.Field>

        <form.Field name="stock" validators={{ onChange: ({ value }) => minimo(0, 'El stock')(value) }}>
          {(field) => (
            <Input
              id="producto-stock"
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
      </div>

      <form.Field
        name="categoria_id"
        validators={{ onChange: ({ value }) => (value > 0 ? undefined : 'Elegí una categoría') }}
      >
        {(field) => (
          <Select
            id="producto-categoria"
            label="Categoría"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(Number(e.target.value))}
            error={errorDeCampo(field.state.meta)}
          >
            {categorias.length === 0 && <option value={0}>No hay categorías</option>}
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </Select>
        )}
      </form.Field>

      <form.Field name="imagen_url">
        {(field) => (
          <Input
            id="producto-imagen"
            label="URL de la imagen"
            type="url"
            placeholder="https://..."
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
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
