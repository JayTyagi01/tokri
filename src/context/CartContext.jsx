import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'
import { authPost, fetchJson, postJson } from '../lib/api'

const CartContext = createContext(null)

const DEFAULT_CHARGES = {
  deliveryCharge: 25,
  handlingCharge: 2,
}

const parsePrice = (price) => {
  const numeric = Number(String(price).replace(/[^0-9.]/g, ''))
  return Number.isNaN(numeric) ? 0 : numeric
}

function categorySlugFrom(product) {
  if (!product) return null
  if (Array.isArray(product.categories) && product.categories.length) {
    const first = product.categories[0]
    return typeof first === 'string' ? first : first.slug || first.id || null
  }
  if (typeof product.category === 'string') return product.category
  return product.category?.slug || product.category?.id || product.categoryId || product.categorySlug || null
}

export function CartProvider({ children }) {
  const { user, isLoggedIn } = useAuth()
  const [cartItems, setCartItems] = useState([])
  const [showDrawer, setShowDrawer] = useState(false)
  const [charges, setCharges] = useState(DEFAULT_CHARGES)
  const [coupon, setCoupon] = useState(null)
  const [couponError, setCouponError] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)

  useEffect(() => {
    let ignore = false
    fetchJson('/app/bootstrap')
      .then((data) => {
        if (ignore || !data?.charges) return
        setCharges({
          deliveryCharge: Number(data.charges.deliveryCharge ?? DEFAULT_CHARGES.deliveryCharge),
          handlingCharge: Number(data.charges.handlingCharge ?? DEFAULT_CHARGES.handlingCharge),
        })
      })
      .catch(() => {})
    return () => {
      ignore = true
    }
  }, [])

  const addItem = (product) => {
    const priceValue = parsePrice(product.price ?? product.priceValue)
    setCartItems((items) => {
      const existing = items.find((item) => item.id === product.id)
      if (existing) {
        return items.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }

      return [
        ...items,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          priceValue,
          image: product.image || 'https://via.placeholder.com/150',
          weight: product.weight || '250 g',
          quantity: 1,
          categorySlug: categorySlugFrom(product),
          categories: Array.isArray(product.categories) ? product.categories : [],
        },
      ]
    })
  }

  const updateQuantity = (productId, delta) => {
    setCartItems((items) =>
      items
        .map((item) =>
          item.id === productId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  const removeItem = (productId) => {
    setCartItems((items) => items.filter((item) => item.id !== productId))
  }

  const clearCart = () => {
    setCartItems([])
    setCoupon(null)
    setCouponError('')
  }

  const getItemQuantity = (productId) => {
    const found = cartItems.find((item) => item.id === productId)
    return found ? found.quantity : 0
  }

  const openDrawer = () => setShowDrawer(true)
  const closeDrawer = () => setShowDrawer(false)

  const totalCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  )

  const itemsTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.priceValue * item.quantity, 0),
    [cartItems],
  )

  const hasItems = cartItems.length > 0
  const deliveryCharge = hasItems ? charges.deliveryCharge : 0
  const handlingCharge = hasItems ? charges.handlingCharge : 0
  const discount = coupon?.discount ? Number(coupon.discount) : 0
  const grandTotal = Math.max(0, itemsTotal + deliveryCharge + handlingCharge - discount)

  const previewPayload = useCallback(
    () => ({
      code: coupon?.code,
      items: cartItems.map((item) => ({ slug: item.id, quantity: item.quantity })),
    }),
    [cartItems, coupon?.code],
  )

  const applyCoupon = useCallback(
    async (rawCode) => {
      const code = String(rawCode || '').trim().toUpperCase()
      if (!code) {
        setCouponError('Enter a coupon code')
        return null
      }
      if (!cartItems.length) {
        setCouponError('Add items to your cart first')
        return null
      }

      setCouponLoading(true)
      setCouponError('')
      try {
        const body = {
          code,
          items: cartItems.map((item) => ({ slug: item.id, quantity: item.quantity })),
        }
        const data = isLoggedIn
          ? await authPost('/checkout/preview-coupon', user, body)
          : await postJson('/checkout/preview-coupon', body)
        setCoupon(data.coupon)
        return data.coupon
      } catch (error) {
        setCoupon(null)
        setCouponError(error.message || 'This coupon could not be applied')
        throw error
      } finally {
        setCouponLoading(false)
      }
    },
    [cartItems, isLoggedIn, user],
  )

  const removeCoupon = useCallback(() => {
    setCoupon(null)
    setCouponError('')
  }, [])

  useEffect(() => {
    if (!coupon?.code) return undefined
    if (!cartItems.length) {
      setCoupon(null)
      return undefined
    }

    let ignore = false
    const body = previewPayload()
    const request = isLoggedIn
      ? authPost('/checkout/preview-coupon', user, body)
      : postJson('/checkout/preview-coupon', body)

    request
      .then((data) => {
        if (!ignore) setCoupon(data.coupon)
      })
      .catch((error) => {
        if (ignore) return
        setCoupon(null)
        setCouponError(error.message || 'Coupon is no longer valid for this cart')
      })

    return () => {
      ignore = true
    }
  }, [cartItems, charges, coupon?.code, isLoggedIn, previewPayload, user])

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        getItemQuantity,
        totalCount,
        itemsTotal,
        deliveryCharge,
        handlingCharge,
        discount,
        grandTotal,
        coupon,
        couponError,
        couponLoading,
        applyCoupon,
        removeCoupon,
        showDrawer,
        openDrawer,
        closeDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
