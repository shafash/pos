import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [token, setToken]     = useState(localStorage.getItem('pos_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      authService.me()
        .then((res) => setUser(res.data.data))
        .catch(() => {
          localStorage.removeItem('pos_token')
          localStorage.removeItem('pos_user')
          setToken(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const res  = await authService.login(email, password)
    const data = res.data.data

    localStorage.setItem('pos_token', data.token)
    localStorage.setItem('pos_user', JSON.stringify(data.user))

    setToken(data.token)
    setUser(data.user)

    return data
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (_) {
    } finally {
      localStorage.removeItem('pos_token')
      localStorage.removeItem('pos_user')
      setToken(null)
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth harus dipakai di dalam AuthProvider')
  return ctx
}