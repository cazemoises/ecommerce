import { useCartStore } from '../store/cartStore'

export function useCart() {
  const items = useCartStore((s) => s.items)
  const add = useCartStore((s) => s.addItem)
  const remove = useCartStore((s) => s.removeItem)
  const updateQty = useCartStore((s) => s.updateQuantity)
  const clear = useCartStore((s) => s.clear)
  const toggleCart = useCartStore((s) => s.toggleCart)
  const count = items.reduce((acc, i) => acc + i.quantity, 0)
  const subtotal = items.reduce((acc, i) => acc + i.product.price * i.quantity, 0)
  return { items, add, remove, updateQty, clear, toggleCart, count, subtotal }
}
