import { api } from '@/shared/api/axiosInstance'
import type {
  FiltrosProductos,
  Producto,
  ProductoCreate,
  ProductosPaginados,
  ProductoStockUpdate,
  ProductoUpdate,
} from '../types/producto'

export const getProductos = async (filtros: FiltrosProductos): Promise<ProductosPaginados> => {
  const { data } = await api.get<ProductosPaginados>('/productos', { params: filtros })
  return data
}

export const getProducto = async (id: number): Promise<Producto> => {
  const { data } = await api.get<Producto>(`/productos/${id}`)
  return data
}

export const crearProducto = async (producto: ProductoCreate): Promise<Producto> => {
  const { data } = await api.post<Producto>('/productos', producto)
  return data
}

export const actualizarProducto = async (id: number, cambios: ProductoUpdate): Promise<Producto> => {
  const { data } = await api.put<Producto>(`/productos/${id}`, cambios)
  return data
}

export const actualizarStock = async (id: number, cambios: ProductoStockUpdate): Promise<Producto> => {
  const { data } = await api.patch<Producto>(`/productos/${id}/stock`, cambios)
  return data
}

export const eliminarProducto = async (id: number): Promise<void> => {
  await api.delete(`/productos/${id}`)
}
