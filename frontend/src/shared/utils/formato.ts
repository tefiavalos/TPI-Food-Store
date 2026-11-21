const moneda = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })

const fecha = new Intl.DateTimeFormat('es-AR', { dateStyle: 'short', timeStyle: 'short' })

export const formatearPrecio = (valor: number): string => moneda.format(valor)

export const formatearFecha = (iso: string): string => fecha.format(new Date(iso))
