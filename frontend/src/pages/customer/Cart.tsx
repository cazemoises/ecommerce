import { useCart } from '../../hooks/useCart'
import { Button } from '../../components/ui/button'
import { Link } from 'react-router-dom'
import ImageWithFallback from '../../components/ui/ImageWithFallback'
import { Trash2, ArrowLeft, Plus, Minus } from 'lucide-react'
import { motion } from 'framer-motion'

const FREE_SHIPPING = 400

export default function Cart() {
  const { items, subtotal, remove, updateQty, clear } = useCart()
  const total = subtotal
  const remaining = Math.max(0, FREE_SHIPPING - total)

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
      >
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">Sua Bolsa</h1>
          <p className="text-neutral-500">Adicione itens para começar</p>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="text-6xl mb-4">🛍️</div>
          <h2 className="text-2xl font-semibold mb-2 text-center">Carrinho vazio</h2>
          <p className="text-neutral-500 text-center mb-8 max-w-sm">
            Explore nossa coleção e encontre os itens perfeitos para você
          </p>
          <Link to="/products">
            <Button className="h-12 px-8 font-semibold">
              Continuar Comprando
            </Button>
          </Link>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">Sua Bolsa</h1>
        <p className="text-neutral-500">{items.length} item{items.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Main Grid */}
      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        {/* Items Container */}
        <div className="md:col-span-2 space-y-4">
          {items.map((i, idx) => (
            <motion.div
              key={`${i.product.id}-${i.selectedSize ?? ''}-${i.selectedColor ?? ''}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
              className="group flex gap-4 pb-4 border-b border-neutral-100 last:border-b-0"
            >
              {/* Product Image */}
              <div className="h-28 w-20 flex-shrink-0 rounded-md overflow-hidden bg-neutral-100">
                <ImageWithFallback
                  src={i.product.images?.[0] ?? ''}
                  alt={i.product.name}
                  className="h-full w-full"
                  imgClassName="object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <Link
                    to={`/products/${i.product.id}`}
                    className="text-sm font-medium text-neutral-900 hover:text-neutral-600 transition line-clamp-2"
                  >
                    {i.product.name}
                  </Link>
                  <p className="text-xs text-neutral-500 mt-1.5">
                    {i.selectedColor && <span>{i.selectedColor}</span>}
                    {i.selectedColor && i.selectedSize && <span> • </span>}
                    {i.selectedSize && <span>{i.selectedSize}</span>}
                  </p>
                </div>
                <p className="text-sm font-semibold text-neutral-900 mt-2">
                  R$ {(i.product.price * i.quantity).toFixed(2)}
                </p>
              </div>

              {/* Right Actions */}
              <div className="flex flex-col items-end justify-between">
                {/* Quantity Pill */}
                <div className="flex items-center gap-2 border border-neutral-200 rounded-full px-3 py-1.5 bg-white">
                  <button
                    onClick={() =>
                      updateQty(
                        i.product.id,
                        i.selectedSize as any,
                        i.selectedColor,
                        Math.max(1, i.quantity - 1)
                      )
                    }
                    className="text-neutral-600 hover:text-neutral-900 transition text-sm font-medium"
                    aria-label="Diminuir quantidade"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-xs font-medium text-neutral-900 w-5 text-center">
                    {i.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQty(
                        i.product.id,
                        i.selectedSize as any,
                        i.selectedColor,
                        i.quantity + 1
                      )
                    }
                    className="text-neutral-600 hover:text-neutral-900 transition text-sm font-medium"
                    aria-label="Aumentar quantidade"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => remove(i.product.id, i.selectedSize as any, i.selectedColor)}
                  className="p-2 text-neutral-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                  aria-label="Remover item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}

          {/* Clear Cart Link */}
          <button
            onClick={clear}
            className="text-xs text-neutral-500 hover:text-red-600 transition font-medium mt-6"
          >
            Limpar carrinho
          </button>
        </div>

        {/* Order Summary - Sticky Sidebar */}
        <div className="md:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="sticky top-6 bg-white border border-neutral-200 rounded-2xl p-6 space-y-6"
          >
            {/* Shipping Threshold */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-600">Frete grátis em R$ {FREE_SHIPPING.toFixed(0)}</span>
                <span className="font-semibold text-neutral-900">
                  {remaining === 0 ? '✓ Atingido' : `Faltam R$ ${remaining.toFixed(0)}`}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (total / FREE_SHIPPING) * 100)}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="h-full bg-neutral-900"
                />
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-2 py-4 border-y border-neutral-100">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Subtotal</span>
                <span className="font-medium">R$ {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Frete</span>
                <span className="font-medium">
                  {remaining === 0 ? 'Grátis' : 'Calculado no checkout'}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-neutral-600">Total</span>
                <span className="text-2xl font-bold text-neutral-900">
                  R$ {total.toFixed(2)}
                </span>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <Link to="/checkout" className="block">
                  <Button className="w-full h-12 text-base font-semibold">
                    Finalizar Compra
                  </Button>
                </Link>
                <Link to="/products" className="block">
                  <Button
                    variant="secondary"
                    className="w-full h-11 border border-neutral-200 hover:bg-neutral-50 font-medium"
                  >
                    Continuar Comprando
                  </Button>
                </Link>
              </div>
            </div>

            {/* Info */}
            <p className="text-xs text-neutral-500 text-center pt-2">
              Você receberá confirmação do pedido por email
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
