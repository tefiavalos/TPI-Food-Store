import { useState } from 'react'
import { Button } from '@/shared/ui/Button'
import { formatearPrecio } from '@/shared/utils/formato'
import { useCartStore } from '@/store/cartStore'
import type { Producto } from '../types/producto'

interface ProductoCardProps {
  producto: Producto
}

export const ProductoCard = ({ producto }: ProductoCardProps) => {
  const agregar = useCartStore((s) => s.agregar)
  const enCarrito = useCartStore((s) => s.items.find((i) => i.producto_id === producto.id)?.cantidad ?? 0)
  const [imagenRota, setImagenRota] = useState(false)

  const sinStock = producto.stock === 0
  const sePuedeComprar = producto.disponible && !sinStock && enCarrito < producto.stock

  let textoBoton = 'Agregar al carrito'
  if (!producto.disponible) textoBoton = 'No disponible'
  else if (sinStock) textoBoton = 'Sin stock'
  else if (enCarrito >= producto.stock) textoBoton = 'Máximo en el carrito'

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition hover:shadow-md">
      {producto.imagen_url && !imagenRota ? (
        <img
          src={producto.imagen_url}
          alt={producto.nombre}
          className="h-44 w-full object-cover"
          onError={() => setImagenRota(true)}
        />
      ) : (
        <div className="flex h-44 w-full items-center justify-center bg-marca-50 text-sm text-marca-400">Sin imagen</div>
      )}

      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-semibold tracking-wide text-marca-500 uppercase">
          {producto.categoria.nombre}
        </span>
        <h3 className="mt-1 font-semibold text-stone-800">{producto.nombre}</h3>
        {producto.descripcion && <p className="mt-1 line-clamp-2 text-sm text-stone-500">{producto.descripcion}</p>}

        <div className="mt-auto pt-4">
          <div className="mb-3 flex items-baseline justify-between">
            <span className="text-lg font-bold text-marca-700">{formatearPrecio(producto.precio_base)}</span>
            <span className="text-xs text-stone-500">Stock: {producto.stock}</span>
          </div>
          <Button className="w-full" disabled={!sePuedeComprar} onClick={() => agregar(producto)}>
            {textoBoton}
          </Button>
          {enCarrito > 0 && <p className="mt-2 text-center text-xs text-stone-500">En el carrito: {enCarrito}</p>}
        </div>
      </div>
    </article>
  )
}
