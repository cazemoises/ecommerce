import { useCartStore } from '../../store/cartStore'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'
import ImageWithFallback from '../ui/ImageWithFallback'
import { Trash2, X } from 'lucide-react'

export default function CartDrawer() {
  const { items, toggleCart, cartOpen, total, updateQuantity, removeItem } = useCartStore()
  const FREE_SHIPPING = 400
  const subtotal = total()
  const remaining = Math.max(0, FREE_SHIPPING - subtotal)

  return (
    <div className={`fixed inset-0 z-50 ${cartOpen ? '' : 'pointer-events-none'}`}>
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${
          cartOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={() => toggleCart(false)}
      />

      {/* Drawer Panel - Full Flexbox Layout */}
      <div
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ${
          cartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* ===== HEADER (flex-none) ===== */}
        <div className="flex-none flex items-center justify-between px-6 py-5 border-b border-neutral-200 bg-white">
          <h2 className="text-lg font-medium tracking-tight">Sua Bolsa</h2>
          <button
            onClick={() => toggleCart(false)}
            className="p-2 hover:bg-neutral-100 rounded-full transition"
            aria-label="Fechar carrinho"
          >
            <X size={20} className="text-neutral-700" />
          </button>
        </div>

        {/* ===== SCROLLABLE ITEMS AREA (flex-1 overflow-y-auto) ===== */}
        <div className="flex-1 overflow-y-auto px-6 py-4 pb-40 bg-white">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="text-neutral-500 text-sm mb-4">Sua bolsa está vazia</div>
              <Link
                to="/products"
                onClick={() => toggleCart(false)}
                className="text-sm font-medium text-neutral-900 underline hover:no-underline"
              >
                Continuar comprando
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((i) => (
                <div
                  key={`${i.product.id}-${i.selectedSize}-${i.selectedColor}`}
                  className="flex gap-4 pb-4 border-b border-neutral-100 last:border-b-0 group bg-white"
                >
                  {/* Product Image */}
                  <div className="h-24 w-20 flex-shrink-0 rounded-md overflow-hidden bg-neutral-100">
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
                      <h3 className="text-sm font-medium text-neutral-900 line-clamp-2">
                        {i.product.name}
                      </h3>
                      <p className="text-xs text-neutral-500 mt-1">
                        {i.selectedColor && <span>{i.selectedColor}</span>}
                        {i.selectedColor && i.selectedSize && <span> • </span>}
                        {i.selectedSize && <span>{i.selectedSize}</span>}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-neutral-900 mt-2">
                      R$ {(i.product.price * i.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Right Column: Quantity + Remove */}
                  <div className="flex flex-col items-end justify-between">
                    {/* Quantity Pill */}
                    <div className="flex items-center gap-2 border border-neutral-200 rounded-full px-3 py-1.5 bg-white">
                      <button
                        onClick={() =>
                          updateQuantity(
                            i.product.id,
                            i.selectedSize!,
                            i.selectedColor,
                            Math.max(1, i.quantity - 1)
                          )
                        }
                        className="text-neutral-600 hover:text-neutral-900 transition text-sm font-medium"
                        aria-label="Diminuir quantidade"
                      >
                        −
                      </button>
                      <span className="text-xs font-medium text-neutral-900 w-4 text-center">
                        {i.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            i.product.id,
                            i.selectedSize!,
                            i.selectedColor,
                            i.quantity + 1
                          )
                        }
                        className="text-neutral-600 hover:text-neutral-900 transition text-sm font-medium"
                        aria-label="Aumentar quantidade"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() =>
                        removeItem(i.product.id, i.selectedSize, i.selectedColor)
                      }
                      className="p-2 text-neutral-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                      aria-label="Remover item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ===== STICKY FOOTER (flex-none, sticky at bottom) ===== */}
        {items.length > 0 && (
          <div className="flex-none border-t border-neutral-200 bg-white px-6 py-5 space-y-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            {/* Shipping Threshold */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-600">
                  Frete grátis em R$ {FREE_SHIPPING.toFixed(0)}
                </span>
                <span className="font-semibold text-neutral-900">
                  {remaining === 0 ? '✓ Atingido' : `Faltam R$ ${remaining.toFixed(0)}`}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                <div
                  className="h-full bg-neutral-900 transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (subtotal / FREE_SHIPPING) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-2 py-3 border-y border-neutral-100">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Subtotal</span>
                <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Frete</span>
                <span className="font-medium">Calculado no checkout</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-2">
              <Link to="/checkout" onClick={() => toggleCart(false)} className="block">
                <Button className="w-full h-12 text-base font-semibold">
                  Finalizar Compra
                </Button>
              </Link>
              <Link to="/products" onClick={() => toggleCart(false)} className="block">
                <button className="w-full h-11 border border-neutral-200 rounded-lg bg-white text-neutral-900 font-medium hover:bg-neutral-50 transition">
                  Continuar Comprando
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
