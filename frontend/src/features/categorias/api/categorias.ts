import { api } from '@/shared/api/axiosInstance'
import type { Categoria, CategoriaCreate, CategoriaUpdate } from '../types/categoria'

export const getCategorias = async (): Promise<Categoria[]> => {
  const { data } = await api.get<Categoria[]>('/categorias')
  return data
}

export const crearCategoria = async (categoria: CategoriaCreate): Promise<Categoria> => {
  const { data } = await api.post<Categoria>('/categorias', categoria)
  return data
}

export const actualizarCategoria = async (id: number, cambios: CategoriaUpdate): Promise<Categoria> => {
  const { data } = await api.put<Categoria>(`/categorias/${id}`, cambios)
  return data
}

export const eliminarCategoria = async (id: number): Promise<void> => {
  await api.delete(`/categorias/${id}`)
}
