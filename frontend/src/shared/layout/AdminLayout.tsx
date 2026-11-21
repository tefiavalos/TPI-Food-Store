import { NavLink, Outlet } from 'react-router-dom'

const secciones = [
  { ruta: '/admin/resumen', nombre: 'Resumen' },
  { ruta: '/admin/categorias', nombre: 'Categorías' },
  { ruta: '/admin/productos', nombre: 'Productos' },
  { ruta: '/admin/pedidos', nombre: 'Pedidos' },
  { ruta: '/admin/usuarios', nombre: 'Usuarios' },
]

export const AdminLayout = () => {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-marca-800">Panel de administración</h1>
      <div className="mb-6 flex flex-wrap gap-2 border-b border-stone-200 pb-3">
        {secciones.map((s) => (
          <NavLink
            key={s.ruta}
            to={s.ruta}
            className={({ isActive }) =>
              `rounded-md px-3 py-1.5 text-sm font-medium ${isActive ? 'bg-marca-500 text-white' : 'text-marca-700 hover:bg-marca-100'}`
            }
          >
            {s.nombre}
          </NavLink>
        ))}
      </div>
      <Outlet />
    </div>
  )
}
