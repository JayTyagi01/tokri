import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'
import { authGet } from '../lib/api'

const AddressContext = createContext(null)

function storageKey(phone) {
  return phone ? `tokri_selected_address_${phone}` : null
}

export function AddressProvider({ children }) {
  const { user, isLoggedIn } = useAuth()
  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const refreshAddresses = useCallback(async () => {
    if (!isLoggedIn || !user?.phone) {
      setAddresses([])
      setSelectedAddressId(null)
      return []
    }

    setLoading(true)
    try {
      const data = await authGet('/account/addresses', user)
      const list = data.addresses || []
      setAddresses(list)

      const key = storageKey(user.phone)
      const storedId = key ? localStorage.getItem(key) : null
      const validStored = storedId && list.some((item) => item.id === storedId)

      if (validStored) {
        setSelectedAddressId(storedId)
      } else if (list.length === 1) {
        setSelectedAddressId(list[0].id)
        if (key) localStorage.setItem(key, list[0].id)
      } else {
        setSelectedAddressId(null)
        if (key) localStorage.removeItem(key)
      }

      return list
    } finally {
      setLoading(false)
    }
  }, [isLoggedIn, user])

  useEffect(() => {
    refreshAddresses()
  }, [refreshAddresses])

  const selectedAddress = useMemo(
    () => addresses.find((item) => item.id === selectedAddressId) || null,
    [addresses, selectedAddressId],
  )

  const hasDeliveryAddress = Boolean(isLoggedIn && selectedAddress)

  const selectAddress = useCallback(
    (addressId) => {
      setSelectedAddressId(addressId)
      const key = storageKey(user?.phone)
      if (key) localStorage.setItem(key, addressId)
      setPickerOpen(false)
    },
    [user?.phone],
  )

  const openPicker = useCallback(async () => {
    if (isLoggedIn) {
      await refreshAddresses()
    }
    setPickerOpen(true)
  }, [isLoggedIn, refreshAddresses])

  const closePicker = useCallback(() => {
    setPickerOpen(false)
  }, [])

  const value = useMemo(
    () => ({
      addresses,
      selectedAddress,
      selectedAddressId,
      hasDeliveryAddress,
      loading,
      pickerOpen,
      refreshAddresses,
      selectAddress,
      openPicker,
      closePicker,
    }),
    [
      addresses,
      selectedAddress,
      selectedAddressId,
      hasDeliveryAddress,
      loading,
      pickerOpen,
      refreshAddresses,
      selectAddress,
      openPicker,
      closePicker,
    ],
  )

  return <AddressContext.Provider value={value}>{children}</AddressContext.Provider>
}

export function useAddress() {
  const context = useContext(AddressContext)
  if (!context) {
    throw new Error('useAddress must be used within AddressProvider')
  }
  return context
}
