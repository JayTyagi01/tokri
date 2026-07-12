import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAddress } from '../context/AddressContext'

const formatPrice = (value) => `₹${value.toLocaleString('en-IN')}`

export default function CartDrawer() {
  const navigate = useNavigate()
  const { hasDeliveryAddress, openPicker } = useAddress()
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

  const handleCheckout = () => {
    closeDrawer()
    navigate('/checkout')
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={closeDrawer}>
      <div
        className="w-full max-w-md overflow-y-auto bg-white p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">My Cart</p>
            <h2 className="text-2xl font-bold">{totalCount} item{totalCount !== 1 ? 's' : ''}</h2>
          </div>
          <button className="text-slate-500 hover:text-slate-800" onClick={closeDrawer} type="button">
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
            <div className="mb-6 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 rounded-3xl border border-slate-200 p-4">
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
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="h-9 w-9 rounded-full border border-slate-200 text-slate-800"
                      >
                        –
                      </button>
                      <span className="font-semibold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="h-9 w-9 rounded-full border border-slate-200 text-slate-800"
                      >
                        +
                      </button>
                      <button
                        type="button"
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

            <div className="space-y-4 rounded-[2rem] border border-slate-200 bg-slate-50 p-5">
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
              <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-base font-semibold">
                <span>Total</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {hasDeliveryAddress ? (
              <button
                type="button"
                onClick={handleCheckout}
                className="mt-4 block w-full rounded-full bg-slate-900 py-4 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Proceed to checkout
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  closeDrawer()
                  openPicker()
                }}
                className="mt-4 block w-full rounded-full bg-emerald-600 py-4 text-center text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Add address to proceed
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
