import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Loader2 } from 'lucide-react'

type ProtectedRouteProps = {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()

  // State 1: Loading state (if auth check is async)
  // For now, Zustand loads from localStorage synchronously, so this is instant
  // If you add async auth verification later, add loading state here
  
  // State 2: Unauthenticated - redirect to login with return path
  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  // State 3: Authenticated - render protected content
  return <>{children}</>
}
