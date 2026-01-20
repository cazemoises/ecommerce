import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

export const api = axios.create({ baseURL })

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
