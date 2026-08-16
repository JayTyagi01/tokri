import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { authDelete, authGet, authPatch, authPost, fetchJson, formatPrice, normalizeProduct } from '../lib/api'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)
const STORAGE_KEY = 'tokri_mobile_cart'

const DELIVERY_CHARGE = 25
const HANDLING_CHARGE = 2
const SMALL_CART_CHARGE = 20

function withTotals(items) {
  const safeItems = Array.isArray(items) ? items : []
  const itemsTotal = safeItems.reduce((sum, item) => sum + Number(item.priceValue) * Number(item.quantity), 0)
  const hasItems = safeItems.length > 0
  const deliveryCharge = hasItems ? DELIVERY_CHARGE : 0
  const handlingCharge = hasItems ? HANDLING_CHARGE : 0
  const smallCartCharge = hasItems ? SMALL_CART_CHARGE : 0

  return {
    items: safeItems,
    itemsTotal,
    deliveryCharge,
    handlingCharge,
    smallCartCharge,
    grandTotal: itemsTotal + deliveryCharge + handlingCharge + smallCartCharge,
    totalCount: safeItems.reduce((sum, item) => sum + Number(item.quantity), 0),
  }
}

function toLineItem(product, quantity) {
  const normalized = normalizeProduct(product)
  return {
    id: normalized.slug,
    slug: normalized.slug,
    name: normalized.name,
    price: normalized.price || formatPrice(normalized.priceValue),
    priceValue: Number(normalized.priceValue) || 0,
    image: normalized.image,
    weight: normalized.weight,
    quantity,
  }
}

export function CartProvider({ children }) {
  const { token, isLoggedIn } = useAuth()
  const [cart, setCart] = useState(withTotals([]))
  const [loading, setLoading] = useState(false)

  const persist = useCallback(async (nextCart) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextCart))
  }, [])

  const applyLocal = useCallback(
    async (updater) => {
      let next
      setCart((current) => {
        next = withTotals(updater(current.items || []))
        return next
      })
      if (next) await persist(next)
      return next
    },
    [persist],
  )

  useEffect(() => {
    let ignore = false
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!raw || ignore) return
        const stored = JSON.parse(raw)
        if (Array.isArray(stored?.items)) setCart(withTotals(stored.items))
      })
      .catch(() => {})
    return () => {
      ignore = true
    }
  }, [])

  const refreshCart = useCallback(async () => {
    if (!isLoggedIn || !token) return null
    setLoading(true)
    try {
      const data = await authGet('/account/cart', token)
      if (data.cart) {
        const next = withTotals(data.cart.items || [])
        setCart(next)
        await persist(next)
        return next
      }
    } catch {
      // Keep the local cart if the live cart API is down.
    } finally {
      setLoading(false)
    }
    return null
  }, [isLoggedIn, token, persist])

  const addItem = useCallback(
    async (slug, quantity = 1, product) => {
      if (!isLoggedIn) throw new Error('Please log in to add items to cart.')

      if (token) {
        try {
          const data = await authPost('/account/cart/items', token, { slug, quantity })
          const next = withTotals(data.cart?.items || [])
          setCart(next)
          await persist(next)
          return next
        } catch {
          // Fall back to a local cart so shopping still works.
        }
      }

      let details = product
      if (!details?.slug) {
        details = await fetchJson(`/products/${encodeURIComponent(slug)}`)
      }

      return applyLocal((items) => {
        const existing = items.find((item) => item.slug === slug)
        if (existing) {
          return items.map((item) =>
            item.slug === slug ? { ...item, quantity: Math.min(99, item.quantity + quantity) } : item,
          )
        }
        return [...items, toLineItem(details, quantity)]
      })
    },
    [isLoggedIn, token, persist, applyLocal],
  )

  const updateQuantity = useCallback(
    async (slug, quantity) => {
      if (!isLoggedIn) throw new Error('Please log in to update cart.')

      if (token) {
        try {
          const data = await authPatch(`/account/cart/items/${slug}`, token, { quantity })
          const next = withTotals(data.cart?.items || [])
          setCart(next)
          await persist(next)
          return next
        } catch {
          // Fall back locally.
        }
      }

      return applyLocal((items) => {
        if (quantity <= 0) return items.filter((item) => item.slug !== slug)
        return items.map((item) => (item.slug === slug ? { ...item, quantity } : item))
      })
    },
    [isLoggedIn, token, persist, applyLocal],
  )

  const removeItem = useCallback(
    async (slug) => {
      if (!isLoggedIn) throw new Error('Please log in to update cart.')

      if (token) {
        try {
          const data = await authDelete(`/account/cart/items/${slug}`, token)
          const next = withTotals(data.cart?.items || [])
          setCart(next)
          await persist(next)
          return next
        } catch {
          // Fall back locally.
        }
      }

      return applyLocal((items) => items.filter((item) => item.slug !== slug))
    },
    [isLoggedIn, token, persist, applyLocal],
  )

  const clearCart = useCallback(async () => {
    if (token) {
      try {
        await authDelete('/account/cart', token)
      } catch {
        // Ignore live-cart failures; still clear locally.
      }
    }
    const empty = withTotals([])
    setCart(empty)
    await persist(empty)
    return empty
  }, [token, persist])

  const value = useMemo(
    () => ({
      cart,
      items: cart.items,
      totalCount: cart.totalCount,
      grandTotal: cart.grandTotal,
      itemsTotal: cart.itemsTotal,
      deliveryCharge: cart.deliveryCharge,
      handlingCharge: cart.handlingCharge,
      smallCartCharge: cart.smallCartCharge,
      loading,
      refreshCart,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      setCart,
    }),
    [cart, loading, refreshCart, addItem, updateQuantity, removeItem, clearCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
