import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../../components/product/ProductCard'
import { Loader2 } from 'lucide-react'
import * as api from '../../api/products'

type Product = {
  id: string
  name: string
  price: number
  images: string[]
  is_new?: boolean
  colors?: string[]
  sizes?: Array<'XS' | 'S' | 'M' | 'L' | 'XL'>
  category?: string
}

const SORTERS: Record<string, (a: Product, b: Product) => number> = {
  newest: (a, b) => Number(b.is_new) - Number(a.is_new),
  priceAsc: (a, b) => a.price - b.price,
  priceDesc: (a, b) => b.price - a.price,
}

const ITEMS_PER_LOAD = 8

export default function ProductList() {
  const [params, setParams] = useSearchParams()
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.getProducts(1, 100)
        setProducts(data as any || [])
      } catch (error) {
        console.error('Error fetching products:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const selectedColor = params.get('color') || ''
  const selectedSize = params.get('size') || ''
  const selectedCategory = params.get('category') || ''
  const price = params.get('price') || ''
  const sort = params.get('sort') || 'newest'

  const filtered = useMemo(() => {
    return products
      .filter((p) => !selectedCategory || p.category?.toLowerCase().includes(selectedCategory.toLowerCase()))
      .filter((p) => !selectedColor || p.colors?.includes(selectedColor))
      .filter((p) => !selectedSize || p.sizes?.includes(selectedSize as any))
      .filter((p) => {
        if (!price) return true
        const val = p.price
        if (price === 'low') return val < 300
        if (price === 'mid') return val >= 300 && val <= 600
        if (price === 'high') return val > 600
        return true
      })
      .sort(SORTERS[sort] ?? SORTERS.newest)
  }, [products, selectedCategory, selectedColor, selectedSize, sort, price])

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_LOAD)
  }, [selectedCategory, selectedColor, selectedSize, price, sort])

  // Infinite Scroll Handler - scroll to bottom detection
  useEffect(() => {
    const handleScroll = () => {
      // Check if user scrolled to bottom (with 500px buffer)
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        if (visibleCount < filtered.length && !isLoadingMore) {
          setIsLoadingMore(true)
          // Simulate loading delay for better UX
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + ITEMS_PER_LOAD, filtered.length))
            setIsLoadingMore(false)
          }, 400)
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [visibleCount, filtered.length, isLoadingMore])

  const visibleProducts = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next)
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Produtos</h1>
          <p className="text-sm text-gray-600 mt-1.5">
            {loading ? 'Carregando...' : `${filtered.length} resultado${filtered.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Filters - Responsive */}
        <div className="flex flex-wrap gap-2 md:gap-3 text-sm">
          <select
            value={selectedColor}
            onChange={(e) => updateParam('color', e.target.value)}
            className="rounded-full border border-gray-300 px-3 py-2 bg-white text-xs md:text-sm hover:border-gray-400 transition appearance-none cursor-pointer"
          >
            <option value="">Cor</option>
            <option value="#000000">Preto</option>
            <option value="#F5F5DC">Bege</option>
            <option value="#c8a882">Caramelo</option>
          </select>

          <select
            value={selectedSize}
            onChange={(e) => updateParam('size', e.target.value)}
            className="rounded-full border border-gray-300 px-3 py-2 bg-white text-xs md:text-sm hover:border-gray-400 transition appearance-none cursor-pointer"
          >
            <option value="">Tamanho</option>
            {['XS', 'S', 'M', 'L', 'XL'].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => updateParam('category', e.target.value)}
            className="rounded-full border border-gray-300 px-3 py-2 bg-white text-xs md:text-sm hover:border-gray-400 transition appearance-none cursor-pointer"
          >
            <option value="">Categoria</option>
            <option value="vestidos">Vestidos</option>
            <option value="blusas">Blusas</option>
            <option value="calcas">Calças</option>
            <option value="saias">Saias</option>
          </select>

          <select
            value={price}
            onChange={(e) => updateParam('price', e.target.value)}
            className="rounded-full border border-gray-300 px-3 py-2 bg-white text-xs md:text-sm hover:border-gray-400 transition appearance-none cursor-pointer"
          >
            <option value="">Preço</option>
            <option value="low">Até R$300</option>
            <option value="mid">R$300 - R$600</option>
            <option value="high">Acima de R$600</option>
          </select>

          <select
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="rounded-full border border-gray-300 px-3 py-2 bg-white text-xs md:text-sm hover:border-gray-400 transition appearance-none cursor-pointer"
          >
            <option value="newest">Mais Novos</option>
            <option value="priceAsc">Preço: Menor</option>
            <option value="priceDesc">Preço: Maior</option>
          </select>
        </div>
      </div>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-gray-600 text-base">Nenhum produto encontrado com esses filtros.</p>
        </div>
      ) : (
        <>
          {/* Grid: 2 columns on mobile, 3 on small screens, 4 on large */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-6 sm:gap-4 md:gap-6">
            {visibleProducts.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                price={p.price}
                images={p.images}
                isNew={p.is_new}
              />
            ))}
          </div>

          {/* Loading State - Shown at bottom when fetching */}
          {isLoadingMore && (
            <div className="py-12 flex justify-center">
              <div className="flex items-center gap-2">
                <Loader2 size={18} className="animate-spin text-gray-600" />
                <span className="text-sm text-gray-600 font-medium">Carregando mais...</span>
              </div>
            </div>
          )}

          {/* End of Results Message */}
          {!hasMore && visibleProducts.length > 0 && (
            <div className="py-8 text-center">
              <p className="text-sm text-gray-500">Fim dos resultados</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
