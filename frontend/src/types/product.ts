export type Product = {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  compare_at_price?: number | null
  stock_quantity?: number
}
