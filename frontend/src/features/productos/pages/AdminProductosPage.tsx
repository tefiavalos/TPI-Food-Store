import type { ColumnDef } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { handleApiError } from '@/shared/api/handleApiError'
import { EstadoError } from '@/shared/components/EstadoError'
import { MensajeAlerta } from '@/shared/components/MensajeAlerta'
import { SkeletonFilas } from '@/shared/components/Skeleton'
import { TablaDatos } from '@/shared/components/TablaDatos'
import { Button } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'
import { formatearPrecio } from '@/shared/utils/formato'
import { useCategorias } from '@/features/categorias'
import { ProductoForm } from '../components/ProductoForm'
import { StockForm } from '../components/StockForm'
import {
  useActualizarProducto,
  useActualizarStock,
  useCrearProducto,
  useEliminarProducto,
  useProductos,
} from '../hooks/useProductos'
import type { Producto, ProductoCreate, ProductoStockUpdate } from '../types/producto'

type ModalAbierto = { tipo: 'crear' } | { tipo: 'editar'; producto: Producto } | { tipo: 'stock'; producto: Producto } | null

export const AdminProductosPage = () => {
  const { data, isLoading, isError, error, refetch } = useProductos({ skip: 0, limit: 100 })
  const { data: categorias = [] } = useCategorias()
  const crear = useCrearProducto()
  const actualizar = useActualizarProducto()
  const actualizarStock = useActualizarStock()
  const eliminar = useEliminarProducto()

  const [modal, setModal] = useState<ModalAbierto>(null)
  const [mensaje, setMensaje] = useState<string | null>(null)
  const [errorAccion, setErrorAccion] = useState<string | null>(null)

  const cerrar = () => {
    setModal(null)
    setErrorAccion(null)
  }

  const avisar = (texto: string) => {
    setMensaje(texto)
    cerrar()
  }

  const guardarProducto = (datos: ProductoCreate) => {
    setErrorAccion(null)
    if (modal?.tipo === 'editar') {
      actualizar.mutate(
        { id: modal.producto.id, cambios: datos },
        { onSuccess: () => avisar('Producto actualizado'), onError: (e) => setErrorAccion(handleApiError(e)) },
      )
    } else {
      crear.mutate(datos, {
        onSuccess: () => avisar('Producto creado'),
        onError: (e) => setErrorAccion(handleApiError(e)),
      })
    }
  }

  const guardarStock = (datos: ProductoStockUpdate) => {
    if (modal?.tipo !== 'stock') return
    actualizarStock.mutate(
      { id: modal.producto.id, cambios: datos },
      { onSuccess: () => avisar('Stock actualizado'), onError: (e) => setErrorAccion(handleApiError(e)) },
    )
  }

  const darDeBaja = (producto: Producto) => {
    if (!window.confirm(`¿Dar de baja «${producto.nombre}»? Deja de mostrarse en el catálogo.`)) return
    eliminar.mutate(producto.id, {
      onSuccess: () => setMensaje('Producto dado de baja'),
      onError: (e) => setMensaje(handleApiError(e)),
    })
  }

  const columnas = useMemo<ColumnDef<Producto>[]>(
    () => [
      { accessorKey: 'nombre', header: 'Nombre' },
      {
        id: 'categoria',
        header: 'Categoría',
        accessorFn: (p) => p.categoria.nombre,
        cell: ({ row }) => row.original.categoria.nombre,
      },
      {
        accessorKey: 'precio_base',
        header: 'Precio',
        cell: ({ row }) => formatearPrecio(row.original.precio_base),
      },
      {
        accessorKey: 'stock',
        header: 'Stock',
        cell: ({ row }) => (
          <span className={row.original.stock === 0 ? 'font-semibold text-red-600' : ''}>{row.original.stock}</span>
        ),
      },
      {
        accessorKey: 'disponible',
        header: 'Disponible',
        cell: ({ row }) =>
          row.original.disponible ? (
            <span className="text-emerald-700">Sí</span>
          ) : (
            <span className="text-stone-500">No</span>
          ),
      },
      {
        id: 'acciones',
        header: 'Acciones',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-2">
            <Button tamano="sm" variante="secundario" onClick={() => setModal({ tipo: 'editar', producto: row.original })}>
              Editar
            </Button>
            <Button tamano="sm" variante="secundario" onClick={() => setModal({ tipo: 'stock', producto: row.original })}>
              Stock
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
        <h2 className="text-xl font-semibold text-stone-800">Productos</h2>
        <Button onClick={() => setModal({ tipo: 'crear' })} disabled={categorias.length === 0}>
          + Nuevo producto
        </Button>
      </div>

      <div className="mb-4">
        <MensajeAlerta mensaje={mensaje} tipo="exito" />
      </div>

      {isLoading ? (
        <SkeletonFilas />
      ) : isError ? (
        <EstadoError error={error} onReintentar={() => void refetch()} />
      ) : (
        <TablaDatos datos={data?.items ?? []} columnas={columnas} mensajeVacio="Todavía no hay productos" />
      )}

      <Modal
        abierto={modal?.tipo === 'crear' || modal?.tipo === 'editar'}
        titulo={modal?.tipo === 'editar' ? 'Editar producto' : 'Nuevo producto'}
        onCerrar={cerrar}
      >
        {(modal?.tipo === 'crear' || modal?.tipo === 'editar') && (
          <>
            <ProductoForm
              key={modal.tipo === 'editar' ? modal.producto.id : 'nuevo'}
              producto={modal.tipo === 'editar' ? modal.producto : undefined}
              categorias={categorias}
              enviando={crear.isPending || actualizar.isPending}
              onGuardar={guardarProducto}
              onCancelar={cerrar}
            />
            <div className="mt-3">
              <MensajeAlerta mensaje={errorAccion} />
            </div>
          </>
        )}
      </Modal>

      <Modal abierto={modal?.tipo === 'stock'} titulo="Stock y disponibilidad" onCerrar={cerrar}>
        {modal?.tipo === 'stock' && (
          <>
            <StockForm
              key={modal.producto.id}
              producto={modal.producto}
              enviando={actualizarStock.isPending}
              onGuardar={guardarStock}
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
