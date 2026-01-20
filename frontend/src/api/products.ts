import { api, ApiResponse } from './client'

export type Product = {
  id: string
  name: string
  description?: string
  price: number
  images: string[]
  category?: string
  sizes?: string[]
  colors?: string[]
  stock?: number
  is_new?: boolean
  created_at?: string
  updated_at?: string
}

/**
 * Get all products with pagination
 */
export async function getAll(page = 1, limit = 12): Promise<Product[]> {
  const response = await api.get<any, ApiResponse<Product[]>>('/products', {
    params: { page, limit }
  })
  
  return response.data
}

/**
 * Get single product by ID
 */
export async function getById(id: string): Promise<Product> {
  const response = await api.get<any, ApiResponse<Product>>(`/products/${id}`)
  return response.data
}

/**
 * Search products
 */
export async function search(query: string, page = 1, limit = 12): Promise<Product[]> {
  const response = await api.get<any, ApiResponse<Product[]>>('/products/search', {
    params: { q: query, page, limit }
  })
  
  return response.data
}

// ===== ORDERS API =====
export async function createOrder(items: Array<{ product_id: string; quantity: number; color?: string; size?: string }>) {
  const response = await api.post<any, ApiResponse<any>>('/orders', { items })
  return response.data
}

export async function getOrders(page = 1, limit = 10) {
  const response = await api.get<any, ApiResponse<any[]>>('/orders/my-orders', {
    params: { page, limit }
  })
  return response.data
}

export async function getOrder(id: string) {
  const response = await api.get<any, ApiResponse<any>>(`/orders/${id}`)
  return response.data
}

// Legacy functions for backward compatibility
export async function getProducts(page = 1, limit = 12) {
  return getAll(page, limit)
}

export async function getProduct(id: string) {
  return getById(id)
}

export async function getCurrentUser() {
  const response = await api.get<any, ApiResponse<any>>('/auth/me')
  return response.data
}
