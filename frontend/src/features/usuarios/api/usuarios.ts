import { api } from '@/shared/api/axiosInstance'
import type { UserPublic } from '../types/usuario'

export const getUsuarios = async (): Promise<UserPublic[]> => {
  const { data } = await api.get<UserPublic[]>('/admin/usuarios')
  return data
}

export const activarUsuario = async (id: number): Promise<UserPublic> => {
  const { data } = await api.post<UserPublic>(`/admin/usuarios/${id}/activar`)
  return data
}

export const desactivarUsuario = async (id: number): Promise<UserPublic> => {
  const { data } = await api.post<UserPublic>(`/admin/usuarios/${id}/desactivar`)
  return data
}
