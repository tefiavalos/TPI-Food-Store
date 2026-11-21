import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

const estiloCampo =
  'w-full rounded-lg border border-stone-300 bg-white px-3 py-2 outline-none focus:border-marca-500 focus:ring-2 focus:ring-marca-100'

interface CampoProps {
  label: string
  error?: string
}

const Etiqueta = ({ label, id }: { label: string; id?: string }) => (
  <label htmlFor={id} className="mb-1 block text-sm font-medium text-stone-700">
    {label}
  </label>
)

const MensajeError = ({ error }: { error?: string }) =>
  error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null

type InputProps = CampoProps & InputHTMLAttributes<HTMLInputElement>

export const Input = ({ label, error, id, className = '', ...props }: InputProps) => {
  return (
    <div className={className}>
      <Etiqueta label={label} id={id} />
      <input id={id} className={estiloCampo} {...props} />
      <MensajeError error={error} />
    </div>
  )
}

type SelectProps = CampoProps & SelectHTMLAttributes<HTMLSelectElement>

export const Select = ({ label, error, id, className = '', children, ...props }: SelectProps) => {
  return (
    <div className={className}>
      <Etiqueta label={label} id={id} />
      <select id={id} className={estiloCampo} {...props}>
        {children}
      </select>
      <MensajeError error={error} />
    </div>
  )
}

type TextareaProps = CampoProps & TextareaHTMLAttributes<HTMLTextAreaElement>

export const Textarea = ({ label, error, id, className = '', ...props }: TextareaProps) => {
  return (
    <div className={className}>
      <Etiqueta label={label} id={id} />
      <textarea id={id} className={estiloCampo} rows={3} {...props} />
      <MensajeError error={error} />
    </div>
  )
}
