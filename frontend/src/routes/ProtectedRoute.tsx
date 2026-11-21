import { Navigate, Outlet, useLocation } from 'react-router-dom'
import type { Rol } from '@/features/usuarios'
import { useAuthStore } from '@/store/authStore'

interface ProtectedRouteProps {
  allowedRoles?: Rol[]
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const usuario = useAuthStore((s) => s.usuario)
  const cargando = useAuthStore((s) => s.cargando)
  const hasRole = useAuthStore((s) => s.hasRole)
  const location = useLocation()

  if (cargando && !usuario) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-marca-200 border-t-marca-500" />
      </div>
    )
  }

  if (!usuario) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (allowedRoles && !hasRole(...allowedRoles)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}
