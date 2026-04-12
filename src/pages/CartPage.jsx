import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const formatPrice = (value) => `₹${value.toLocaleString('en-IN')}`

export default function CartPage() {
  const {
    cartItems,
    itemsTotal,
    deliveryCharge,
    handlingCharge,
    smallCartCharge,
    grandTotal,
    updateQuantity,
    removeItem,
  } = useCart()

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-slate-500">Cart</p>
            <h1 className="text-3xl font-bold">Your Shopping Bag</h1>
          </div>
          <Link to="/" className="text-sm text-slate-600 hover:text-slate-900">
            Continue shopping
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-12 text-center text-slate-600">
            <p className="text-xl font-semibold">Your cart is empty</p>
            <p className="mt-3">Add fresh groceries from the home page to place your order.</p>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.8fr_1fr]">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 p-5 sm:flex-row sm:items-center">
                  <img src={item.image} alt={item.name} className="h-28 w-28 rounded-3xl object-cover" />
                  <div className="flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h2 className="text-lg font-semibold">{item.name}</h2>
                        <p className="text-sm text-slate-500">{item.weight}</p>
                      </div>
                      <p className="text-lg font-semibold">{formatPrice(item.priceValue)}</p>
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="h-9 w-9 rounded-full border border-slate-200 text-slate-800"
                      >
                        –
                      </button>
                      <span className="font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="h-9 w-9 rounded-full border border-slate-200 text-slate-800"
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

            <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-xl font-semibold">Order summary</h2>
              <div className="space-y-3">
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
              </div>
              <div className="border-t border-slate-200 pt-4 flex items-center justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
              <button className="w-full rounded-full bg-slate-900 py-4 text-sm font-semibold text-white">
                Proceed to checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
