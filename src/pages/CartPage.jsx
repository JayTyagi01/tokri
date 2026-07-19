import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronRight, Minus, Plus } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAddress } from '../context/AddressContext'
import { resolveAssetUrl } from '../lib/api'

const formatPrice = (value) =>
  `₹${Number(value).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`

function CartQtyStepper({ quantity, onDecrease, onIncrease }) {
  return (
    <div className="inline-flex items-center rounded-lg border-2 border-brand bg-brand text-black">
      <button
        type="button"
        onClick={onDecrease}
        className="flex h-8 w-8 items-center justify-center"
        aria-label="Decrease quantity"
      >
        <Minus size={14} strokeWidth={3} />
      </button>
      <span className="min-w-[1.5rem] text-center text-sm font-bold">{quantity}</span>
      <button
        type="button"
        onClick={onIncrease}
        className="flex h-8 w-8 items-center justify-center"
        aria-label="Increase quantity"
      >
        <Plus size={14} strokeWidth={3} />
      </button>
    </div>
  )
}

function MobileCartItem({ item, onDecrease, onIncrease }) {
  const lineTotal = item.priceValue * item.quantity

  return (
    <article className="flex gap-3 border-b border-slate-100 px-4 py-4 last:border-b-0">
      <img
        src={resolveAssetUrl(item.image)}
        alt={item.name}
        className="h-[72px] w-[72px] shrink-0 rounded-xl border border-slate-100 object-cover"
      />

      <div className="min-w-0 flex-1">
        <p className="m-0 line-clamp-2 text-xs font-medium leading-snug text-slate-900">
          {item.name}
        </p>
        {item.weight && <p className="mt-1 text-xs text-slate-500">{item.weight}</p>}
        <p className="mt-2 text-sm font-bold text-slate-900">{formatPrice(lineTotal)}</p>
      </div>

      <div className="shrink-0 self-center">
        <CartQtyStepper quantity={item.quantity} onDecrease={onDecrease} onIncrease={onIncrease} />
      </div>
    </article>
  )
}

function BillRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2.5 text-sm">
      <span className="text-muted">{label}</span>
      <span className="font-medium text-white">{value}</span>
    </div>
  )
}

