import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { authGet, authPatch } from '../lib/api'

const STORAGE_KEY = 'tokri_mobile_user'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [booting, setBooting] = useState(true)

  useEffect(() => {
    let ignore = false
    async function restore() {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY)
        if (!raw) return
        const stored = JSON.parse(raw)
        if (!stored?.token) return
        const me = await authGet('/auth/me', stored.token)
        if (!ignore) {
          setUser({ ...stored, ...me.user, token: stored.token })
        }
      } catch {
        await AsyncStorage.removeItem(STORAGE_KEY)
      } finally {
        if (!ignore) setBooting(false)
      }
    }
    restore()
    return () => {
      ignore = true
    }
  }, [])

  const login = useCallback(async (nextUser) => {
    const userData = {
      id: nextUser.id,
      phone: String(nextUser.phone),
      name: nextUser.name || null,
      dateOfBirth: nextUser.dateOfBirth || null,
      token: nextUser.token,
    }
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
    setUser(userData)
  }, [])

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }, [])

  const updateProfile = useCallback(
    async (patch) => {
      if (!user?.token) return null
      const name = String(patch?.name || '').trim()
      const dateOfBirth = patch?.dateOfBirth === undefined ? user.dateOfBirth : patch.dateOfBirth
      const data = await authPatch('/account/profile', user.token, {
        name,
        dateOfBirth: dateOfBirth || null,
      })
      const nextUser = {
        ...user,
        ...(data.user || {}),
        name: data.user?.name || name || null,
        dateOfBirth: data.user?.dateOfBirth || dateOfBirth || null,
        token: user.token,
      }
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser))
      setUser(nextUser)
      return nextUser
    },
    [user],
  )

  const value = useMemo(
    () => ({
      user,
      token: user?.token || null,
      isLoggedIn: Boolean(user?.token),
      booting,
      login,
      logout,
      updateProfile,
    }),
    [user, booting, login, logout, updateProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
