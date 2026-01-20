import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import * as authApi from '../api/products'

export type User = {
  id: string
  email: string
  name?: string
  role?: 'customer' | 'seller' | 'admin'
  avatar_url?: string
  created_at?: string
}

type AuthState = {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: localStorage.getItem('token'),
      
      login: async (email: string, password: string) => {
        try {
          const response = await authApi.login(email, password)
          set({ user: response.user, token: response.token })
        } catch (error) {
          console.error('Login failed:', error)
          throw error
        }
      },
      
      register: async (name: string, email: string, password: string) => {
        try {
          const response = await authApi.register(name, email, password)
          set({ user: response.user, token: response.token })
        } catch (error) {
          console.error('Registration failed:', error)
          throw error
        }
      },
      
      logout: () => {
        localStorage.removeItem('token')
        set({ user: null, token: null })
      },
      
      setUser: (user: User) => {
        set({ user })
      },
      
      checkAuth: async () => {
        const token = localStorage.getItem('token')
        if (!token) return
        
        try {
          const user = await authApi.getCurrentUser()
          set({ user, token })
        } catch (error) {
          console.error('Auth check failed:', error)
          localStorage.removeItem('token')
          set({ user: null, token: null })
        }
      }
    }),
    { name: 'auth-store' }
  )
)
