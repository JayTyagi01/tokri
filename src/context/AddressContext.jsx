import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'
import { authGet } from '../lib/api'
import { fetchAddressFromBrowser } from '../lib/geolocation'

const AddressContext = createContext(null)

function storageKey(phone) {
  return phone ? `tokri_selected_address_${phone}` : null
}

function detectedPlaceLabel(found) {
  const line = [found?.line2 || found?.line1, found?.city].filter(Boolean).join(', ')
  if (!line) return ''
  return line.length > 42 ? `${line.slice(0, 42)}…` : line
}

export function AddressProvider({ children }) {
  const { user, isLoggedIn } = useAuth()
  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [detectedLabel, setDetectedLabel] = useState('')
  const [locating, setLocating] = useState(false)

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
      const canDeliver = (item) => item && item.serviceable !== false
      const storedAddress = list.find((item) => item.id === storedId)
      const fallback = list.find(canDeliver)

      if (canDeliver(storedAddress)) {
        setSelectedAddressId(storedId)
      } else if (fallback) {
        setSelectedAddressId(fallback.id)
        if (key) localStorage.setItem(key, fallback.id)
      } else {
        setSelectedAddressId(null)
        if (key) localStorage.removeItem(key)
      }

      return list
    } catch (err) {
      console.warn('Failed to load addresses:', err)
      return []
    } finally {
      setLoading(false)
    }
  }, [isLoggedIn, user])

  useEffect(() => {
    refreshAddresses()
  }, [refreshAddresses])

  // Prompt the browser for location on first load (same idea as the app).
  useEffect(() => {
    let ignore = false
    if (typeof window === 'undefined' || !navigator.geolocation) return undefined

    setLocating(true)
    fetchAddressFromBrowser()
      .then((found) => {
        if (ignore) return
        const label = detectedPlaceLabel(found)
        if (label) setDetectedLabel(label)
      })
      .catch(() => {
        // Permission denied or unavailable — keep "Select address".
      })
      .finally(() => {
        if (!ignore) setLocating(false)
      })

    return () => {
      ignore = true
    }
  }, [])

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

  const openPicker = useCallback(() => {
    setPickerOpen(true)
    if (isLoggedIn) {
      refreshAddresses().catch(() => {})
    }
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
      detectedLabel,
      locating,
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
      detectedLabel,
      locating,
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
