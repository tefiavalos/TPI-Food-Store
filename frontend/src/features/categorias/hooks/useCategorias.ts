import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  actualizarCategoria,
  crearCategoria,
  eliminarCategoria,
  getCategorias,
} from '../api/categorias'
import type { CategoriaCreate, CategoriaUpdate } from '../types/categoria'

export const useCategorias = () =>
  useQuery({
    queryKey: ['categorias'],
    queryFn: getCategorias,
  })

const useInvalidarCatalogo = () => {
  const queryClient = useQueryClient()
  return () => {
    void queryClient.invalidateQueries({ queryKey: ['categorias'] })
    void queryClient.invalidateQueries({ queryKey: ['productos'] })
  }
}

export const useCrearCategoria = () => {
  const invalidar = useInvalidarCatalogo()
  return useMutation({
    mutationFn: (categoria: CategoriaCreate) => crearCategoria(categoria),
    onSuccess: invalidar,
  })
}

export const useActualizarCategoria = () => {
  const invalidar = useInvalidarCatalogo()
  return useMutation({
    mutationFn: ({ id, cambios }: { id: number; cambios: CategoriaUpdate }) =>
      actualizarCategoria(id, cambios),
    onSuccess: invalidar,
  })
}

export const useEliminarCategoria = () => {
  const invalidar = useInvalidarCatalogo()
  return useMutation({
    mutationFn: (id: number) => eliminarCategoria(id),
    onSuccess: invalidar,
  })
}
