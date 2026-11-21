import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  cambiarEstadoPedido,
  cancelarPedido,
  crearPedido,
  getPedido,
  getPedidos,
  getResumenPedidos,
} from '../api/pedidos'
import type { EstadoPedido, FiltrosPedidos, PedidoCreate } from '../types/pedido'

export const usePedidos = (filtros: FiltrosPedidos) =>
  useQuery({
    queryKey: ['pedidos', 'lista', filtros],
    queryFn: () => getPedidos(filtros),
    placeholderData: keepPreviousData,
  })

export const usePedido = (id: number | null) =>
  useQuery({
    queryKey: ['pedidos', 'detalle', id],
    queryFn: () => getPedido(id ?? 0),
    enabled: id !== null,
  })

export const useResumenPedidos = () =>
  useQuery({
    queryKey: ['pedidos', 'resumen'],
    queryFn: getResumenPedidos,
  })

const useInvalidarPedidos = () => {
  const queryClient = useQueryClient()
  return () => {
    void queryClient.invalidateQueries({ queryKey: ['pedidos'] })
    void queryClient.invalidateQueries({ queryKey: ['productos'] })
  }
}

export const useCrearPedido = () => {
  const invalidar = useInvalidarPedidos()
  return useMutation({
    mutationFn: (pedido: PedidoCreate) => crearPedido(pedido),
    onSuccess: invalidar,
  })
}

export const useCambiarEstadoPedido = () => {
  const invalidar = useInvalidarPedidos()
  return useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: EstadoPedido }) => cambiarEstadoPedido(id, estado),
    onSuccess: invalidar,
  })
}

export const useCancelarPedido = () => {
  const invalidar = useInvalidarPedidos()
  return useMutation({
    mutationFn: (id: number) => cancelarPedido(id),
    onSuccess: invalidar,
  })
}
