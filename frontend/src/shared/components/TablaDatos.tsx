import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
import { useState } from 'react'
import { Button } from '@/shared/ui/Button'

interface TablaDatosProps<T> {
  datos: T[]
  columnas: ColumnDef<T>[]
  tamanoPagina?: number
  mensajeVacio?: string
}

export const TablaDatos = <T,>({
  datos,
  columnas,
  tamanoPagina = 10,
  mensajeVacio = 'No hay registros',
}: TablaDatosProps<T>) => {
  const [sorting, setSorting] = useState<SortingState>([])

  const tabla = useReactTable({
    data: datos,
    columns: columnas,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: tamanoPagina } },
  })

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-marca-50 text-left text-marca-800">
            {tabla.getHeaderGroups().map((grupo) => (
              <tr key={grupo.id}>
                {grupo.headers.map((header) => {
                  const ordenable = header.column.getCanSort()
                  const orden = header.column.getIsSorted()
                  return (
                    <th
                      key={header.id}
                      className={`px-4 py-3 font-semibold ${ordenable ? 'cursor-pointer select-none' : ''}`}
                      onClick={ordenable ? header.column.getToggleSortingHandler() : undefined}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                      {orden === 'asc' && ' ▲'}
                      {orden === 'desc' && ' ▼'}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {tabla.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columnas.length} className="px-4 py-8 text-center text-stone-500">
                  {mensajeVacio}
                </td>
              </tr>
            ) : (
              tabla.getRowModel().rows.map((fila) => (
                <tr key={fila.id} className="border-t border-stone-100 hover:bg-stone-50">
                  {fila.getVisibleCells().map((celda) => (
                    <td key={celda.id} className="px-4 py-3 align-middle">
                      {flexRender(celda.column.columnDef.cell, celda.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {tabla.getPageCount() > 1 && (
        <div className="mt-4 flex items-center justify-end gap-3 text-sm">
          <Button variante="secundario" tamano="sm" onClick={() => tabla.previousPage()} disabled={!tabla.getCanPreviousPage()}>
            ←
          </Button>
          <span className="text-stone-600">
            Página {tabla.getState().pagination.pageIndex + 1} de {tabla.getPageCount()}
          </span>
          <Button variante="secundario" tamano="sm" onClick={() => tabla.nextPage()} disabled={!tabla.getCanNextPage()}>
            →
          </Button>
        </div>
      )}
    </div>
  )
}
