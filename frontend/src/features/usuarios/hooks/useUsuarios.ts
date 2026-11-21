import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { activarUsuario, desactivarUsuario, getUsuarios } from '../api/usuarios'

export const useUsuarios = () =>
  useQuery({
    queryKey: ['usuarios'],
    queryFn: getUsuarios,
  })

export const useActivarUsuario = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => activarUsuario(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['usuarios'] }),
  })
}

export const useDesactivarUsuario = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => desactivarUsuario(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['usuarios'] }),
  })
}
