import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { handleApiError } from '@/shared/api/handleApiError'
import { MensajeAlerta } from '@/shared/components/MensajeAlerta'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { Input } from '@/shared/ui/Input'
import { email, errorDeCampo, largo } from '@/shared/utils/validaciones'
import { useRegister } from '../hooks/useRegister'

export const RegisterPage = () => {
  const registrar = useRegister()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: { username: '', full_name: '', email: '', password: '' },
    onSubmit: async ({ value }) => {
      setError(null)
      try {
        await registrar.mutateAsync({
          username: value.username.trim(),
          full_name: value.full_name.trim(),
          email: value.email.trim(),
          password: value.password,
        })
        navigate('/login', { replace: true })
      } catch (e) {
        setError(handleApiError(e))
      }
    },
  })

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <h1 className="mb-1 text-2xl font-bold text-marca-800">Crear cuenta</h1>
        <p className="mb-6 text-stone-500">Registrate para hacer tus pedidos.</p>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            void form.handleSubmit()
          }}
        >
          <form.Field name="username" validators={{ onChange: ({ value }) => largo(3, 50, 'Usuario')(value) }}>
            {(field) => (
              <Input
                id={field.name}
                label="Usuario"
                autoComplete="username"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                error={errorDeCampo(field.state.meta)}
              />
            )}
          </form.Field>

          <form.Field
            name="full_name"
            validators={{ onChange: ({ value }) => largo(2, 100, 'Nombre completo')(value) }}
          >
            {(field) => (
              <Input
                id={field.name}
                label="Nombre completo"
                autoComplete="name"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                error={errorDeCampo(field.state.meta)}
              />
            )}
          </form.Field>

          <form.Field name="email" validators={{ onChange: ({ value }) => email(value) }}>
            {(field) => (
              <Input
                id={field.name}
                label="Email"
                type="email"
                autoComplete="email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                error={errorDeCampo(field.state.meta)}
              />
            )}
          </form.Field>

          <form.Field name="password" validators={{ onChange: ({ value }) => largo(8, 72, 'Contraseña')(value) }}>
            {(field) => (
              <Input
                id={field.name}
                label="Contraseña"
                type="password"
                autoComplete="new-password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                error={errorDeCampo(field.state.meta)}
              />
            )}
          </form.Field>

          <MensajeAlerta mensaje={error} />

          <form.Subscribe selector={(s) => ({ puedeEnviar: s.canSubmit, enviando: s.isSubmitting })}>
            {({ puedeEnviar, enviando }) => (
              <Button type="submit" className="w-full" disabled={!puedeEnviar || enviando}>
                {enviando ? 'Creando cuenta...' : 'Registrarme'}
              </Button>
            )}
          </form.Subscribe>
        </form>

        <p className="mt-6 text-center text-sm text-stone-500">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="font-medium text-marca-600 hover:underline">
            Ingresá
          </Link>
        </p>
      </Card>
    </div>
  )
}
