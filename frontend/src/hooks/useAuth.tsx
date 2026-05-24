import { createContext, useContext, useState, ReactNode } from 'react'
import { User } from '@/types'
import api from '@/services/api'

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)
// trocar USE_REAL_API para true quando o
// backend estiver pronto e rodando.
const USE_REAL_API = false

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))

  const saveSession = (user: User, token: string) => {
    setUser(user)
    setToken(token)
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
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