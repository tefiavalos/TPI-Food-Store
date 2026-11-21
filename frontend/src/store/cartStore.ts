import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ItemCarrito {
  producto_id: number
  nombre: string
  precio_unitario: number
  cantidad: number
}

interface ProductoParaCarrito {
  id: number
  nombre: string
  precio_base: number
}

interface CartState {
  items: ItemCarrito[]
  agregar: (producto: ProductoParaCarrito, cantidad?: number) => void
  quitar: (productoId: number) => void
  cambiarCantidad: (productoId: number, cantidad: number) => void
  vaciar: () => void
  total: () => number
  cantidadItems: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      agregar: (producto, cantidad = 1) =>
        set((estado) => {
          const existente = estado.items.find((i) => i.producto_id === producto.id)
          if (existente) {
            return {
              items: estado.items.map((i) =>
                i.producto_id === producto.id ? { ...i, cantidad: i.cantidad + cantidad } : i,
              ),
            }
          }
          return {
            items: [
              ...estado.items,
              {
                producto_id: producto.id,
                nombre: producto.nombre,
                precio_unitario: producto.precio_base,
                cantidad,
              },
            ],
          }
        }),

      quitar: (productoId) =>
        set((estado) => ({ items: estado.items.filter((i) => i.producto_id !== productoId) })),

      cambiarCantidad: (productoId, cantidad) =>
        set((estado) => ({
          items: estado.items.map((i) =>
            i.producto_id === productoId ? { ...i, cantidad: Math.max(1, cantidad) } : i,
          ),
        })),

      vaciar: () => set({ items: [] }),

      total: () => get().items.reduce((acum, i) => acum + i.precio_unitario * i.cantidad, 0),

      cantidadItems: () => get().items.reduce((acum, i) => acum + i.cantidad, 0),
    }),
    { name: 'foodstore-carrito' },
  ),
)
