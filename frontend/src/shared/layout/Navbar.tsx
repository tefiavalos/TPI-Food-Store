import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'

const claseEnlace = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm font-medium ${isActive ? 'bg-marca-700 text-white' : 'text-marca-50 hover:bg-marca-600'}`

export const Navbar = () => {
  const usuario = useAuthStore((s) => s.usuario)
  const logout = useAuthStore((s) => s.logout)
  const esAdmin = useAuthStore((s) => s.hasRole('admin'))
  const cantidad = useCartStore((s) => s.cantidadItems())
  const navigate = useNavigate()

  const cerrarSesion = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="bg-marca-500 shadow">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="text-xl font-bold text-white">
          Food Store
        </Link>

        <div className="flex flex-wrap items-center gap-1">
          <NavLink to="/" end className={claseEnlace}>
            Catálogo
          </NavLink>
          <NavLink to="/carrito" className={claseEnlace}>
            Carrito{cantidad > 0 && <span className="ml-1 rounded-full bg-white px-2 text-xs text-marca-700">{cantidad}</span>}
          </NavLink>
          {usuario && (
            <NavLink to="/mis-pedidos" className={claseEnlace}>
              Mis pedidos
            </NavLink>
          )}
          {esAdmin && (
            <NavLink to="/admin" className={claseEnlace}>
              Panel
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-3">
          {usuario ? (
            <>
              <span className="text-sm text-marca-50">
                {usuario.full_name} <span className="opacity-75">({usuario.role})</span>
              </span>
              <button
                type="button"
                onClick={() => void cerrarSesion()}
                className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-marca-700 hover:bg-marca-50"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={claseEnlace}>
                Ingresar
              </NavLink>
              <Link to="/register" className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-marca-700 hover:bg-marca-50">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
