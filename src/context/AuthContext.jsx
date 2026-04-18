import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { apiRequest } from '../lib/api.js'
import { getToken, setToken } from '../lib/storage.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken())
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshMe = useCallback(async () => {
    if (!getToken()) {
      setUser(null)
      return null
    }
    const me = await apiRequest('/api/users/me')
    setUser(me)
    return me
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        if (getToken()) {
          await refreshMe()
        }
      } catch {
        setToken(null)
        setTokenState(null)
        setUser(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [refreshMe])

  const login = useCallback(async ({ email, password }) => {
    const data = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    })
    setToken(data?.accessToken)
    setTokenState(data?.accessToken || null)
    setUser(data?.user || null)
    return data
  }, [])

  const register = useCallback(async ({ email, firstName, lastName, password, otp }) => {
    const data = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: { email, firstName, lastName, password, otp },
    })
    setToken(data?.accessToken)
    setTokenState(data?.accessToken || null)
    setUser(data?.user || null)
    return data
  }, [])

  const sendOtp = useCallback(async (email) => {
    return await apiRequest('/api/auth/send-otp', {
      method: 'POST',
      body: { email },
    })
  }, [])

  const acceptOAuthToken = useCallback(async (newToken) => {
    setToken(newToken)
    setTokenState(newToken || null)
    await refreshMe()
  }, [refreshMe])

  const logout = useCallback(() => {
    setToken(null)
    setTokenState(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      login,
      register,
      logout,
      refreshMe,
      acceptOAuthToken,
      sendOtp,
    }),
    [token, user, loading, login, register, logout, refreshMe, acceptOAuthToken, sendOtp],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

