import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
  product: { id: string; name: string; price: number; images?: string[] }
  quantity: number
  selectedSize?: 'XS' | 'S' | 'M' | 'L' | 'XL'
  selectedColor?: string
}

type CartState = {
  items: CartItem[]
  cartOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (id: string, size?: CartItem['selectedSize'], color?: string) => void
  updateQuantity: (id: string, size: CartItem['selectedSize'], color: string | undefined, qty: number) => void
  clear: () => void
  toggleCart: (open?: boolean) => void
  total: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      cartOpen: false,
      addItem: (item) => {
        const match = (i: CartItem) =>
          i.product.id === item.product.id && i.selectedSize === item.selectedSize && i.selectedColor === item.selectedColor
        const exists = get().items.find(match)
        if (exists) {
          set({ items: get().items.map((i) => (match(i) ? { ...i, quantity: i.quantity + item.quantity } : i)) })
        } else {
          set({ items: [...get().items, item] })
        }
      },
      removeItem: (id, size, color) => set({ items: get().items.filter((i) => !(i.product.id === id && i.selectedSize === size && i.selectedColor === color)) }),
      updateQuantity: (id, size, color, qty) => set({ items: get().items.map((i) => (i.product.id === id && i.selectedSize === size && i.selectedColor === color ? { ...i, quantity: qty } : i)) }),
      clear: () => set({ items: [] }),
      toggleCart: (open) => set({ cartOpen: open ?? !get().cartOpen }),
      total: () => get().items.reduce((acc, i) => acc + i.product.price * i.quantity, 0),
    }),
    { name: 'cart-store' }
  )
)
