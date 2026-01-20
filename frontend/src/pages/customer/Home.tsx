import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { heroSlides, products as mockProducts } from '../../lib/mockData'
import ProductCard from '../../components/product/ProductCard'
import ImageWithFallback from '../../components/ui/ImageWithFallback'
import * as api from '../../api/products'

export default function Home() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.getProducts(1, 8)
        // Garantir que é um array, caso contrário usa mock data
        if (Array.isArray(data)) {
          setProducts(data)
        } else {
          console.warn('API retornou dados inválidos, usando mock data')
          setProducts(mockProducts.slice(0, 8))
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        // Usar mock data como fallback
        setProducts(mockProducts.slice(0, 8))
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="space-y-16">
      {/* Hero: constrained on mobile for peeking content */}
      <section className="relative h-[50vh] md:h-[70vh] rounded-2xl overflow-hidden">
        <ImageWithFallback src={heroSlides[0].imageUrl} alt={heroSlides[0].title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <motion.div className="absolute bottom-8 left-4 md:bottom-16 md:left-16 text-white" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="text-[10px] md:text-xs tracking-widest">{heroSlides[0].tag}</div>
          <h1 className="text-3xl md:text-7xl font-bold tracking-tight">{heroSlides[0].title}</h1>
          <p className="mt-2 md:mt-3 text-white/80 text-sm md:text-lg">{heroSlides[0].subtitle}</p>
          <div className="mt-4 md:mt-6">
            <Link to={heroSlides[0].ctaHref} className="inline-block rounded-full bg-black text-white px-5 py-2.5 md:px-6 md:py-3 hover:bg-neutral-800 transition">{heroSlides[0].ctaLabel}</Link>
          </div>
        </motion.div>
      </section>

      {/* Featured products */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 tracking-tight">Destaques</h2>
        {loading ? (
          <div className="text-center py-12">Carregando produtos...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-6 sm:gap-4 md:gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} id={p.id} name={p.name} price={p.price} images={p.images} isNew={p.is_new} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
