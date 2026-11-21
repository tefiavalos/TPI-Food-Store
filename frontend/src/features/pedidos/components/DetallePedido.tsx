import type { ReactNode } from 'react'
import { BadgeEstado } from '@/shared/ui/BadgeEstado'
import { formatearFecha, formatearPrecio } from '@/shared/utils/formato'
import { ETIQUETA_ESTADO, type Pedido } from '../types/pedido'

export const DetallePedido = ({ pedido }: { pedido: Pedido }) => {
  return (
    <div className="space-y-4 text-sm">
      <div className="grid grid-cols-2 gap-3">
        <Dato titulo="Estado">
          <BadgeEstado estado={pedido.estado} etiqueta={ETIQUETA_ESTADO[pedido.estado]} />
        </Dato>
        <Dato titulo="Fecha">{formatearFecha(pedido.created_at)}</Dato>
        <Dato titulo="Forma de pago">{pedido.forma_pago === 'EFECTIVO' ? 'Efectivo' : 'Transferencia'}</Dato>
        <Dato titulo="Última actualización">{formatearFecha(pedido.updated_at)}</Dato>
      </div>
      <Dato titulo="Dirección de entrega">{pedido.direccion_entrega}</Dato>
      {pedido.notas && <Dato titulo="Notas">{pedido.notas}</Dato>}

      <table className="w-full">
        <thead className="text-left text-stone-500">
          <tr>
            <th className="py-1 font-medium">Producto</th>
            <th className="py-1 text-right font-medium">Precio</th>
            <th className="py-1 text-right font-medium">Cant.</th>
            <th className="py-1 text-right font-medium">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {pedido.items.map((item) => (
            <tr key={item.producto_id} className="border-t border-stone-100">
              <td className="py-1.5">{item.nombre_producto}</td>
              <td className="py-1.5 text-right">{formatearPrecio(item.precio_unitario)}</td>
              <td className="py-1.5 text-right">{item.cantidad}</td>
              <td className="py-1.5 text-right">{formatearPrecio(item.subtotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between border-t border-stone-200 pt-3 text-base">
        <span className="font-semibold">Total</span>
        <span className="font-bold text-marca-700">{formatearPrecio(pedido.total)}</span>
      </div>
    </div>
  )
}

const Dato = ({ titulo, children }: { titulo: string; children: ReactNode }) => (
  <div>
    <p className="text-xs font-semibold tracking-wide text-stone-400 uppercase">{titulo}</p>
    <div className="mt-0.5 text-stone-700">{children}</div>
  </div>
)
