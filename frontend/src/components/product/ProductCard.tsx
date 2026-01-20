import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useCartStore } from '../../store/cartStore'
import ImageWithFallback from '../ui/ImageWithFallback'
import { Heart, ShoppingBag, Zap } from 'lucide-react'

export type ProductCardProps = {
  id: string
  name: string
  price: number
  images: string[]
  isNew?: boolean
}

export default function ProductCard({ id, name, price, images, isNew }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const [isFavorited, setIsFavorited] = useState(false)
  const [imageIndex, setImageIndex] = useState(0)

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({ product: { id, name, price, images }, quantity: 1 })
  }

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({ product: { id, name, price, images }, quantity: 1 })
  }

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsFavorited(!isFavorited)
  }

  const handleImageHover = () => {
    if (images.length > 1) {
      setImageIndex((prev) => (prev + 1) % images.length)
    }
  }

  return (
    <motion.div className="group flex flex-col">
      <Link to={`/products/${id}`} className="block">
        {/* Image Container with consistent aspect ratio across breakpoints */}
        <div className="relative w-full aspect-[3/4] overflow-hidden rounded-md bg-gray-100">
          {isNew && (
            <span className="absolute left-3 top-3 z-20 bg-white/95 text-xs px-2.5 py-1 rounded-full font-semibold tracking-wide">
              Novo
            </span>
          )}

          {/* Favorite Button */}
          <button
            onClick={toggleFavorite}
            className="absolute right-3 top-3 z-20 bg-white/95 hover:bg-white p-2 rounded-full shadow-md transition"
          >
            <Heart
              size={16}
              className={`transition ${
                isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-700'
              }`}
            />
          </button>

          {/* Images Stack */}
          <div className="relative w-full h-full" onMouseEnter={handleImageHover}>
            {images.map((src, idx) => (
              <ImageWithFallback
                key={idx}
                src={src}
                alt={`${name} - ${idx + 1}`}
                className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${
                  idx === imageIndex ? 'opacity-100' : 'opacity-0'
                }`}
                imgClassName="w-full h-full object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            ))}
          </div>

          {/* Overlay Gradient - only on hover (desktop) */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition group-hover:opacity-100" />

          {/* Action Buttons - visible on hover (desktop only) */}
          <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 transition group-hover:opacity-100 hidden sm:flex">
            <button
              onClick={addToCart}
              className="flex-1 bg-white text-black shadow-lg font-medium hover:bg-gray-50 transition rounded py-2 flex items-center justify-center gap-2 text-xs sm:text-sm"
            >
              <ShoppingBag size={14} />
              <span className="hidden sm:inline">Carrinho</span>
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-black text-white shadow-lg font-medium hover:bg-gray-900 transition rounded py-2 flex items-center justify-center gap-2 text-xs sm:text-sm"
            >
              <Zap size={14} />
              <span className="hidden sm:inline">Comprar</span>
            </button>
          </div>
        </div>
      </Link>

      {/* Product Info - Clean Layout (Image -> Name -> Price) */}
      <div className="mt-3 space-y-2">
        <Link to={`/products/${id}`} className="group/link">
          <h3 className="text-[13px] sm:text-sm font-medium tracking-tight text-gray-900 group-hover/link:text-gray-600 transition line-clamp-2">
            {name}
          </h3>
        </Link>
        <div className="flex items-baseline gap-2">
          <span className="text-sm sm:text-base font-semibold text-gray-900">R$ {price.toFixed(2)}</span>
        </div>
      </div>
    </motion.div>
  )
}
