import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const formatPrice = (value) => `₹${value.toLocaleString('en-IN')}`

export default function CartDrawer() {
  const {
    cartItems,
    totalCount,
    itemsTotal,
    deliveryCharge,
    handlingCharge,
    smallCartCharge,
    grandTotal,
    showDrawer,
    closeDrawer,
    updateQuantity,
    removeItem,
  } = useCart()

  if (!showDrawer) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-end" onClick={closeDrawer}>
      <div
        className="w-full max-w-md bg-white p-6 overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-slate-500">My Cart</p>
            <h2 className="text-2xl font-bold">{totalCount} item{totalCount !== 1 ? 's' : ''}</h2>
          </div>
          <button className="text-slate-500 hover:text-slate-800" onClick={closeDrawer}>
            Close
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="py-20 text-center text-slate-600">
            <p className="text-lg font-medium">Your cart is empty</p>
            <p className="mt-2">Add fresh fruits and vegetables to get started.</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 items-center rounded-3xl border border-slate-200 p-4">
                  <img src={item.image} alt={item.name} className="h-20 w-20 rounded-3xl object-cover" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-slate-500">{item.weight}</p>
                      </div>
                      <p className="font-semibold">{formatPrice(item.priceValue)}</p>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-9 h-9 rounded-full border border-slate-200 text-slate-800"
                      >
                        –
                      </button>
                      <span className="font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-9 h-9 rounded-full border border-slate-200 text-slate-800"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto text-sm text-slate-500 hover:text-slate-900"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5 space-y-4">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Item total</span>
                <span>{formatPrice(itemsTotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Delivery charges</span>
                <span>{formatPrice(deliveryCharge)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Cart handling</span>
                <span>{formatPrice(handlingCharge)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Small cart charge</span>
                <span>{formatPrice(smallCartCharge)}</span>
              </div>
              <div className="border-t border-slate-200 pt-4 flex items-center justify-between text-base font-semibold">
                <span>Total</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <Link
              to="/cart"
              className="block w-full rounded-full bg-slate-900 py-4 text-center text-white text-sm font-semibold"
              onClick={closeDrawer}
            >
              View Cart & Checkout
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
