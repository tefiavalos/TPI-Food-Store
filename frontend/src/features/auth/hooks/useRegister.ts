import { useMutation } from '@tanstack/react-query'
import { register } from '../api/auth'
import type { UserCreate } from '../types/auth'

export const useRegister = () =>
  useMutation({
    mutationFn: (usuario: UserCreate) => register(usuario),
  })
