import React, { useMemo, useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../../components/ui/button'
import { useCartStore } from '../../store/cartStore'
import { getById } from '../../api/products'
import SizeSelector from '../../components/product/SizeSelector'
import ColorSelector from '../../components/product/ColorSelector'
import ProductCard from '../../components/product/ProductCard'
import ImageWithFallback from '../../components/ui/ImageWithFallback'
import { ChevronDown } from 'lucide-react'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const addItem = useCartStore((s) => s.addItem)
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [related, setRelated] = useState<any[]>([])

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return
      try {
        setLoading(true)
        const data = await getById(id)
        setProduct(data)
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])
  const [selectedColor, setColor] = useState<string | undefined>(product?.colors[0])
  const [selectedSize, setSize] = useState<'XS' | 'S' | 'M' | 'L' | 'XL' | undefined>(product?.sizes[2])
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    description: true,
    materials: false,
    care: false,
    shipping: false,
  })

  // Get images for selected color, or fall back to default images
  const currentImages = useMemo(() => {
    if (!product || !selectedColor) return product?.images ?? []
    return product.colorImages?.[selectedColor] ?? product.images
  }, [product, selectedColor])

  // Reset image index when color changes
  const mobileScrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setActiveImageIndex(0)
  }, [selectedColor])

  useEffect(() => {
    const el = mobileScrollRef.current
    if (!el) return

    const onScroll = () => {
      const width = el.clientWidth
      if (!width) return
      const nextIndex = Math.round(el.scrollLeft / width)
      setActiveImageIndex((prev) => (prev !== nextIndex ? nextIndex : prev))
    }

    el.addEventListener('scroll', onScroll)
    return () => el.removeEventListener('scroll', onScroll)
  }, [currentImages])
  
  const addToCart = () => {
    if (!product) return
    addItem({
      product: {
        id: product.id,
        name: product.name,
        price: product.discountPrice ?? product.price,
        images: product.images,
      },
      quantity: 1,
      selectedColor,
      selectedSize,
    })
  }

  const buyNow = () => {
    if (!product) return
    addItem({
      product: {
        id: product.id,
        name: product.name,
        price: product.discountPrice ?? product.price,
        images: product.images,
      },
      quantity: 1,
      selectedColor,
      selectedSize,
    })
    navigate('/checkout')
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  if (loading)
    return <div className="text-center py-12 text-neutral-500">Carregando produto...</div>

  if (!product)
    return <div className="text-center py-12 text-neutral-500">Produto não encontrado.</div>

  const isOutOfStock = product.unavailableSizes && product.unavailableSizes.length === product.sizes.length

  return (
    <div className="space-y-10 md:space-y-16 pb-28 md:pb-10">
      {/* Product Gallery + Selectors */}
      <div className="grid md:grid-cols-2 gap-6 md:gap-12">
        {/* Interactive Gallery */}
        <div className="space-y-3 md:space-y-4">
          {/* Desktop: Main Image */}
          <div className="hidden md:block">
            <div className="relative w-full rounded-xl overflow-hidden bg-neutral-100 aspect-[3/4]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedColor}-${activeImageIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <ImageWithFallback
                    src={currentImages[activeImageIndex]}
                    alt={`${product.name}-${activeImageIndex}`}
                    className="w-full h-full"
                    imgClassName="object-cover w-full h-full"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Desktop: Thumbnails Row */}
          <div className="hidden md:flex gap-2 overflow-x-auto pb-1">
            {currentImages.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveImageIndex(i)}
                className={`min-w-[80px] h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                  i === activeImageIndex ? 'border-neutral-900 ring-2 ring-neutral-900' : 'border-neutral-200 hover:border-neutral-400'
                }`}
              >
                <ImageWithFallback
                  src={src}
                  alt={`${product.name}-thumb-${i}`}
                  className="w-full h-full"
                  imgClassName="object-cover w-full h-full"
                  sizes="80px"
                />
              </button>
            ))}
          </div>

          {/* Mobile: Scrollable gallery constrained to 50vh for clean layout */}
          <div className="md:hidden">
            <div
              ref={mobileScrollRef}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth gap-2 h-[50vh] md:h-auto w-full"
            >
              {currentImages.map((src, i) => (
                <div
                  key={i}
                  className="w-full flex-shrink-0 snap-center h-full md:h-auto"
                >
                  <div className="relative w-full h-full rounded-lg overflow-hidden bg-neutral-100">
                    <ImageWithFallback
                      src={src}
                      alt={`${product.name}-${i}`}
                      className="absolute inset-0 w-full h-full"
                      imgClassName="w-full h-full object-cover"
                      sizes="100vw"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile: Image Counter */}
            {currentImages.length > 1 && (
              <div className="mt-3 text-center text-xs text-neutral-500">
                {activeImageIndex + 1} / {currentImages.length}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-5 md:space-y-8 pt-4 md:pt-0">
          {/* Breadcrumb & Title */}
          <div className="space-y-1.5">
            <h1 className="text-xl font-medium leading-tight md:text-4xl md:font-serif md:tracking-tight">{product.name}</h1>
            <p className="text-xs uppercase tracking-[0.18em] text-neutral-500 md:text-sm md:tracking-wide">{product.category}</p>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 md:gap-4">
            <span className="text-lg font-semibold md:text-3xl">
              R$ {(product.discountPrice ?? product.price).toFixed(2)}
            </span>
            {product.discountPrice && (
              <span className="text-sm text-neutral-500 line-through md:text-lg">
                R$ {product.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Color Selector */}
          <div className="space-y-2 md:space-y-3">
            <label className="block text-xs font-medium text-neutral-900 md:text-sm">Cor</label>
            <ColorSelector
              colors={product.colors}
              value={selectedColor}
              onChange={setColor}
              unavailable={product.unavailableSizes ?? []}
            />
          </div>

          {/* Size Selector */}
          <div className="space-y-2 md:space-y-3">
            <label className="block text-xs font-medium text-neutral-900 md:text-sm">Tamanho</label>
            <SizeSelector
              sizes={product.sizes}
              value={selectedSize}
              onChange={setSize}
              unavailable={product.unavailableSizes ?? []}
            />
            <p className="text-xs text-neutral-500">
              {isOutOfStock
                ? 'Este item está temporariamente indisponível'
                : 'Selecione o tamanho desejado'}
            </p>
          </div>

          {/* Dual-Action Buttons - Desktop Only */}
          <div className="hidden md:grid md:grid-cols-2 md:gap-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="secondary"
                className="w-full h-12 text-base font-medium"
                onClick={addToCart}
                disabled={isOutOfStock}
              >
                Adicionar à Sacola
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                className="w-full h-12 text-base font-medium"
                onClick={buyNow}
                disabled={isOutOfStock}
              >
                Comprar Agora
              </Button>
            </motion.div>
          </div>

          {/* Quick Info */}
          <div className="space-y-2 text-sm text-neutral-600 border-y border-neutral-200 py-4 md:py-6">
            <div className="flex justify-between">
              <span>Frete</span>
              <span>Cálculo na próxima etapa</span>
            </div>
            <div className="flex justify-between">
              <span>Devolução</span>
              <span>Fácil em 30 dias</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Information Sections - Accordion */}
      <div className="space-y-0 border-t border-neutral-200">
        {/* Description */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="border-b border-neutral-200"
        >
          <button
            onClick={() => toggleSection('description')}
            className="w-full py-4 md:py-5 flex items-center justify-between hover:bg-neutral-50 transition group"
          >
            <h3 className="text-sm font-semibold text-neutral-900 md:text-base">Descrição</h3>
            <motion.div
              animate={{ rotate: expandedSections.description ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown size={18} className="text-neutral-500 group-hover:text-neutral-700" />
            </motion.div>
          </button>
          <AnimatePresence initial={false}>
            {expandedSections.description && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="pb-4 md:pb-5 text-xs md:text-sm leading-relaxed text-neutral-700">{product.description}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Materials */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          viewport={{ once: true }}
          className="border-b border-neutral-200"
        >
          <button
            onClick={() => toggleSection('materials')}
            className="w-full py-4 md:py-5 flex items-center justify-between hover:bg-neutral-50 transition group"
          >
            <h3 className="text-sm font-semibold text-neutral-900 md:text-base">Materiais</h3>
            <motion.div
              animate={{ rotate: expandedSections.materials ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown size={18} className="text-neutral-500 group-hover:text-neutral-700" />
            </motion.div>
          </button>
          <AnimatePresence initial={false}>
            {expandedSections.materials && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="pb-4 md:pb-5 text-xs md:text-sm leading-relaxed text-neutral-700">{product.materials}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Care Instructions */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="border-b border-neutral-200"
        >
          <button
            onClick={() => toggleSection('care')}
            className="w-full py-4 md:py-5 flex items-center justify-between hover:bg-neutral-50 transition group"
          >
            <h3 className="text-sm font-semibold text-neutral-900 md:text-base">Cuidados</h3>
            <motion.div
              animate={{ rotate: expandedSections.care ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown size={18} className="text-neutral-500 group-hover:text-neutral-700" />
            </motion.div>
          </button>
          <AnimatePresence initial={false}>
            {expandedSections.care && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="pb-4 md:pb-5 text-xs md:text-sm leading-relaxed text-neutral-700">{product.care}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Shipping & Returns */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          viewport={{ once: true }}
          className="border-b border-neutral-200"
        >
          <button
            onClick={() => toggleSection('shipping')}
            className="w-full py-4 md:py-5 flex items-center justify-between hover:bg-neutral-50 transition group"
          >
            <h3 className="text-sm font-semibold text-neutral-900 md:text-base">Envio & Devolução</h3>
            <motion.div
              animate={{ rotate: expandedSections.shipping ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown size={18} className="text-neutral-500 group-hover:text-neutral-700" />
            </motion.div>
          </button>
          <AnimatePresence initial={false}>
            {expandedSections.shipping && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pb-4 md:pb-5 space-y-2 text-xs md:text-sm leading-relaxed text-neutral-700">
                  <p>
                    Entregamos em todo Brasil com múltiplas opções de frete. Escolha a mais conveniente no
                    carrinho.
                  </p>
                  <p>
                    Devolução facilitada em 30 dias. Sem fazer perguntas, reembolsamos 100% do valor do
                    produto.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      </div>

      {/* Related Products */}
      <div className="space-y-6 md:space-y-8">
        <h2 className="text-2xl font-semibold text-neutral-900">Complete o look</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-6 sm:gap-4 md:gap-6">
          {related.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              name={p.name}
              price={p.price}
              images={p.images}
              isNew={p.isNew}
            />
          ))}
        </div>
      </div>

      {/* Mobile Fixed Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-neutral-200 px-4 py-3 shadow-lg">
        <div className="grid grid-cols-2 gap-3">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="secondary"
              className="w-full h-11 text-xs font-medium"
              onClick={addToCart}
              disabled={isOutOfStock}
            >
              Adicionar à Sacola
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              className="w-full h-11 text-xs font-medium"
              onClick={buyNow}
              disabled={isOutOfStock}
            >
              Comprar Agora
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
