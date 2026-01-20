import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Navbar from './components/layout/Navbar'
import CartDrawer from './components/cart/CartDrawer'
import ScrollToTop from './components/layout/ScrollToTop'

export default function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900">
      <ScrollToTop />
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-neutral-200 py-8 text-sm text-neutral-600">
        <div className="max-w-6xl mx-auto px-4">© {new Date().getFullYear()} LUMINA</div>
      </footer>
      <CartDrawer />
    </div>
  )
}
