import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const NAVIGATION_ITEMS = [
  {
    title: 'Moda',
    links: [
      { label: 'Vestidos', href: '/products?category=vestidos' },
      { label: 'Blusas', href: '/products?category=blusas' },
      { label: 'Calças', href: '/products?category=calcas' },
      { label: 'Casacos', href: '/products?category=casacos' },
    ],
  },
  {
    title: 'Acessórios',
    links: [
      { label: 'Bolsas', href: '/products?category=bolsas' },
      { label: 'Sapatos', href: '/products?category=calcados' },
      { label: 'Joias', href: '/products?category=joias' },
      { label: 'Óculos', href: '/products?category=oculos' },
    ],
  },
  {
    title: 'Coleções',
    links: [
      { label: 'Verão 2026', href: '/products?collection=summer2026' },
      { label: 'Minimalista', href: '/products?collection=minimalist' },
      { label: 'Office Wear', href: '/products?collection=office' },
    ],
  },
]

const FEATURED_IMAGE = 'https://images.unsplash.com/photo-1539533057228-1be8db8592f0?w=600&h=400&fit=crop'

export default function MegaMenu({ isOpen, onClose }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={onClose}
          />

          {/* Menu Container */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 w-screen z-50 bg-white border-t border-gray-100 shadow-xl"
            onMouseLeave={onClose}
          >
            <div className="max-w-7xl mx-auto px-4 py-8">
              <div className="grid grid-cols-4 gap-8">
                {/* Column 1: Moda */}
                <div>
                  <h3 className="uppercase text-xs font-bold tracking-widest text-gray-900 mb-6">
                    {NAVIGATION_ITEMS[0].title}
                  </h3>
                  <nav className="space-y-3">
                    {NAVIGATION_ITEMS[0].links.map((link) => (
                      <Link
                        key={link.label}
                        to={link.href}
                        onClick={onClose}
                        className="block text-sm text-gray-500 hover:text-black transition duration-200"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                </div>

                {/* Column 2: Acessórios */}
                <div>
                  <h3 className="uppercase text-xs font-bold tracking-widest text-gray-900 mb-6">
                    {NAVIGATION_ITEMS[1].title}
                  </h3>
                  <nav className="space-y-3">
                    {NAVIGATION_ITEMS[1].links.map((link) => (
                      <Link
                        key={link.label}
                        to={link.href}
                        onClick={onClose}
                        className="block text-sm text-gray-500 hover:text-black transition duration-200"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                </div>

                {/* Column 3: Coleções */}
                <div>
                  <h3 className="uppercase text-xs font-bold tracking-widest text-gray-900 mb-6">
                    {NAVIGATION_ITEMS[2].title}
                  </h3>
                  <nav className="space-y-3">
                    {NAVIGATION_ITEMS[2].links.map((link) => (
                      <Link
                        key={link.label}
                        to={link.href}
                        onClick={onClose}
                        className="block text-sm text-gray-500 hover:text-black transition duration-200"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                </div>

                {/* Column 4: Featured Card */}
                <div className="relative h-64 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  <img
                    src={FEATURED_IMAGE}
                    alt="Featured Collection"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex flex-col items-end justify-end p-4">
                    <Link
                      to="/products/new"
                      onClick={onClose}
                      className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition duration-200"
                    >
                      Ver Novidades
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
