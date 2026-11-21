import { Link } from 'react-router-dom'
import { Card } from '@/shared/ui/Card'

export const UnauthorizedPage = () => (
  <Card className="mx-auto max-w-md text-center">
    <h1 className="text-2xl font-bold text-marca-800">Sin permiso</h1>
    <p className="mt-2 text-stone-500">No tenés permisos para ver esta sección.</p>
    <Link to="/" className="mt-6 inline-block font-medium text-marca-600 hover:underline">
      Volver al inicio
    </Link>
  </Card>
)
