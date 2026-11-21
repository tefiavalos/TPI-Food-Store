import { handleApiError } from '@/shared/api/handleApiError'
import { Button } from '@/shared/ui/Button'

interface EstadoErrorProps {
  error: unknown
  onReintentar?: () => void
}

export const EstadoError = ({ error, onReintentar }: EstadoErrorProps) => (
  <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center">
    <p className="font-semibold text-red-700">No se pudieron cargar los datos</p>
    <p className="mt-1 text-sm text-red-600">{handleApiError(error)}</p>
    {onReintentar && (
      <Button variante="secundario" tamano="sm" className="mt-4" onClick={onReintentar}>
        Reintentar
      </Button>
    )}
  </div>
)
