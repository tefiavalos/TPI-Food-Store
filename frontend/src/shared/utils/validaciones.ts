
export const largo = (min: number, max: number, nombre: string) => (valor: string) => {
  const largoActual = valor.trim().length
  if (largoActual < min) return `${nombre}: mínimo ${min} caracteres`
  if (largoActual > max) return `${nombre}: máximo ${max} caracteres`
  return undefined
}

export const requerido = (nombre: string) => (valor: string) =>
  valor.trim().length === 0 ? `${nombre} es obligatorio` : undefined

export const email = (valor: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim()) ? undefined : 'Ingresá un email válido'

export const minimo = (min: number, nombre: string) => (valor: number) =>
  Number.isNaN(valor) || valor < min ? `${nombre} debe ser mayor o igual a ${min}` : undefined

export const errorDeCampo = (meta: { isTouched: boolean; errors: unknown[] }): string | undefined => {
  if (!meta.isTouched) return undefined
  const mensajes = meta.errors.filter((e): e is string => typeof e === 'string' && e.length > 0)
  return mensajes.length > 0 ? mensajes.join(', ') : undefined
}
