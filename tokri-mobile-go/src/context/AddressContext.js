import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { authGet } from '../lib/api'
import { useAuth } from './AuthContext'

const AddressContext = createContext(null)

export function AddressProvider({ children }) {
  const { token, isLoggedIn, user } = useAuth()
  const [addresses, setAddresses] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [pickerOpen, setPickerOpen] = useState(false)

  const refresh = useCallback(async () => {
    if (!isLoggedIn || !token) {
      setAddresses([])
      setSelectedId(null)
      return []
    }
    const data = await authGet('/account/addresses', token)
    const list = data.addresses || []
    setAddresses(list)
    const key = user?.phone ? `tokri_address_${user.phone}` : null
    const stored = key ? await AsyncStorage.getItem(key) : null
    const valid = stored && list.some((item) => item.id === stored)
    const nextId = valid ? stored : list[0]?.id || null
    setSelectedId(nextId)
    return list
  }, [isLoggedIn, token, user?.phone])

  useEffect(() => {
    refresh().catch(() => {})
  }, [refresh])

  const selectAddress = useCallback(
    async (id) => {
      setSelectedId(id)
      if (user?.phone) await AsyncStorage.setItem(`tokri_address_${user.phone}`, id)
      setPickerOpen(false)
    },
    [user?.phone],
  )

  const selectedAddress = useMemo(
    () => addresses.find((item) => item.id === selectedId) || null,
    [addresses, selectedId],
  )

  const value = useMemo(
    () => ({
      addresses,
      selectedAddress,
      selectedId,
      pickerOpen,
      openPicker: () => setPickerOpen(true),
      closePicker: () => setPickerOpen(false),
      selectAddress,
      refresh,
    }),
    [addresses, selectedAddress, selectedId, pickerOpen, selectAddress, refresh],
  )

  return <AddressContext.Provider value={value}>{children}</AddressContext.Provider>
}

export function useAddress() {
  const context = useContext(AddressContext)
  if (!context) throw new Error('useAddress must be used within AddressProvider')
  return context
}
