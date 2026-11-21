import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { handleApiError } from '@/shared/api/handleApiError'
import { EstadoVacio } from '@/shared/components/EstadoVacio'
import { MensajeAlerta } from '@/shared/components/MensajeAlerta'
import { Card } from '@/shared/ui/Card'
import { formatearPrecio } from '@/shared/utils/formato'
import { useCartStore } from '@/store/cartStore'
import { CheckoutForm, type DatosCheckout } from '../components/CheckoutForm'
import { useCrearPedido } from '../hooks/usePedidos'

export const CheckoutPage = () => {
  const items = useCartStore((s) => s.items)
  const total = useCartStore((s) => s.total())
  const vaciar = useCartStore((s) => s.vaciar)
  const crearPedido = useCrearPedido()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  if (items.length === 0) {
    return (
      <EstadoVacio
        titulo="No hay nada para confirmar"
        descripcion="Tu carrito está vacío."
        accion={
          <Link to="/" className="font-medium text-marca-600 hover:underline">
            Ir al catálogo
          </Link>
        }
      />
    )
  }

  const confirmar = (datos: DatosCheckout) => {
    setError(null)
    crearPedido.mutate(
      {
        ...datos,
        items: items.map((i) => ({ producto_id: i.producto_id, cantidad: i.cantidad })),
      },
      {
        onSuccess: () => {
          navigate('/mis-pedidos')
          vaciar()
        },
        onError: (e) => setError(handleApiError(e)),
      },
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <h1 className="mb-4 text-2xl font-bold text-marca-800">Confirmar pedido</h1>
        <CheckoutForm enviando={crearPedido.isPending} onConfirmar={confirmar} />
        <div className="mt-4">
          <MensajeAlerta mensaje={error} />
        </div>
      </Card>

      <Card className="h-fit">
        <h2 className="mb-4 text-lg font-semibold">Tu pedido</h2>
        <ul className="divide-y divide-stone-100">
          {items.map((i) => (
            <li key={i.producto_id} className="flex justify-between py-2 text-sm">
              <span>
                {i.cantidad} × {i.nombre}
              </span>
              <span className="font-medium">{formatearPrecio(i.precio_unitario * i.cantidad)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-stone-200 pt-4 text-lg">
          <span>Total</span>
          <span className="font-bold text-marca-700">{formatearPrecio(total)}</span>
        </div>
        <Link to="/carrito" className="mt-3 inline-block text-sm text-marca-600 hover:underline">
          ← Modificar carrito
        </Link>
      </Card>
    </div>
  )
}
