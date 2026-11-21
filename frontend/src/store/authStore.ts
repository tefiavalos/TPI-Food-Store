import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Rol, UserPublic } from '@/features/usuarios'
import { api } from '@/shared/api/axiosInstance'
import { queryClient } from '@/shared/api/queryClient'

interface AuthState {
  usuario: UserPublic | null
  cargando: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkSession: () => Promise<void>
  limpiarSesion: () => void
  hasRole: (...roles: Rol[]) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      usuario: null,
      cargando: true,

      login: async (username, password) => {
        await api.post('/auth/token', new URLSearchParams({ username, password }))
        const { data } = await api.get<UserPublic>('/auth/me')
        queryClient.clear()
        set({ usuario: data })
      },

      logout: async () => {
        try {
          await api.post('/auth/logout')
        } finally {
          queryClient.clear()
          set({ usuario: null })
        }
      },

      checkSession: async () => {
        try {
          const { data } = await api.get<UserPublic>('/auth/me')
          set({ usuario: data })
        } catch {
          set({ usuario: null })
        } finally {
          set({ cargando: false })
        }
      },

      limpiarSesion: () => {
        queryClient.clear()
        set({ usuario: null })
      },

      hasRole: (...roles) => {
        const usuario = get().usuario
        return usuario !== null && roles.includes(usuario.role)
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (estado) => ({ usuario: estado.usuario }),
    },
  ),
)
