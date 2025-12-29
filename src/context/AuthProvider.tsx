import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { useAuthStore } from '@/stores/auth-store'

interface AuthContextType {
  user: { accountNo: string; email: string; role: string[]; exp: number } | null
  login: (token: string, user: { accountNo: string; email: string; role: string[]; exp: number }) => void
  logout: () => void
  hasRole: (role: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { auth } = useAuthStore()

  const login = (token: string, user: { accountNo: string; email: string; role: string[]; exp: number }) => {
    auth.setAccessToken(token)
    auth.setUser(user)
  }

  const logout = () => {
    auth.reset()
  }

  const hasRole = (role: string): boolean => {
    return auth.user?.role?.includes(role) ?? false
  }

  return (
    <AuthContext.Provider
      value={{
        user: auth.user,
        login,
        logout,
        hasRole,
      }}
    >
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

