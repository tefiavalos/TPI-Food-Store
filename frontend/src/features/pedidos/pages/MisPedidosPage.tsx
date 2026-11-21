import { useState } from 'react'
import { Link } from 'react-router-dom'
import { handleApiError } from '@/shared/api/handleApiError'
import { EstadoError } from '@/shared/components/EstadoError'
import { EstadoVacio } from '@/shared/components/EstadoVacio'
import { MensajeAlerta } from '@/shared/components/MensajeAlerta'
import { Paginacion } from '@/shared/components/Paginacion'
import { SkeletonFilas } from '@/shared/components/Skeleton'
import { BadgeEstado } from '@/shared/ui/BadgeEstado'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { Modal } from '@/shared/ui/Modal'
import { formatearFecha, formatearPrecio } from '@/shared/utils/formato'
import { DetallePedido } from '../components/DetallePedido'
import { useCancelarPedido, usePedido, usePedidos } from '../hooks/usePedidos'
import { ETIQUETA_ESTADO, type Pedido } from '../types/pedido'

const POR_PAGINA = 10

export const MisPedidosPage = () => {
  const [pagina, setPagina] = useState(0)
  const [pedidoId, setPedidoId] = useState<number | null>(null)
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: 'error' | 'exito' } | null>(null)

  const { data, isLoading, isError, error, refetch } = usePedidos({
    skip: pagina * POR_PAGINA,
    limit: POR_PAGINA,
  })
  const detalle = usePedido(pedidoId)
  const cancelar = useCancelarPedido()

  const cancelarPedido = (pedido: Pedido) => {
    if (!window.confirm(`¿Cancelar el pedido #${pedido.id}?`)) return
    cancelar.mutate(pedido.id, {
      onSuccess: () => setMensaje({ texto: `Pedido #${pedido.id} cancelado`, tipo: 'exito' }),
      onError: (e) => setMensaje({ texto: handleApiError(e), tipo: 'error' }),
    })
  }

  const totalPaginas = data ? Math.ceil(data.total / POR_PAGINA) : 0

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-marca-800">Mis pedidos</h1>

      {mensaje && (
        <div className="mb-4">
          <MensajeAlerta mensaje={mensaje.texto} tipo={mensaje.tipo} />
        </div>
      )}

      {isLoading ? (
        <SkeletonFilas />
      ) : isError ? (
        <EstadoError error={error} onReintentar={() => void refetch()} />
      ) : !data || data.items.length === 0 ? (
        <EstadoVacio
          titulo="Todavía no hiciste pedidos"
          accion={
            <Link to="/" className="font-medium text-marca-600 hover:underline">
              Ver el catálogo
            </Link>
          }
        />
      ) : (
        <>
          <div className="space-y-3">
            {data.items.map((pedido) => (
              <Card key={pedido.id} className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">
                    Pedido #{pedido.id} <BadgeEstado estado={pedido.estado} etiqueta={ETIQUETA_ESTADO[pedido.estado]} />
                  </p>
                  <p className="text-sm text-stone-500">
                    {formatearFecha(pedido.created_at)} · {pedido.items.length} producto
                    {pedido.items.length === 1 ? '' : 's'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-marca-700">{formatearPrecio(pedido.total)}</span>
                  <Button variante="secundario" tamano="sm" onClick={() => setPedidoId(pedido.id)}>
                    Ver detalle
                  </Button>
                  {pedido.estado === 'PENDIENTE' && (
                    <Button
                      variante="peligro"
                      tamano="sm"
                      disabled={cancelar.isPending}
                      onClick={() => cancelarPedido(pedido)}
                    >
                      Cancelar
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
          <Paginacion pagina={pagina} totalPaginas={totalPaginas} onCambiar={setPagina} />
        </>
      )}

      <Modal abierto={pedidoId !== null} titulo={`Pedido #${pedidoId ?? ''}`} onCerrar={() => setPedidoId(null)}>
        {detalle.isLoading && <SkeletonFilas cantidad={3} />}
        {detalle.isError && <EstadoError error={detalle.error} />}
        {detalle.data && <DetallePedido pedido={detalle.data} />}
      </Modal>
    </div>
  )
}
