import { api } from '@/shared/api/axiosInstance'
import type { UserPublic } from '@/features/usuarios'
import type { UserCreate } from '../types/auth'

export const register = async (usuario: UserCreate): Promise<UserPublic> => {
  const { data } = await api.post<UserPublic>('/auth/register', usuario)
  return data
}
