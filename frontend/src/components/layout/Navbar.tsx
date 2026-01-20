import { Link, useNavigate } from 'react-router-dom'
import { Menu, Search, User, ShoppingBag, X, ChevronDown, Heart, LogIn } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '../../store/cartStore'
import { useAuth } from '../../hooks/useAuth'
import MegaMenu from './MegaMenu'
import SearchModal from '../search/SearchModal'

export default function Navbar() {
  const count = useCartStore((s) => s.items.reduce((acc, i) => acc + i.quantity, 0))
  const toggleCart = useCartStore((s) => s.toggleCart)
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileSearchQuery, setMobileSearchQuery] = useState('')

  const handleLogout = () => {
    logout()
    setMobileOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
      {/* Row 1: Brand & Navigation (Mobile + Desktop) */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left: Mobile Menu Button */}
        <button
          className="w-10 h-10 flex items-center justify-center hover:bg-neutral-100 rounded-full md:hidden transition"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={20} className="text-neutral-900" />
        </button>

        {/* Center: Logo */}
        <Link to="/" className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold tracking-widest">
          LUMINA
        </Link>

        {/* Left (Desktop): Shop */}
        <div className="hidden md:block flex-1">
          <div
            className="relative w-fit"
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => setMegaOpen(false)}
          >
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-900 hover:text-neutral-600 transition font-medium">
              Shop
              <ChevronDown size={16} />
            </button>
            <MegaMenu isOpen={megaOpen} onClose={() => setMegaOpen(false)} />
          </div>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Desktop: Search + User Icons */}
          <button
            className="hidden md:flex w-10 h-10 items-center justify-center hover:bg-neutral-100 rounded-full transition"
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
          >
            <Search size={20} className="text-neutral-900" />
          </button>
          <Link
            to={isAuthenticated ? "/profile" : "/auth/login"}
            className="hidden md:flex w-10 h-10 items-center justify-center hover:bg-neutral-100 rounded-full transition"
            aria-label="Account"
          >
            <User size={20} className="text-neutral-900" />
          </Link>

          {/* Mobile + Desktop: Wishlist & Cart */}
          <Link
            to="/profile"
            className="w-10 h-10 flex items-center justify-center hover:bg-neutral-100 rounded-full transition"
            aria-label="Wishlist"
          >
            <Heart size={20} className="text-neutral-900" />
          </Link>
          <button
            className="relative w-10 h-10 flex items-center justify-center hover:bg-neutral-100 rounded-full transition"
            aria-label="Cart"
            onClick={() => toggleCart(true)}
          >
            <ShoppingBag size={20} className="text-neutral-900" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-neutral-900 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Row 2: Prominent Search Bar (Mobile/Tablet Only) */}
      <div className="md:hidden border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={mobileSearchQuery}
              onChange={(e) => setMobileSearchQuery(e.target.value)}
              onFocus={() => setSearchOpen(true)}
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-100 border border-transparent rounded-lg text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer - Flexbox Layout */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40 transition-opacity"
            onClick={() => setMobileOpen(false)}
          />

          {/* Menu Panel - Full Flexbox */}
          <div className="absolute top-0 left-0 h-full w-80 max-w-[90%] bg-white shadow-2xl flex flex-col z-50">
            {/* ===== HEADER (flex-none) ===== */}
            <div className="flex-none flex items-center justify-between px-6 py-5 border-b border-neutral-200 bg-white">
              <h1 className="text-lg font-medium tracking-tight">Menu</h1>
              <button
                className="p-2 hover:bg-neutral-100 rounded-full transition"
                onClick={() => setMobileOpen(false)}
                aria-label="Fechar menu"
              >
                <X size={20} className="text-neutral-700" />
              </button>
            </div>

            {/* ===== SCROLLABLE CONTENT (flex-1 overflow-y-auto) ===== */}
            <nav className="flex-1 overflow-y-auto px-6 py-6 space-y-8 pb-32 bg-white">
              {/* Auth Section - Guest Priority */}
              {!isAuthenticated && (
                <div>
                  <Link
                    to="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-lg bg-neutral-900 text-white px-4 py-3 hover:bg-neutral-800 transition font-medium text-sm"
                  >
                    <LogIn size={18} />
                    <span>Entrar / Cadastrar</span>
                  </Link>
                </div>
              )}

              {/* Shopping Categories - Large Typography */}
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-3">
                    Coleções
                  </p>
                  <div className="space-y-3">
                    <Link
                      to="/products"
                      onClick={() => setMobileOpen(false)}
                      className="block text-lg font-light text-neutral-900 hover:text-neutral-600 transition"
                    >
                      Tudo
                    </Link>
                    <Link
                      to="/products?category=vestidos"
                      onClick={() => setMobileOpen(false)}
                      className="block text-lg font-light text-neutral-900 hover:text-neutral-600 transition"
                    >
                      Vestidos
                    </Link>
                    <Link
                      to="/products?category=blusas"
                      onClick={() => setMobileOpen(false)}
                      className="block text-lg font-light text-neutral-900 hover:text-neutral-600 transition"
                    >
                      Blusas
                    </Link>
                    <Link
                      to="/products?category=calcas"
                      onClick={() => setMobileOpen(false)}
                      className="block text-lg font-light text-neutral-900 hover:text-neutral-600 transition"
                    >
                      Calças
                    </Link>
                    <Link
                      to="/products?category=bolsas"
                      onClick={() => setMobileOpen(false)}
                      className="block text-lg font-light text-neutral-900 hover:text-neutral-600 transition"
                    >
                      Bolsas
                    </Link>
                    <Link
                      to="/products?category=calcados"
                      onClick={() => setMobileOpen(false)}
                      className="block text-lg font-light text-neutral-900 hover:text-neutral-600 transition"
                    >
                      Sapatos
                    </Link>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-3">
                    Destaque
                  </p>
                  <div className="space-y-3">
                    <Link
                      to="/products"
                      onClick={() => setMobileOpen(false)}
                      className="block text-lg font-light text-neutral-900 hover:text-neutral-600 transition"
                    >
                      Novidades
                    </Link>
                    <Link
                      to="/products"
                      onClick={() => setMobileOpen(false)}
                      className="block text-lg font-light text-neutral-900 hover:text-neutral-600 transition"
                    >
                      Em Alta
                    </Link>
                  </div>
                </div>
              </div>
            </nav>

            {/* ===== STICKY FOOTER (flex-none) ===== */}
            <div className="flex-none border-t border-neutral-200 px-6 py-5 space-y-4 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-100 transition"
                  >
                    <User size={18} className="text-neutral-700" />
                    <span className="text-sm font-medium text-neutral-900">Minha Conta</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 transition"
                  >
                    <LogIn size={18} className="rotate-180 text-red-600" />
                    <span className="text-sm font-medium text-red-600">Sair</span>
                  </button>
                </div>
              ) : null}

              {/* Secondary Links */}
              <div className="space-y-2 pt-3 border-t border-neutral-100">
                <button className="block text-xs text-neutral-500 hover:text-neutral-700 transition w-full text-left">
                  Ajuda e Suporte
                </button>
                <button className="block text-xs text-neutral-500 hover:text-neutral-700 transition w-full text-left">
                  Devoluções
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  )
}
