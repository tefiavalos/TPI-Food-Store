import type { ReactNode } from 'react'

interface EstadoVacioProps {
  titulo: string
  descripcion?: string
  accion?: ReactNode
}

export const EstadoVacio = ({ titulo, descripcion, accion }: EstadoVacioProps) => (
  <div className="rounded-xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center">
    <h3 className="text-lg font-semibold text-stone-700">{titulo}</h3>
    {descripcion && <p className="mt-1 text-stone-500">{descripcion}</p>}
    {accion && <div className="mt-5">{accion}</div>}
  </div>
)
