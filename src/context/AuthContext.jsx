import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { authPatch } from '../lib/api'

const STORAGE_KEY = 'tokri_user'

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function toUserData(nextUser, token) {
  return {
    id: nextUser.id,
    phone: String(nextUser.phone || ''),
    name: nextUser.name || null,
    dateOfBirth: nextUser.dateOfBirth || null,
    token: token || nextUser.token || null,
  }
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)

  const persist = useCallback((nextUser) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser))
    setUser(nextUser)
  }, [])

  const login = useCallback((nextUser) => {
    persist(toUserData(nextUser, nextUser.token || null))
  }, [persist])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }, [])

  const updateProfile = useCallback(
    async (patch) => {
      if (!user) return null
      const data = await authPatch('/account/profile', user, patch)
      const nextUser = toUserData({ ...user, ...(data.user || {}) }, user.token)
      persist(nextUser)
      return nextUser
    },
    [persist, user],
  )

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: Boolean(user?.phone),
      login,
      logout,
      updateProfile,
    }),
    [user, login, logout, updateProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
