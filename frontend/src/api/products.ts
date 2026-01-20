import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

export const api = axios.create({ 
  baseURL,
  withCredentials: true // Importante para CORS se o backend validar cookies no futuro
})

// === ADIÇÃO CRÍTICA: Interceptor de Request ===
// Isso garante que o Token vá em todas as requisições
api.interceptors.request.use((config) => {
  // O nome da chave deve ser o mesmo que você usa no useAuth ou login
  const token = localStorage.getItem('token') 
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  return config
}, (error) => {
  return Promise.reject(error)
})
// ==============================================

export type ApiResponse<T> = {
  success: boolean
  data: T
  message?: string
  error?: string
  code?: string
  pagination?: {
    page: number
    per_page: number
    total: number
    total_pages: number
  }
}

// ===== PRODUCTS API =====
export async function getProducts(page = 1, limit = 12) {
  try {
    const response = await api.get<ApiResponse<any[]>>('/products', {
      params: { page, limit }
    })
    return response.data.data
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}

export async function getProduct(id: string) {
  try {
    const response = await api.get<ApiResponse<any>>(`/products/${id}`)
    return response.data.data
  } catch (error) {
    console.error('Error fetching product:', error)
    throw error
  }
}

// ===== AUTH API =====
export async function login(email: string, password: string) {
  try {
    const response = await api.post<ApiResponse<any>>('/auth/login', {
      email,
      password
    })
    const { data } = response.data
    if (data.token) {
      localStorage.setItem('token', data.token)
    }
    return data
  } catch (error) {
    console.error('Error logging in:', error)
    throw error
  }
}

export async function register(name: string, email: string, password: string) {
  try {
    const response = await api.post<ApiResponse<any>>('/auth/register', {
      name,
      email,
      password
    })
    const { data } = response.data
    if (data.token) {
      localStorage.setItem('token', data.token)
    }
    return data
  } catch (error) {
    console.error('Error registering:', error)
    throw error
  }
}

export async function getCurrentUser() {
  try {
    const response = await api.get<ApiResponse<any>>('/auth/me')
    return response.data.data
  } catch (error) {
    console.error('Error fetching current user:', error)
    throw error
  }
}

// ===== ORDERS API =====
export async function createOrder(items: Array<{ product_id: string; quantity: number; color?: string; size?: string }>) {
  try {
    const response = await api.post<ApiResponse<any>>('/orders', {
      items
    })
    return response.data.data
  } catch (error) {
    console.error('Error creating order:', error)
    throw error
  }
}

export async function getOrders(page = 1, limit = 10) {
  try {
    const response = await api.get<ApiResponse<any[]>>('/orders/my-orders', {
      params: { page, limit }
    })
    return response.data.data
  } catch (error) {
    console.error('Error fetching orders:', error)
    throw error
  }
}

export async function getOrder(id: string) {
  try {
    const response = await api.get<ApiResponse<any>>(`/orders/${id}`)
    return response.data.data
  } catch (error) {
    console.error('Error fetching order:', error)
    throw error
  }
}