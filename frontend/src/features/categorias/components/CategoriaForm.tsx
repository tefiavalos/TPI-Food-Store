import { useForm } from '@tanstack/react-form'
import { Button } from '@/shared/ui/Button'
import { Input, Textarea } from '@/shared/ui/Input'
import { errorDeCampo, largo } from '@/shared/utils/validaciones'
import type { Categoria, CategoriaCreate } from '../types/categoria'

interface CategoriaFormProps {
  categoria?: Categoria
  enviando: boolean
  onGuardar: (datos: CategoriaCreate) => void
  onCancelar: () => void
}

export const CategoriaForm = ({ categoria, enviando, onGuardar, onCancelar }: CategoriaFormProps) => {
  const form = useForm({
    defaultValues: {
      nombre: categoria?.nombre ?? '',
      descripcion: categoria?.descripcion ?? '',
    },
    onSubmit: ({ value }) => {
      onGuardar({ nombre: value.nombre.trim(), descripcion: value.descripcion.trim() || null })
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
      <form.Field name="nombre" validators={{ onChange: ({ value }) => largo(2, 100, 'Nombre')(value) }}>
        {(field) => (
          <Input
            id="categoria-nombre"
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
            id="categoria-descripcion"
            label="Descripción"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
          />
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
