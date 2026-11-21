import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'

export const MainLayout = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
