import { useState, type FormEvent } from 'react'
import { EstadoError } from '@/shared/components/EstadoError'
import { EstadoVacio } from '@/shared/components/EstadoVacio'
import { Paginacion } from '@/shared/components/Paginacion'
import { SkeletonGrilla } from '@/shared/components/Skeleton'
import { Button } from '@/shared/ui/Button'
import { useCategorias } from '@/features/categorias'
import { ProductoCard } from '../components/ProductoCard'
import { useProductos } from '../hooks/useProductos'

const POR_PAGINA = 8

export const CatalogoPage = () => {
  const [pagina, setPagina] = useState(0)
  const [textoBusqueda, setTextoBusqueda] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [categoriaId, setCategoriaId] = useState<number | undefined>(undefined)

  const { data: categorias } = useCategorias()
  const { data, isLoading, isError, error, refetch, isFetching } = useProductos({
    skip: pagina * POR_PAGINA,
    limit: POR_PAGINA,
    search: busqueda || undefined,
    categoria_id: categoriaId,
  })

  const totalPaginas = data ? Math.ceil(data.total / POR_PAGINA) : 0

  const buscar = (e: FormEvent) => {
    e.preventDefault()
    setBusqueda(textoBusqueda.trim())
    setPagina(0)
  }

  const elegirCategoria = (id: number | undefined) => {
    setCategoriaId(id)
    setPagina(0)
  }

  const limpiarFiltros = () => {
    setTextoBusqueda('')
    setBusqueda('')
    setCategoriaId(undefined)
    setPagina(0)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-marca-800">Nuestro menú</h1>
        <p className="text-stone-500">Elegí lo que quieras y armá tu pedido.</p>
      </div>

      <form onSubmit={buscar} className="mb-4 flex gap-2">
        <input
          type="search"
          value={textoBusqueda}
          onChange={(e) => setTextoBusqueda(e.target.value)}
          placeholder="Buscar por nombre..."
          className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 outline-none focus:border-marca-500 focus:ring-2 focus:ring-marca-100"
        />
        <Button type="submit">Buscar</Button>
      </form>

      <div className="mb-6 flex flex-wrap gap-2">
        <FiltroChip activo={categoriaId === undefined} onClick={() => elegirCategoria(undefined)}>
          Todas
        </FiltroChip>
        {categorias?.map((c) => (
          <FiltroChip key={c.id} activo={categoriaId === c.id} onClick={() => elegirCategoria(c.id)}>
            {c.nombre}
          </FiltroChip>
        ))}
      </div>

      {isLoading ? (
        <SkeletonGrilla cantidad={POR_PAGINA} />
      ) : isError ? (
        <EstadoError error={error} onReintentar={() => void refetch()} />
      ) : !data || data.items.length === 0 ? (
        <EstadoVacio
          titulo="No encontramos productos"
          descripcion="Probá con otra búsqueda o categoría."
          accion={
            <Button variante="secundario" onClick={limpiarFiltros}>
              Ver todo el menú
            </Button>
          }
        />
      ) : (
        <>
          <p className="mb-3 text-sm text-stone-500">
            {data.total} producto{data.total === 1 ? '' : 's'}
            {isFetching && ' · actualizando...'}
          </p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {data.items.map((p) => (
              <ProductoCard key={p.id} producto={p} />
            ))}
          </div>
          <Paginacion pagina={pagina} totalPaginas={totalPaginas} onCambiar={setPagina} />
        </>
      )}
    </div>
  )
}

interface FiltroChipProps {
  activo: boolean
  onClick: () => void
  children: string
}

const FiltroChip = ({ activo, onClick, children }: FiltroChipProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
      activo
        ? 'border-marca-500 bg-marca-500 text-white'
        : 'border-marca-200 bg-white text-marca-700 hover:bg-marca-50'
    }`}
  >
    {children}
  </button>
)
