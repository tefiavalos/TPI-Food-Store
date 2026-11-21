import type { EstadoPedido } from '@/features/pedidos'

const colores: Record<EstadoPedido, string> = {
  PENDIENTE: 'bg-amber-100 text-amber-800',
  EN_PREPARACION: 'bg-sky-100 text-sky-800',
  ENTREGADO: 'bg-emerald-100 text-emerald-800',
  CANCELADO: 'bg-stone-200 text-stone-600',
}

interface BadgeEstadoProps {
  estado: EstadoPedido
  etiqueta: string
}

export const BadgeEstado = ({ estado, etiqueta }: BadgeEstadoProps) => {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${colores[estado]}`}>
      {etiqueta}
    </span>
  )
}
