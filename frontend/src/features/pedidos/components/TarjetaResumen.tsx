interface TarjetaResumenProps {
  titulo: string
  valor: string | number
  color: string
}

export const TarjetaResumen = ({ titulo, valor, color }: TarjetaResumenProps) => (
  <div className={`rounded-xl border bg-white p-5 shadow-sm ${color}`}>
    <p className="text-sm font-medium text-stone-500">{titulo}</p>
    <p className="mt-2 text-3xl font-bold text-stone-800">{valor}</p>
  </div>
)
