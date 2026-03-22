'use client'

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import type { User, UserRole, AuthState, LoginCredentials, RegisterData } from '@/lib/types/auth'
import { mockLogin, mockRegister, mockLogout, validateToken, getRoleRedirectPath } from '@/lib/auth-mock'

const AUTH_STORAGE_KEY = 'learners_academy_auth'

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  checkAccess: (requiredRole: UserRole) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY)
        if (stored) {
          const { token, user } = JSON.parse(stored)
          const validatedUser = validateToken(token)
          
          if (validatedUser) {
            setState({
              user: validatedUser,
              isAuthenticated: true,
              isLoading: false,
            })
            return
          }
        }
      } catch (error) {
        console.error('Failed to restore auth state:', error)
      }
      
      setState(prev => ({ ...prev, isLoading: false }))
    }

    initializeAuth()
  }, [])

  // Handle route protection
  useEffect(() => {
    if (state.isLoading) return

    const isAuthPage = pathname.startsWith('/auth')
    const isProtectedRoute = pathname.startsWith('/admin') || 
                            pathname.startsWith('/teacher') || 
                            pathname.startsWith('/student')

    if (!state.isAuthenticated && isProtectedRoute) {
      router.push('/auth/login')
      return
    }

    if (state.isAuthenticated && isAuthPage) {
      router.push(getRoleRedirectPath(state.user!.role))
      return
    }

    // Check role-based access
    if (state.isAuthenticated && isProtectedRoute) {
      const pathRole = pathname.split('/')[1] as UserRole
      if (state.user?.role !== pathRole) {
        router.push(getRoleRedirectPath(state.user!.role))
      }
    }
  }, [state.isAuthenticated, state.isLoading, state.user, pathname, router])

  const login = useCallback(async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, isLoading: true }))
    
    try {
      const session = await mockLogin(credentials)
      
      // Store in localStorage
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
        token: session.token,
        user: session.user,
        expiresAt: session.expiresAt,
      }))

      setState({
        user: session.user,
        isAuthenticated: true,
        isLoading: false,
      })

      // Redirect to appropriate portal
      router.push(getRoleRedirectPath(session.user.role))
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }))
      throw error
    }
  }, [router])

  const register = useCallback(async (data: RegisterData) => {
    setState(prev => ({ ...prev, isLoading: true }))
    
    try {
      const session = await mockRegister(data)
      
      // Store in localStorage
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
        token: session.token,
        user: session.user,
        expiresAt: session.expiresAt,
      }))

      setState({
        user: session.user,
        isAuthenticated: true,
        isLoading: false,
      })

      // Redirect to appropriate portal
      router.push(getRoleRedirectPath(session.user.role))
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }))
      throw error
    }
  }, [router])

  const logout = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }))
    
    try {
      await mockLogout()
      localStorage.removeItem(AUTH_STORAGE_KEY)
      
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      })

      router.push('/auth/login')
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }))
      throw error
    }
  }, [router])

  const checkAccess = useCallback((requiredRole: UserRole): boolean => {
    return state.user?.role === requiredRole
  }, [state.user])

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      register,
      logout,
      checkAccess,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
