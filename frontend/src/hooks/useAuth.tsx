import { createContext, useContext, useState, ReactNode } from 'react'
import { User } from '@/types'
import api from '@/services/api'

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  updateUser: (name: string) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

const USE_REAL_API = import.meta.env.VITE_USE_REAL_API === 'true'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))

  const saveSession = (user: User, token: string) => {
    setUser(user)
    setToken(token)
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
  }

  const clearSession = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const login = async (email: string, password: string) => {
    if (USE_REAL_API) {
      const { data } = await api.post('/auth/login', { email, password })
      saveSession(data.user, data.token)
    } else {
      const fakeUser: User = {
        id: '1',
        name: email.split('@')[0],
        email,
        createdAt: new Date().toISOString(),
      }
      saveSession(fakeUser, 'fake-token-' + Date.now())
    }
  }

  const register = async (name: string, email: string, password: string) => {
    if (USE_REAL_API) {
      const { data } = await api.post('/auth/register', { name, email, password })
      saveSession(data.user, data.token)
    } else {
      const fakeUser: User = {
        id: '1',
        name,
        email,
        createdAt: new Date().toISOString(),
      }
      saveSession(fakeUser, 'fake-token-' + Date.now())
    }
  }

  const updateUser = (name: string) => {
    if (!user) return
    const updated = { ...user, name }
    setUser(updated)
    localStorage.setItem('user', JSON.stringify(updated))
  }

  const logout = () => clearSession()

  return (
    <AuthContext.Provider value={{ user, token, login, register, updateUser, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}