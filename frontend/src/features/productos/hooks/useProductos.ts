import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  actualizarProducto,
  actualizarStock,
  crearProducto,
  eliminarProducto,
  getProductos,
} from '../api/productos'
import type {
  FiltrosProductos,
  ProductoCreate,
  ProductoStockUpdate,
  ProductoUpdate,
} from '../types/producto'

export const useProductos = (filtros: FiltrosProductos) =>
  useQuery({
    queryKey: ['productos', filtros],
    queryFn: () => getProductos(filtros),
    placeholderData: keepPreviousData,
  })

const useInvalidarProductos = () => {
  const queryClient = useQueryClient()
  return () => {
    void queryClient.invalidateQueries({ queryKey: ['productos'] })
  }
}

export const useCrearProducto = () => {
  const invalidar = useInvalidarProductos()
  return useMutation({
    mutationFn: (producto: ProductoCreate) => crearProducto(producto),
    onSuccess: invalidar,
  })
}

export const useActualizarProducto = () => {
  const invalidar = useInvalidarProductos()
  return useMutation({
    mutationFn: ({ id, cambios }: { id: number; cambios: ProductoUpdate }) =>
      actualizarProducto(id, cambios),
    onSuccess: invalidar,
  })
}

export const useActualizarStock = () => {
  const invalidar = useInvalidarProductos()
  return useMutation({
    mutationFn: ({ id, cambios }: { id: number; cambios: ProductoStockUpdate }) =>
      actualizarStock(id, cambios),
    onSuccess: invalidar,
  })
}

export const useEliminarProducto = () => {
  const invalidar = useInvalidarProductos()
  return useMutation({
    mutationFn: (id: number) => eliminarProducto(id),
    onSuccess: invalidar,
  })
}
