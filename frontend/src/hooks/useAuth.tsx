import { createContext, useContext, useState, ReactNode } from 'react'
import { User } from '@/types'

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))

  const login = async (email: string, _password: string) => {
    const fakeUser: User = {
      id: '1',
      name: email.split('@')[0],
      email,
      createdAt: new Date().toISOString(),
    }
    const fakeToken = 'fake-token-' + Date.now()
    setUser(fakeUser)
    setToken(fakeToken)
    localStorage.setItem('token', fakeToken)
    localStorage.setItem('user', JSON.stringify(fakeUser))
  }

  const register = async (name: string, email: string, _password: string) => {
    const fakeUser: User = {
      id: '1',
      name,
      email,
      createdAt: new Date().toISOString(),
    }
    const fakeToken = 'fake-token-' + Date.now()
    setUser(fakeUser)
    setToken(fakeToken)
    localStorage.setItem('token', fakeToken)
    localStorage.setItem('user', JSON.stringify(fakeUser))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}