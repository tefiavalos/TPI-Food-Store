interface MensajeAlertaProps {
  mensaje: string | null
  tipo?: 'error' | 'exito'
}

export const MensajeAlerta = ({ mensaje, tipo = 'error' }: MensajeAlertaProps) => {
  if (!mensaje) return null
  const estilo =
    tipo === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'
  return <div className={`rounded-lg border px-4 py-3 text-sm ${estilo}`}>{mensaje}</div>
}
