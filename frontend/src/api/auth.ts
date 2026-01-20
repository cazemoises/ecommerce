import { api, ApiResponse } from './client'

export type User = {
  id: string
  email: string
  name: string
  role: 'customer' | 'seller' | 'admin'
  avatar_url?: string
  created_at?: string
  updated_at?: string
}

export type LoginRequest = {
  email: string
  password: string
}

export type RegisterRequest = {
  name: string
  email: string
  password: string
}

export type AuthResponse = {
  user: User
  token: string
}

/**
 * Login user
 */
export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await api.post<any, ApiResponse<AuthResponse>>('/auth/login', data)
  
  // Save token to localStorage
  if (response.data.token) {
    localStorage.setItem('token', response.data.token)
  }
  
  return response.data
}

/**
 * Register new user
 */
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await api.post<any, ApiResponse<AuthResponse>>('/auth/register', data)
  
  // Save token to localStorage
  if (response.data.token) {
    localStorage.setItem('token', response.data.token)
  }
  
  return response.data
}

/**
 * Get current authenticated user
 */
export async function getMe(): Promise<User> {
  const response = await api.get<any, ApiResponse<User>>('/auth/me')
  return response.data
}

/**
 * Logout user (client-side only)
 */
export function logout(): void {
  localStorage.removeItem('token')
  localStorage.removeItem('auth-store')
}
