import { createContext, useContext, useMemo, useState } from 'react'

const CartContext = createContext(null)

const parsePrice = (price) => {
  const numeric = Number(String(price).replace(/[^0-9.]/g, ''))
  return Number.isNaN(numeric) ? 0 : numeric
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [showDrawer, setShowDrawer] = useState(false)

  const addItem = (product) => {
    const priceValue = parsePrice(product.price)
    setCartItems((items) => {
      const existing = items.find((item) => item.id === product.id)
      if (existing) {
        return items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
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
          image: product.image || 'https://via.placeholder.com/150',
          weight: product.weight || '250 g',
          quantity: 1,
        },
      ]
    })
  }

  const updateQuantity = (productId, delta) => {
    setCartItems((items) =>
      items
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  const removeItem = (productId) => {
    setCartItems((items) => items.filter((item) => item.id !== productId))
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

  const deliveryCharge = 25
  const handlingCharge = 2
  const smallCartCharge = cartItems.length ? 20 : 0
  const grandTotal = itemsTotal + deliveryCharge + handlingCharge + smallCartCharge

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItem,
        updateQuantity,
        removeItem,
        totalCount,
        itemsTotal,
        deliveryCharge,
        handlingCharge,
        smallCartCharge,
        grandTotal,
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
