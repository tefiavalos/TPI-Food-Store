import { EstadoError } from '@/shared/components/EstadoError'
import { Skeleton } from '@/shared/components/Skeleton'
import { formatearPrecio } from '@/shared/utils/formato'
import { TarjetaResumen } from '../components/TarjetaResumen'
import { useResumenPedidos } from '../hooks/usePedidos'

export const AdminResumenPage = () => {
  const { data, isLoading, isError, error, refetch } = useResumenPedidos()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
    )
  }

  if (isError || !data) return <EstadoError error={error} onReintentar={() => void refetch()} />

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold text-stone-800">Resumen del negocio</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <TarjetaResumen titulo="Pedidos de hoy" valor={data.pedidos_hoy} color="border-marca-300" />
        <TarjetaResumen
          titulo="Ingresos (pedidos entregados)"
          valor={formatearPrecio(data.ingresos_entregados)}
          color="border-emerald-300"
        />
        <TarjetaResumen titulo="Pendientes" valor={data.pendientes} color="border-amber-300" />
        <TarjetaResumen titulo="En preparación" valor={data.en_preparacion} color="border-sky-300" />
        <TarjetaResumen titulo="Entregados" valor={data.entregados} color="border-emerald-300" />
        <TarjetaResumen titulo="Cancelados" valor={data.cancelados} color="border-stone-300" />
      </div>
    </section>
  )
}
