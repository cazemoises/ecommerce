import { useAuthStore } from '../store/authStore'

export function useAuth() {
  const user = useAuthStore((s) => s.user)
  const token = useAuthStore((s) => s.token)
  const login = useAuthStore((s) => s.login)
  const register = useAuthStore((s) => s.register)
  const logout = useAuthStore((s) => s.logout)
  const isAuthenticated = !!token
  const isSeller = user?.role === 'seller'
  return { user, token, login, register, logout, isAuthenticated, isSeller }
}
