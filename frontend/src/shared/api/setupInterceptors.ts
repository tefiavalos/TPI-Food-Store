import axios from 'axios'
import { useAuthStore } from '@/store/authStore'
import { api } from './axiosInstance'

const RUTAS_DE_AUTH = ['/auth/token', '/auth/me']
const CUENTA_DESACTIVADA = 'Cuenta de usuario desactivada'

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response) {
      const url = error.config?.url ?? ''
      const esDeAuth = RUTAS_DE_AUTH.some((ruta) => url.includes(ruta))
      const { status } = error.response
      const detail = (error.response.data as { detail?: unknown } | undefined)?.detail

      const sesionInvalida = status === 401 && !esDeAuth
      const cuentaDesactivada = status === 400 && detail === CUENTA_DESACTIVADA

      if (sesionInvalida || cuentaDesactivada) {
        useAuthStore.getState().limpiarSesion()
      }
    }
    return Promise.reject(error)
  },
)
