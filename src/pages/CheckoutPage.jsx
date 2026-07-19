import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useAddress } from '../context/AddressContext'
import { authGet, authPost, fetchJson } from '../lib/api'
import { formatPrice, loadRazorpayScript } from '../lib/checkout'
import { addressLabelIcon } from '../components/account/AccountSidebar'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { user, isLoggedIn } = useAuth()
  const { selectedAddressId: savedAddressId } = useAddress()
  const {
    cartItems,
    itemsTotal,
    deliveryCharge,
    handlingCharge,
    smallCartCharge,
    grandTotal,
    clearCart,
  } = useCart()

  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState('')
  const [razorpayEnabled, setRazorpayEnabled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    let ignore = false

    async function load() {
      setLoading(true)
      try {
        const [config, addressData] = await Promise.all([
          fetchJson('/checkout/config'),
          isLoggedIn ? authGet('/account/addresses', user) : Promise.resolve({ addresses: [] }),
        ])
        if (ignore) return
        setRazorpayEnabled(Boolean(config?.razorpay?.enabled))
        const list = addressData.addresses || []
        setAddresses(list)
        const preferredId =
          savedAddressId && list.some((item) => item.id === savedAddressId)
            ? savedAddressId
            : list[0]?.id || ''
        if (preferredId) setSelectedAddressId(preferredId)
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    load()
    return () => {
      ignore = true
    }
  }, [isLoggedIn, user?.phone, savedAddressId])

  const startOnlinePayment = async (checkout) => {
    const loaded = await loadRazorpayScript()
    if (!loaded || !window.Razorpay) {
      throw new Error('Could not load Razorpay. Please try again.')
    }

    const rzp = checkout.razorpay

    return new Promise((resolve, reject) => {
      const options = {
        key: rzp.keyId,
        amount: rzp.amount,
        currency: rzp.currency,
        name: rzp.name,
        description: rzp.description,
        order_id: rzp.orderId,
        prefill: rzp.prefill,
        theme: { color: '#064e3b' },
        handler: async (response) => {
          try {
            await authPost('/checkout/verify-payment', user, {
              orderNo: checkout.order.orderNo,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })
            resolve(checkout.order.orderNo)
          } catch (error) {
            reject(error)
          }
        },
        modal: {
          ondismiss: () => reject(new Error('Payment cancelled.')),
        },
      }

      const instance = new window.Razorpay(options)
      instance.on('payment.failed', () => reject(new Error('Payment failed. Please try again.')))
      instance.open()
    })
  }

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      Swal.fire({
        icon: 'info',
        title: 'Login required',
        text: 'Please log in to place your order.',
        confirmButtonColor: '#047857',
      })
      return
    }

    if (!selectedAddressId) {
      Swal.fire({
        icon: 'warning',
        title: 'Select address',
        text: 'Please add and select a delivery address.',
        confirmButtonColor: '#047857',
      })
      return
    }

    setPaying(true)
    try {
      const paymentMode = razorpayEnabled ? 'online' : 'cod'
      const checkout = await authPost('/checkout/create-order', user, {
        items: cartItems.map((item) => ({ id: item.id, quantity: item.quantity })),
        addressId: selectedAddressId,
        paymentMode,
      })

      let orderNo = checkout.order.orderNo

      if (checkout.razorpay) {
        orderNo = await startOnlinePayment(checkout)
      }

      clearCart()
      Swal.fire({
        icon: 'success',
        title: 'Order placed',
        text: checkout.razorpay
          ? `Payment successful. Order ${orderNo} confirmed.`
          : `Order ${orderNo} placed. Pay on delivery.`,
        confirmButtonColor: '#047857',
      }).then(() => navigate('/account?section=orders'))
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Checkout failed',
        text: error.message || 'Could not complete checkout.',
        confirmButtonColor: '#047857',
      })
    } finally {
      setPaying(false)
    }
  }

  if (!cartItems.length) {
    return (
      <main className="min-h-screen bg-canvas py-16">
        <div className="mx-auto max-w-lg px-4 text-center">
          <h1 className="text-2xl font-bold text-white">Nothing to checkout</h1>
          <p className="mt-3 text-muted">Your cart is empty.</p>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-full bg-brand px-6 py-3 text-sm font-semibold text-black hover:bg-brand-hover"
          >
            Continue shopping
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="account-detail min-h-screen bg-canvas py-8 sm:py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-6">
          <Link to="/cart" className="text-sm font-medium text-mint hover:underline">
            ← Back to cart
          </Link>
          <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">Checkout</h1>
        </div>

        {!isLoggedIn && (
          <div className="mb-6 rounded-xl border border-amber-700/40 bg-amber-950/40 px-4 py-3 text-sm text-amber-200">
            Please log in to complete your order.
          </div>
        )}

        {!loading && !razorpayEnabled && (
          <div className="mb-6 rounded-xl border border-sky-700/40 bg-sky-950/40 px-4 py-3 text-sm text-sky-200">
            Online payment (Razorpay) is not enabled yet. You can still place your order with{' '}
            <strong>cash on delivery</strong>. Enable Razorpay in admin settings to accept online payments.
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-2xl border border-line bg-panel p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-white">Delivery address</h2>
              <Link
                to="/account?section=addresses"
                className="text-sm font-semibold text-mint hover:underline"
              >
                Manage addresses
              </Link>
            </div>

            {loading ? (
              <p className="mt-4 text-sm text-muted">Loading addresses...</p>
            ) : addresses.length === 0 ? (
              <div className="mt-4 rounded-xl border border-dashed border-line bg-panel-2 p-5 text-sm text-muted">
                No saved address found.{' '}
                <Link to="/account?section=addresses" className="font-semibold text-mint underline">
                  Add a delivery address
                </Link>{' '}
                to continue.
              </div>
            ) : (
              <ul className="mt-4 space-y-3">
                {addresses.map((address) => {
                  const Icon = addressLabelIcon(address.label)
                  const selected = selectedAddressId === address.id
                  return (
                    <li key={address.id}>
                      <label
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                          selected
                            ? 'border-brand bg-brand/10'
                            : 'border-line hover:border-line/80'
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          checked={selected}
                          onChange={() => setSelectedAddressId(address.id)}
                          className="mt-1"
                        />
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-panel-2 text-emerald-400">
                          <Icon size={18} />
                        </span>
                        <span>
                          <span className="block font-semibold text-white">{address.label}</span>
                          <span className="mt-1 block text-sm leading-6 text-muted">
                            {address.formatted}
                          </span>
                        </span>
                      </label>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>

          <aside className="h-fit rounded-2xl border border-line bg-panel p-5 sm:p-6">
            <h2 className="text-lg font-bold text-white">Order summary</h2>
            <ul className="mt-4 space-y-3 border-b border-line pb-4">
              {cartItems.map((item) => (
                <li key={item.id} className="flex items-start justify-between gap-3 text-sm">
                  <span className="text-muted">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-medium text-white">
                    {formatPrice(item.priceValue * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 space-y-2 text-sm text-muted">
              <div className="flex justify-between">
                <span>Item total</span>
                <span>{formatPrice(itemsTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery charges</span>
                <span>{formatPrice(deliveryCharge)}</span>
              </div>
              <div className="flex justify-between">
                <span>Cart handling</span>
                <span>{formatPrice(handlingCharge)}</span>
              </div>
              <div className="flex justify-between">
                <span>Small cart charge</span>
                <span>{formatPrice(smallCartCharge)}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-line pt-4 text-lg font-bold text-white">
              <span>Total</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={paying || loading || !isLoggedIn || !addresses.length}
              className="mt-5 w-full rounded-full bg-brand py-3.5 text-sm font-semibold text-black transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {paying
                ? 'Processing...'
                : razorpayEnabled
                  ? `Pay ${formatPrice(grandTotal)}`
                  : 'Place order (Cash on delivery)'}
            </button>
          </aside>
        </div>
      </div>
    </main>
  )
}
