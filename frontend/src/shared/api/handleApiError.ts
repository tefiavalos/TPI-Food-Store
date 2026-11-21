import axios from 'axios'

export const detalleDelBackend = (error: unknown): string | null => {
  if (!axios.isAxiosError(error)) return null
  const detail = (error.response?.data as { detail?: unknown } | undefined)?.detail
  return typeof detail === 'string' ? detail : null
}

export const handleApiError = (error: unknown): string => {
  if (!axios.isAxiosError(error)) return 'Error inesperado.'
  if (error.code === 'ECONNABORTED') return 'El servidor tardó demasiado en responder.'
  if (!error.response) return 'No se pudo conectar con el servidor.'

  const { status } = error.response
  switch (status) {
    case 401:
      return 'La sesión venció. Es necesario iniciar sesión de nuevo.'
    case 403:
      return 'No tenés permisos para realizar esta acción.'
    case 422:
      return 'Los datos enviados no son válidos.'
  }
  const detail = detalleDelBackend(error)
  if (detail) return detail
  if (status < 500) return 'No se pudo completar la operación.'
  return 'Error del servidor. Intentá nuevamente más tarde.'
}
