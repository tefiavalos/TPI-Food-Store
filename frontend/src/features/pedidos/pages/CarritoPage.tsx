import { Link, useNavigate } from 'react-router-dom'
import { EstadoVacio } from '@/shared/components/EstadoVacio'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { formatearPrecio } from '@/shared/utils/formato'
import { useCartStore } from '@/store/cartStore'

export const CarritoPage = () => {
  const items = useCartStore((s) => s.items)
  const total = useCartStore((s) => s.total())
  const quitar = useCartStore((s) => s.quitar)
  const cambiarCantidad = useCartStore((s) => s.cambiarCantidad)
  const vaciar = useCartStore((s) => s.vaciar)
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <EstadoVacio
        titulo="Tu carrito está vacío"
        descripcion="Agregá productos desde el catálogo."
        accion={
          <Link to="/" className="font-medium text-marca-600 hover:underline">
            Ir al catálogo
          </Link>
        }
      />
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <h1 className="mb-4 text-2xl font-bold text-marca-800">Carrito</h1>
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.producto_id} className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-semibold">{item.nombre}</p>
                <p className="text-sm text-stone-500">{formatearPrecio(item.precio_unitario)} c/u</p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variante="secundario"
                  tamano="sm"
                  disabled={item.cantidad <= 1}
                  onClick={() => cambiarCantidad(item.producto_id, item.cantidad - 1)}
                  aria-label="Restar"
                >
                  −
                </Button>
                <span className="w-8 text-center font-medium">{item.cantidad}</span>
                <Button
                  variante="secundario"
                  tamano="sm"
                  onClick={() => cambiarCantidad(item.producto_id, item.cantidad + 1)}
                  aria-label="Sumar"
                >
                  +
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <span className="w-28 text-right font-semibold text-marca-700">
                  {formatearPrecio(item.precio_unitario * item.cantidad)}
                </span>
                <Button variante="fantasma" tamano="sm" onClick={() => quitar(item.producto_id)}>
                  Quitar
                </Button>
              </div>
            </Card>
          ))}
        </div>
        <Button variante="fantasma" tamano="sm" className="mt-3" onClick={vaciar}>
          Vaciar carrito
        </Button>
      </div>

      <Card className="h-fit">
        <h2 className="mb-4 text-lg font-semibold">Resumen</h2>
        <div className="flex justify-between text-lg">
          <span>Total</span>
          <span className="font-bold text-marca-700">{formatearPrecio(total)}</span>
        </div>
        <p className="mt-2 text-xs text-stone-500">El stock se confirma al hacer el pedido.</p>
        <Button className="mt-5 w-full" onClick={() => navigate('/checkout')}>
          Confirmar pedido
        </Button>
      </Card>
    </div>
  )
}
