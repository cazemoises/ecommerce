import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import * as authApi from '../api/auth'

export type User = {
  id: string
  email: string
  name: string
  role: 'customer' | 'seller' | 'admin'
  avatar_url?: string
  created_at?: string
}

type AuthState = {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  
  // Actions
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: async (email: string, password: string) => {
        const response = await authApi.login({ email, password })
        set({ 
          user: response.user, 
          token: response.token,
          isAuthenticated: true 
        })
      },
      
      register: async (name: string, email: string, password: string) => {
        const response = await authApi.register({ name, email, password })
        set({ 
          user: response.user, 
          token: response.token,
          isAuthenticated: true 
        })
      },
      
      logout: () => {
        authApi.logout()
        set({ 
          user: null, 
          token: null,
          isAuthenticated: false 
        })
      },
      
      setUser: (user: User) => {
        set({ user })
      },
      
      checkAuth: async () => {
        const token = get().token || localStorage.getItem('token')
        
        if (!token) {
          set({ user: null, token: null, isAuthenticated: false })
          return
        }
        
        try {
          const user = await authApi.getMe()
          set({ user, token, isAuthenticated: true })
        } catch (error) {
          console.error('Auth check failed:', error)
          authApi.logout()
          set({ user: null, token: null, isAuthenticated: false })
        }
      }
    }),
    { 
      name: 'auth-store',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token,
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
)