function MobileCartView({
  cartItems,
  itemsTotal,
  deliveryCharge,
  handlingCharge,
  smallCartCharge,
  grandTotal,
  updateQuantity,
  removeItem,
  onProceed,
  hasDeliveryAddress,
  onAddAddress,
}) {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-canvas pb-28 lg:hidden">
      <div className="sticky top-0 z-20 border-b border-line bg-panel">
        <div className="relative flex items-center justify-center px-4 py-3.5">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute left-3 inline-flex h-10 w-10 items-center justify-center rounded-full text-white"
            aria-label="Go back"
          >
            <ArrowLeft size={22} />
          </button>
          <p className="m-0 text-sm font-semibold text-white">My Cart</p>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="mx-4 mt-6 rounded-2xl border border-dashed border-line bg-panel px-6 py-14 text-center">
          <p className="text-lg font-semibold text-white">Your cart is empty</p>
          <p className="mt-2 text-sm text-muted">Add fresh fruits from the home page.</p>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-black hover:bg-brand-hover"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-3 px-3 pt-3">
          <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
            {cartItems.map((item) => (
              <MobileCartItem
                key={item.id}
                item={item}
                onDecrease={() => {
                  if (item.quantity <= 1) removeItem(item.id)
                  else updateQuantity(item.id, -1)
                }}
                onIncrease={() => updateQuantity(item.id, 1)}
              />
            ))}
          </section>

          <section className="overflow-hidden rounded-2xl border border-line bg-panel p-4">
            <h2 className="text-base font-bold text-white">Bill details</h2>

            <div className="mt-1 divide-y divide-line">
              <BillRow label="Items total" value={formatPrice(itemsTotal)} />
              <BillRow label="Delivery charge" value={formatPrice(deliveryCharge)} />
              <BillRow label="Handling charge" value={formatPrice(handlingCharge)} />
              {smallCartCharge > 0 && (
                <BillRow label="Small cart charge" value={formatPrice(smallCartCharge)} />
              )}
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-dashed border-line pt-3">
              <span className="text-base font-bold text-white">Grand total</span>
              <span className="text-base font-bold text-white">{formatPrice(grandTotal)}</span>
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-panel p-4">
            <h2 className="text-base font-bold text-white">Cancellation Policy</h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Orders cannot be cancelled once packed for delivery. In case of unexpected delays, a
              refund will be provided where applicable.
            </p>
          </section>
        </div>
      )}

      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-line bg-panel p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.35)]">
          {hasDeliveryAddress ? (
            <button
              type="button"
              onClick={onProceed}
              className="flex w-full items-center justify-between rounded-xl bg-brand px-5 py-3.5 text-black transition active:bg-brand-hover"
            >
              <span>
                <span className="block text-lg font-bold leading-none">{formatPrice(grandTotal)}</span>
                <span className="mt-1 block text-[11px] font-semibold uppercase tracking-wide text-black/70">
                  TOTAL
                </span>
              </span>
              <span className="inline-flex items-center gap-1 text-base font-semibold">
                Proceed
                <ChevronRight size={18} />
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onAddAddress}
              className="w-full rounded-xl bg-brand px-5 py-3.5 text-base font-semibold text-black transition active:bg-brand-hover"
            >
              Add address to proceed
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function DesktopCartView({
  cartItems,
  itemsTotal,
  deliveryCharge,
  handlingCharge,
  smallCartCharge,
  grandTotal,
  updateQuantity,
  removeItem,
  onProceed,
  hasDeliveryAddress,
  onAddAddress,
}) {
  return (
    <section className="container mx-auto hidden bg-canvas px-4 py-10 lg:block">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-muted">Cart</p>
            <h1 className="text-3xl font-bold text-white">Your Shopping Bag</h1>
          </div>
          <Link to="/" className="text-sm text-mint hover:text-white">
            Continue shopping
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="rounded-[2rem] border border-line bg-panel p-12 text-center text-muted">
            <p className="text-xl font-semibold text-white">Your cart is empty</p>
            <p className="mt-3">Add fresh fruits from the home page to place your order.</p>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.8fr_1fr]">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-[2rem] border border-line bg-panel p-5 sm:flex-row sm:items-center"
                >
                  <img
                    src={resolveAssetUrl(item.image)}
                    alt={item.name}
                    className="h-28 w-28 rounded-3xl object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-white">{item.name}</h2>
                        <p className="text-sm text-muted">{item.weight}</p>
                      </div>
                      <p className="text-lg font-semibold text-white">
                        {formatPrice(item.priceValue * item.quantity)}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="h-9 w-9 rounded-full border border-line text-white"
                      >
                        –
                      </button>
                      <span className="font-semibold text-white">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="h-9 w-9 rounded-full border border-line text-white"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="ml-auto text-sm text-muted hover:text-white"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-6 rounded-[2rem] border border-line bg-panel p-6">
              <h2 className="text-xl font-semibold text-white">Order summary</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-muted">
                  <span>Item total</span>
                  <span>{formatPrice(itemsTotal)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted">
                  <span>Delivery charges</span>
                  <span>{formatPrice(deliveryCharge)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted">
                  <span>Handling charge</span>
                  <span>{formatPrice(handlingCharge)}</span>
                </div>
                {smallCartCharge > 0 && (
                  <div className="flex items-center justify-between text-sm text-muted">
                    <span>Small cart charge</span>
                    <span>{formatPrice(smallCartCharge)}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between border-t border-line pt-4 text-lg font-semibold text-white">
                <span>Total</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
              {hasDeliveryAddress ? (
                <button
                  type="button"
                  onClick={onProceed}
                  className="w-full rounded-full bg-brand py-4 text-sm font-semibold text-black transition hover:bg-brand-hover"
                >
                  Proceed to checkout
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onAddAddress}
                  className="w-full rounded-full bg-brand py-4 text-sm font-semibold text-black transition hover:bg-brand-hover"
                >
                  Add address to proceed
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default function CartPage() {
  const navigate = useNavigate()
  const { hasDeliveryAddress, openPicker } = useAddress()
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

  const handleProceed = () => navigate('/checkout')

  return (
    <>
      <MobileCartView
        cartItems={cartItems}
        itemsTotal={itemsTotal}
        deliveryCharge={deliveryCharge}
        handlingCharge={handlingCharge}
        smallCartCharge={smallCartCharge}
        grandTotal={grandTotal}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
        onProceed={handleProceed}
        hasDeliveryAddress={hasDeliveryAddress}
        onAddAddress={openPicker}
      />
      <DesktopCartView
        cartItems={cartItems}
        itemsTotal={itemsTotal}
        deliveryCharge={deliveryCharge}
        handlingCharge={handlingCharge}
        smallCartCharge={smallCartCharge}
        grandTotal={grandTotal}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
        onProceed={handleProceed}
        hasDeliveryAddress={hasDeliveryAddress}
        onAddAddress={openPicker}
      />
    </>
  )
}
