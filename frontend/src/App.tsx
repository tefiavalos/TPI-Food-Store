import { useEffect } from 'react'
import { AppRouter } from '@/routes/AppRouter'
import { useAuthStore } from '@/store/authStore'

export const App = () => {
  const checkSession = useAuthStore((s) => s.checkSession)

  useEffect(() => {
    void checkSession()
  }, [checkSession])

  return <AppRouter />
}
