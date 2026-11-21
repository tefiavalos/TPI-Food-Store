import type { ButtonHTMLAttributes } from 'react'

type Variante = 'primario' | 'secundario' | 'peligro' | 'fantasma'
type Tamano = 'sm' | 'md'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante
  tamano?: Tamano
}

const estilosVariante: Record<Variante, string> = {
  primario: 'bg-marca-500 text-white hover:bg-marca-700',
  secundario: 'bg-marca-100 text-marca-800 hover:bg-marca-200',
  peligro: 'bg-red-600 text-white hover:bg-red-700',
  fantasma: 'bg-transparent text-stone-600 hover:bg-stone-100',
}

const estilosTamano: Record<Tamano, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2',
}

export const Button = ({
  variante = 'primario',
  tamano = 'md',
  className = '',
  type = 'button',
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${estilosVariante[variante]} ${estilosTamano[tamano]} ${className}`}
      {...props}
    />
  )
}
