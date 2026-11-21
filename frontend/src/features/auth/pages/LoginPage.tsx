import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { detalleDelBackend, handleApiError } from '@/shared/api/handleApiError'
import { MensajeAlerta } from '@/shared/components/MensajeAlerta'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { Input } from '@/shared/ui/Input'
import { errorDeCampo, requerido } from '@/shared/utils/validaciones'
import { useAuthStore } from '@/store/authStore'

interface EstadoNavegacion {
  from?: { pathname: string }
}

export const LoginPage = () => {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const location = useLocation()
  const destino = (location.state as EstadoNavegacion | null)?.from?.pathname ?? '/'
  const [error, setError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: { username: '', password: '' },
    onSubmit: async ({ value }) => {
      setError(null)
      try {
        await login(value.username.trim(), value.password)
        navigate(destino, { replace: true })
      } catch (e) {
        setError(detalleDelBackend(e) ?? handleApiError(e))
      }
    },
  })

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <h1 className="mb-1 text-2xl font-bold text-marca-800">Ingresar</h1>
        <p className="mb-6 text-stone-500">Accedé con tu usuario para hacer pedidos.</p>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            void form.handleSubmit()
          }}
        >
          <form.Field name="username" validators={{ onChange: ({ value }) => requerido('El usuario')(value) }}>
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

          <form.Field name="password" validators={{ onChange: ({ value }) => requerido('La contraseña')(value) }}>
            {(field) => (
              <Input
                id={field.name}
                label="Contraseña"
                type="password"
                autoComplete="current-password"
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
                {enviando ? 'Ingresando...' : 'Ingresar'}
              </Button>
            )}
          </form.Subscribe>
        </form>

        <p className="mt-6 text-center text-sm text-stone-500">
          ¿No tenés cuenta?{' '}
          <Link to="/register" className="font-medium text-marca-600 hover:underline">
            Registrate
          </Link>
        </p>
      </Card>
    </div>
  )
}
