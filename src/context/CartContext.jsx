import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'
import { useAddress } from './AddressContext'
import { authGet, authPost, fetchJson, PLACEHOLDER_IMAGE, postJson } from '../lib/api'
import {
  DEFAULT_DELIVERY,
  defaultOptionForAddress,
  deliveryChargeFor,
  mergeDeliveryConfig,
} from '../lib/delivery'

const CartContext = createContext(null)
const CART_STORAGE_KEY = 'tokri_cart_v1'

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

function readStoredCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .map((item) => {
        if (!item?.id || !item?.name) return null
        const quantity = Math.max(1, Number(item.quantity) || 1)
        const priceValue = Number(item.priceValue) || parsePrice(item.price)
        const oldPriceValue = Number(item.oldPriceValue) || parsePrice(item.oldPrice)
        return {
          id: String(item.id),
          name: String(item.name),
          price: item.price || `₹${priceValue}`,
          priceValue,
          oldPrice: item.oldPrice || (oldPriceValue > priceValue ? `₹${oldPriceValue}` : null),
          oldPriceValue: oldPriceValue > priceValue ? oldPriceValue : 0,
          image: item.image || PLACEHOLDER_IMAGE,
          weight: item.weight || '250 g',
          quantity,
          categorySlug: item.categorySlug || null,
          categories: Array.isArray(item.categories) ? item.categories : [],
          isTaxable: item.isTaxable !== undefined ? Boolean(item.isTaxable) : false,
          gstRate: Number(item.gstRate ?? 0),
          hsnCode: item.hsnCode || '0808',
        }
      })
      .filter(Boolean)
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const { user, isLoggedIn, refreshUser } = useAuth()
  const { selectedAddress } = useAddress()
  const [cartItems, setCartItems] = useState(readStoredCart)
  const [showDrawer, setShowDrawer] = useState(false)
  const [charges, setCharges] = useState(DEFAULT_CHARGES)
  const [deliveryConfig, setDeliveryConfig] = useState(DEFAULT_DELIVERY)
  const [deliveryOption, setDeliveryOption] = useState('morning')
  const [freeDelivery, setFreeDelivery] = useState(null)
  const [coupon, setCoupon] = useState(null)
  const [couponError, setCouponError] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)

  const refreshFreeDelivery = useCallback(async () => {
    if (isLoggedIn && user?.token) {
      try {
        const [bootstrapData, authData] = await Promise.all([
          authGet('/app/bootstrap', user).catch(() => null),
          refreshUser ? refreshUser() : null,
        ])
        if (bootstrapData?.freeDelivery) {
          setFreeDelivery(bootstrapData.freeDelivery)
        } else if (authData?.freeDelivery) {
          setFreeDelivery(authData.freeDelivery)
        }
      } catch (e) {
        console.error('refreshFreeDelivery failed:', e)
      }
    }
  }, [isLoggedIn, user, refreshUser])

  useEffect(() => {
    try {
      if (!cartItems.length) localStorage.removeItem(CART_STORAGE_KEY)
      else localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
    } catch {
      // Private mode / quota — cart still works for this session.
    }
  }, [cartItems])

  // Hydrate tax data for cart items if missing (e.g. from older localStorage)
  useEffect(() => {
    const missingTax = cartItems.some((item) => item.isTaxable === undefined || item.gstRate === undefined)
    if (missingTax && cartItems.length > 0) {
      let isMounted = true
      Promise.all(
        cartItems.map(async (item) => {
          if (item.isTaxable !== undefined && item.gstRate !== undefined) return item
          try {
            const p = await fetchJson(`/products/${item.id}`)
            if (p) {
              return {
                ...item,
                isTaxable: Boolean(p.isTaxable),
                gstRate: Number(p.gstRate ?? 0),
                hsnCode: p.hsnCode || item.hsnCode || '0808',
              }
            }
          } catch {
            // fallback
          }
          return item
        }),
      ).then((hydrated) => {
        if (isMounted) setCartItems(hydrated)
      })
      return () => {
        isMounted = false
      }
    }
  }, [cartItems])

  useEffect(() => {
    let ignore = false
    const loadBootstrap = async () => {
      try {
        const data = isLoggedIn && user?.token
          ? await authGet('/app/bootstrap', user)
          : await fetchJson('/app/bootstrap')
        if (ignore || !data?.charges) return
        setCharges({
          deliveryCharge: Number(data.charges.deliveryCharge ?? DEFAULT_CHARGES.deliveryCharge),
          handlingCharge: Number(data.charges.handlingCharge ?? DEFAULT_CHARGES.handlingCharge),
        })
        if (data.charges.delivery || data.settings?.charges?.delivery) {
          setDeliveryConfig(mergeDeliveryConfig(data.charges.delivery || data.settings.charges.delivery))
        }
        if (data.freeDelivery) {
          setFreeDelivery(data.freeDelivery)
        }
      } catch {
        if (isLoggedIn) {
          fetchJson('/app/bootstrap')
            .then((data) => {
              if (ignore || !data?.charges) return
              setCharges({
                deliveryCharge: Number(data.charges.deliveryCharge ?? DEFAULT_CHARGES.deliveryCharge),
                handlingCharge: Number(data.charges.handlingCharge ?? DEFAULT_CHARGES.handlingCharge),
              })
              if (data.freeDelivery) setFreeDelivery(data.freeDelivery)
            })
            .catch(() => {})
        }
      }
    }
    loadBootstrap()
    return () => {
      ignore = true
    }
  }, [user?.id, user?.token, isLoggedIn])

  useEffect(() => {
    setDeliveryOption(defaultOptionForAddress(selectedAddress))
  }, [selectedAddress?.id, selectedAddress?.delivery?.defaultOption])

  const addItem = (product) => {
    const priceValue = parsePrice(product.price ?? product.priceValue)
    const oldPriceValue = parsePrice(product.oldPriceValue ?? product.oldPrice)
    const oldPrice = product.oldPrice || (oldPriceValue > priceValue ? `₹${oldPriceValue}` : null)
    const isTaxable = Boolean(product.isTaxable)
    const gstRate = Number(product.gstRate ?? 0)
    const hsnCode = product.hsnCode || '0808'
    setCartItems((items) => {
      const existing = items.find((item) => item.id === product.id)
      if (existing) {
        return items.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                oldPriceValue: item.oldPriceValue || (oldPriceValue > priceValue ? oldPriceValue : 0),
                oldPrice: item.oldPrice || oldPrice,
                isTaxable,
                gstRate,
                hsnCode,
              }
            : item,
        )
      }

      return [
        ...items,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          priceValue,
          oldPrice,
          oldPriceValue: oldPriceValue > priceValue ? oldPriceValue : 0,
          image: product.image || PLACEHOLDER_IMAGE,
          weight: product.weight || '250 g',
          quantity: 1,
          categorySlug: categorySlugFrom(product),
          categories: Array.isArray(product.categories) ? product.categories : [],
          isTaxable,
          gstRate,
          hsnCode,
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
  const pinDelivery = selectedAddress?.delivery
    || (selectedAddress
      ? {
          serviceable: selectedAddress.serviceable !== false,
          morning: {
            enabled: selectedAddress.serviceable !== false,
            comingSoon: selectedAddress.serviceable === false,
          },
          express: { enabled: false, comingSoon: true },
          defaultOption: selectedAddress.serviceable !== false ? 'morning' : null,
        }
      : null)
  const activeOption =
    pinDelivery && !pinDelivery[deliveryOption]?.enabled
      ? defaultOptionForAddress(selectedAddress)
      : deliveryOption
  const activeFreeDelivery = freeDelivery || user?.freeDelivery
  const isFreeDeliveryEligible = Boolean(
    isLoggedIn &&
      activeFreeDelivery &&
      activeFreeDelivery.isEligible &&
      (activeFreeDelivery.remaining > 0 || activeFreeDelivery.used < 3),
  )
  const standardDelivery = hasItems ? deliveryChargeFor(activeOption, itemsTotal, deliveryConfig) : 0
  const deliveryCharge = isFreeDeliveryEligible ? 0 : standardDelivery
  const handlingCharge = hasItems ? charges.handlingCharge : 0
  const discount = coupon?.discount ? Number(coupon.discount) : 0
  const taxTotal = useMemo(() => {
    return Math.round(
      cartItems.reduce((sum, item) => {
        const isTax = Boolean(item.isTaxable)
        const rate = Number(item.gstRate || 0)
        if (isTax && rate > 0) {
          const lineTotal = Number(item.priceValue || 0) * Number(item.quantity || 1)
          return sum + Math.round(lineTotal * (rate / 100) * 100) / 100
        }
        return sum
      }, 0) * 100,
    ) / 100
  }, [cartItems])
  const grandTotal = Math.max(0, Math.round((itemsTotal + deliveryCharge + handlingCharge + taxTotal - discount) * 100) / 100)

  const previewPayload = useCallback(
    () => ({
      code: coupon?.code,
      items: cartItems.map((item) => ({ slug: item.id, quantity: item.quantity })),
      deliveryOption: activeOption,
    }),
    [activeOption, cartItems, coupon?.code],
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
          deliveryOption: activeOption,
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
    [activeOption, cartItems, isLoggedIn, user],
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
  }, [activeOption, cartItems, charges, coupon?.code, isLoggedIn, previewPayload, user])

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
        taxTotal,
        deliveryCharge,
        handlingCharge,
        discount,
        grandTotal,
        deliveryOption: activeOption,
        setDeliveryOption,
        deliveryConfig,
        setDeliveryConfig,
        pinDelivery,
        coupon,
        couponError,
        couponLoading,
        applyCoupon,
        removeCoupon,
        showDrawer,
        openDrawer,
        closeDrawer,
        freeDelivery: activeFreeDelivery,
        isFreeDeliveryEligible,
        refreshFreeDelivery,
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
