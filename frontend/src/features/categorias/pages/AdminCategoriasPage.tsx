import type { ColumnDef } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { handleApiError } from '@/shared/api/handleApiError'
import { EstadoError } from '@/shared/components/EstadoError'
import { MensajeAlerta } from '@/shared/components/MensajeAlerta'
import { SkeletonFilas } from '@/shared/components/Skeleton'
import { TablaDatos } from '@/shared/components/TablaDatos'
import { Button } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'
import { CategoriaForm } from '../components/CategoriaForm'
import {
  useActualizarCategoria,
  useCategorias,
  useCrearCategoria,
  useEliminarCategoria,
} from '../hooks/useCategorias'
import type { Categoria, CategoriaCreate } from '../types/categoria'

type ModalAbierto = { tipo: 'crear' } | { tipo: 'editar'; categoria: Categoria } | null

export const AdminCategoriasPage = () => {
  const { data, isLoading, isError, error, refetch } = useCategorias()
  const crear = useCrearCategoria()
  const actualizar = useActualizarCategoria()
  const eliminar = useEliminarCategoria()

  const [modal, setModal] = useState<ModalAbierto>(null)
  const [mensaje, setMensaje] = useState<string | null>(null)
  const [errorAccion, setErrorAccion] = useState<string | null>(null)

  const cerrar = () => {
    setModal(null)
    setErrorAccion(null)
  }

  const guardar = (datos: CategoriaCreate) => {
    setErrorAccion(null)
    const opciones = {
      onSuccess: () => {
        setMensaje(modal?.tipo === 'editar' ? 'Categoría actualizada' : 'Categoría creada')
        cerrar()
      },
      onError: (e: unknown) => setErrorAccion(handleApiError(e)),
    }
    if (modal?.tipo === 'editar') {
      actualizar.mutate({ id: modal.categoria.id, cambios: datos }, opciones)
    } else {
      crear.mutate(datos, opciones)
    }
  }

  const darDeBaja = (categoria: Categoria) => {
    const confirmado = window.confirm(
      `¿Dar de baja «${categoria.nombre}»? Sus productos siguen en el catálogo: si querés retirarlos, dalos de baja también.`,
    )
    if (!confirmado) return
    eliminar.mutate(categoria.id, {
      onSuccess: () => setMensaje('Categoría dada de baja'),
      onError: (e) => setMensaje(handleApiError(e)),
    })
  }

  const columnas = useMemo<ColumnDef<Categoria>[]>(
    () => [
      { accessorKey: 'nombre', header: 'Nombre' },
      {
        accessorKey: 'descripcion',
        header: 'Descripción',
        cell: ({ row }) => row.original.descripcion ?? <span className="text-stone-400">—</span>,
      },
      {
        id: 'acciones',
        header: 'Acciones',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button tamano="sm" variante="secundario" onClick={() => setModal({ tipo: 'editar', categoria: row.original })}>
              Editar
            </Button>
            <Button tamano="sm" variante="peligro" onClick={() => darDeBaja(row.original)}>
              Baja
            </Button>
          </div>
        ),
      },
    ],
    [],
  )

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-stone-800">Categorías</h2>
        <Button onClick={() => setModal({ tipo: 'crear' })}>+ Nueva categoría</Button>
      </div>

      <div className="mb-4">
        <MensajeAlerta mensaje={mensaje} tipo="exito" />
      </div>

      {isLoading ? (
        <SkeletonFilas />
      ) : isError ? (
        <EstadoError error={error} onReintentar={() => void refetch()} />
      ) : (
        <TablaDatos datos={data ?? []} columnas={columnas} mensajeVacio="Todavía no hay categorías" />
      )}

      <Modal
        abierto={modal !== null}
        titulo={modal?.tipo === 'editar' ? 'Editar categoría' : 'Nueva categoría'}
        onCerrar={cerrar}
      >
        {modal && (
          <>
            <CategoriaForm
              key={modal.tipo === 'editar' ? modal.categoria.id : 'nueva'}
              categoria={modal.tipo === 'editar' ? modal.categoria : undefined}
              enviando={crear.isPending || actualizar.isPending}
              onGuardar={guardar}
              onCancelar={cerrar}
            />
            <div className="mt-3">
              <MensajeAlerta mensaje={errorAccion} />
            </div>
          </>
        )}
      </Modal>
    </section>
  )
}
