import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { StyleSheet } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { THEMES } from '../config'

const STORAGE_KEY = 'tokri_appearance'
const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [mode, setModeState] = useState('dark')

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (value === 'light' || value === 'dark') setModeState(value)
      })
      .catch(() => {})
  }, [])

  const setMode = useCallback((next) => {
    const value = next === 'light' ? 'light' : 'dark'
    setModeState(value)
    AsyncStorage.setItem(STORAGE_KEY, value).catch(() => {})
  }, [])

  const colors = THEMES[mode] || THEMES.dark
  const value = useMemo(
    () => ({
      mode,
      colors,
      setMode,
      isDark: mode === 'dark',
    }),
    [mode, colors, setMode],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    return {
      mode: 'dark',
      colors: THEMES.dark,
      setMode: () => {},
      isDark: true,
    }
  }
  return context
}

export function useThemedStyles(factory) {
  const { colors, mode } = useTheme()
  return useMemo(() => StyleSheet.create(factory(colors)), [colors, mode, factory])
}
