import { api } from '@/shared/api/axiosInstance'
import type {
  EstadoPedido,
  FiltrosPedidos,
  Pedido,
  PedidoCreate,
  PedidosPaginados,
  ResumenPedidos,
} from '../types/pedido'

export const getPedidos = async (filtros: FiltrosPedidos): Promise<PedidosPaginados> => {
  const { data } = await api.get<PedidosPaginados>('/pedidos', { params: filtros })
  return data
}

export const getPedido = async (id: number): Promise<Pedido> => {
  const { data } = await api.get<Pedido>(`/pedidos/${id}`)
  return data
}

export const crearPedido = async (pedido: PedidoCreate): Promise<Pedido> => {
  const { data } = await api.post<Pedido>('/pedidos', pedido)
  return data
}

export const cambiarEstadoPedido = async (id: number, estado: EstadoPedido): Promise<Pedido> => {
  const { data } = await api.patch<Pedido>(`/pedidos/${id}/estado`, { estado })
  return data
}

export const cancelarPedido = async (id: number): Promise<Pedido> => {
  const { data } = await api.patch<Pedido>(`/pedidos/${id}/cancelar`)
  return data
}

export const getResumenPedidos = async (): Promise<ResumenPedidos> => {
  const { data } = await api.get<ResumenPedidos>('/pedidos/resumen')
  return data
}
