import { Button } from '@/shared/ui/Button'

interface PaginacionProps {
  pagina: number
  totalPaginas: number
  onCambiar: (pagina: number) => void
}

export const Paginacion = ({ pagina, totalPaginas, onCambiar }: PaginacionProps) => {
  if (totalPaginas <= 1) return null

  return (
    <div className="mt-6 flex items-center justify-center gap-3">
      <Button variante="secundario" tamano="sm" disabled={pagina === 0} onClick={() => onCambiar(pagina - 1)}>
        ← Anterior
      </Button>
      <span className="text-sm text-stone-600">
        Página {pagina + 1} de {totalPaginas}
      </span>
      <Button
        variante="secundario"
        tamano="sm"
        disabled={pagina >= totalPaginas - 1}
        onClick={() => onCambiar(pagina + 1)}
      >
        Siguiente →
      </Button>
    </div>
  )
}
