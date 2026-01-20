import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { toast } from 'react-toastify'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

export const api = axios.create({ 
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false
})

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor: Handle errors globally
api.interceptors.response.use(
  (response) => {
    // Return data directly for cleaner usage
    return response.data
  },
  (error: AxiosError<any>) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('auth-store')
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/auth/login')) {
        toast.error('Sessão expirada. Faça login novamente.')
        window.location.href = '/auth/login'
      }
    }
    
    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      toast.error('Você não tem permissão para acessar este recurso.')
    }
    
    // Handle 500 Server Error
    if (error.response?.status && error.response.status >= 500) {
      toast.error('Erro no servidor. Tente novamente mais tarde.')
    }
    
    return Promise.reject(error)
  }
)

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