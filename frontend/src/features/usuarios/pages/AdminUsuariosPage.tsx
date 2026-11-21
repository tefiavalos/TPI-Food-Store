import type { ColumnDef } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { handleApiError } from '@/shared/api/handleApiError'
import { EstadoError } from '@/shared/components/EstadoError'
import { MensajeAlerta } from '@/shared/components/MensajeAlerta'
import { SkeletonFilas } from '@/shared/components/Skeleton'
import { TablaDatos } from '@/shared/components/TablaDatos'
import { Button } from '@/shared/ui/Button'
import { useAuthStore } from '@/store/authStore'
import { useActivarUsuario, useDesactivarUsuario, useUsuarios } from '../hooks/useUsuarios'
import type { UserPublic } from '../types/usuario'

export const AdminUsuariosPage = () => {
  const usuarioSesion = useAuthStore((s) => s.usuario)
  const { data, isLoading, isError, error, refetch } = useUsuarios()
  const activar = useActivarUsuario()
  const desactivar = useDesactivarUsuario()
  const [mensaje, setMensaje] = useState<string | null>(null)

  const columnas = useMemo<ColumnDef<UserPublic>[]>(
    () => [
      { accessorKey: 'username', header: 'Usuario' },
      { accessorKey: 'full_name', header: 'Nombre' },
      { accessorKey: 'email', header: 'Email' },
      {
        accessorKey: 'role',
        header: 'Rol',
        cell: ({ row }) => (
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              row.original.role === 'admin' ? 'bg-marca-100 text-marca-800' : 'bg-stone-100 text-stone-700'
            }`}
          >
            {row.original.role}
          </span>
        ),
      },
      {
        accessorKey: 'disabled',
        header: 'Estado',
        cell: ({ row }) =>
          row.original.disabled ? (
            <span className="font-medium text-red-600">Desactivado</span>
          ) : (
            <span className="font-medium text-emerald-700">Activo</span>
          ),
      },
      {
        id: 'acciones',
        header: 'Acciones',
        enableSorting: false,
        cell: ({ row }) => {
          const usuario = row.original
          if (usuario.disabled) {
            return (
              <Button
                tamano="sm"
                variante="secundario"
                onClick={() =>
                  activar.mutate(usuario.id, {
                    onSuccess: () => setMensaje(null),
                    onError: (e) => setMensaje(handleApiError(e)),
                  })
                }
              >
                Activar
              </Button>
            )
          }
          if (usuario.id === usuarioSesion?.id) return <span className="text-xs text-stone-400">Tu cuenta</span>
          return (
            <Button
              tamano="sm"
              variante="peligro"
              onClick={() =>
                desactivar.mutate(usuario.id, {
                  onSuccess: () => setMensaje(null),
                  onError: (e) => setMensaje(handleApiError(e)),
                })
              }
            >
              Desactivar
            </Button>
          )
        },
      },
    ],
    [activar, desactivar, usuarioSesion?.id],
  )

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold text-stone-800">Usuarios</h2>
      {mensaje && (
        <div className="mb-4">
          <MensajeAlerta mensaje={mensaje} />
        </div>
      )}
      {isLoading ? (
        <SkeletonFilas />
      ) : isError ? (
        <EstadoError error={error} onReintentar={() => void refetch()} />
      ) : (
        <TablaDatos datos={data ?? []} columnas={columnas} mensajeVacio="No hay usuarios" />
      )}
    </section>
  )
}
