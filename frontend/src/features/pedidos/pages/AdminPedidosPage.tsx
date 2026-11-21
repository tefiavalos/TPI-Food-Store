import type { ColumnDef } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { handleApiError } from '@/shared/api/handleApiError'
import { EstadoError } from '@/shared/components/EstadoError'
import { MensajeAlerta } from '@/shared/components/MensajeAlerta'
import { SkeletonFilas } from '@/shared/components/Skeleton'
import { TablaDatos } from '@/shared/components/TablaDatos'
import { BadgeEstado } from '@/shared/ui/BadgeEstado'
import { Button } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'
import { formatearFecha, formatearPrecio } from '@/shared/utils/formato'
import { DetallePedido } from '../components/DetallePedido'
import { useCambiarEstadoPedido, usePedidos } from '../hooks/usePedidos'
import { ETIQUETA_ESTADO, TRANSICIONES, type EstadoPedido, type Pedido } from '../types/pedido'

const ESTADOS: EstadoPedido[] = ['PENDIENTE', 'EN_PREPARACION', 'ENTREGADO', 'CANCELADO']

const TEXTO_ACCION: Record<EstadoPedido, string> = {
  PENDIENTE: 'Pendiente',
  EN_PREPARACION: 'Preparar',
  ENTREGADO: 'Entregar',
  CANCELADO: 'Cancelar',
}

export const AdminPedidosPage = () => {
  const [estado, setEstado] = useState<EstadoPedido | undefined>(undefined)
  const [seleccionado, setSeleccionado] = useState<Pedido | null>(null)
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: 'error' | 'exito' } | null>(null)

  const { data, isLoading, isError, error, refetch } = usePedidos({ skip: 0, limit: 100, estado })
  const cambiarEstado = useCambiarEstadoPedido()

  const aplicarTransicion = (pedido: Pedido, nuevo: EstadoPedido) => {
    if (nuevo === 'CANCELADO' && !window.confirm(`¿Cancelar el pedido #${pedido.id}? Se devuelve el stock.`)) return
    cambiarEstado.mutate(
      { id: pedido.id, estado: nuevo },
      {
        onSuccess: () =>
          setMensaje({ texto: `Pedido #${pedido.id}: ${ETIQUETA_ESTADO[nuevo].toLowerCase()}`, tipo: 'exito' }),
        onError: (e) => setMensaje({ texto: handleApiError(e), tipo: 'error' }),
      },
    )
  }

  const columnas = useMemo<ColumnDef<Pedido>[]>(
    () => [
      { accessorKey: 'id', header: '#' },
      {
        accessorKey: 'created_at',
        header: 'Fecha',
        cell: ({ row }) => formatearFecha(row.original.created_at),
      },
      {
        accessorKey: 'usuario_id',
        header: 'Cliente',
        cell: ({ row }) => `Usuario #${row.original.usuario_id}`,
      },
      {
        accessorKey: 'total',
        header: 'Total',
        cell: ({ row }) => formatearPrecio(row.original.total),
      },
      {
        accessorKey: 'estado',
        header: 'Estado',
        cell: ({ row }) => <BadgeEstado estado={row.original.estado} etiqueta={ETIQUETA_ESTADO[row.original.estado]} />,
      },
      {
        id: 'acciones',
        header: 'Acciones',
        enableSorting: false,
        cell: ({ row }) => {
          const pedido = row.original
          return (
            <div className="flex flex-wrap gap-2">
              <Button tamano="sm" variante="fantasma" onClick={() => setSeleccionado(pedido)}>
                Detalle
              </Button>
              {TRANSICIONES[pedido.estado].map((siguiente) => (
                <Button
                  key={siguiente}
                  tamano="sm"
                  variante={siguiente === 'CANCELADO' ? 'peligro' : 'primario'}
                  onClick={() => aplicarTransicion(pedido, siguiente)}
                >
                  {TEXTO_ACCION[siguiente]}
                </Button>
              ))}
            </div>
          )
        },
      },
    ],
    [],
  )

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-stone-800">Pedidos</h2>
        <select
          value={estado ?? ''}
          onChange={(e) => {
            const valor = ESTADOS.find((s) => s === e.target.value)
            setEstado(valor)
          }}
          className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
        >
          <option value="">Todos los estados</option>
          {ESTADOS.map((s) => (
            <option key={s} value={s}>
              {ETIQUETA_ESTADO[s]}
            </option>
          ))}
        </select>
      </div>

      {mensaje && (
        <div className="mb-4">
          <MensajeAlerta mensaje={mensaje.texto} tipo={mensaje.tipo} />
        </div>
      )}

      {isLoading ? (
        <SkeletonFilas />
      ) : isError ? (
        <EstadoError error={error} onReintentar={() => void refetch()} />
      ) : (
        <TablaDatos datos={data?.items ?? []} columnas={columnas} mensajeVacio="No hay pedidos con ese estado" />
      )}

      <Modal
        abierto={seleccionado !== null}
        titulo={`Pedido #${seleccionado?.id ?? ''}`}
        onCerrar={() => setSeleccionado(null)}
      >
        {seleccionado && <DetallePedido pedido={seleccionado} />}
      </Modal>
    </section>
  )
}
