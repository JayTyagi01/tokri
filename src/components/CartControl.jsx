import { Minus, Plus } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function CartControl({
  product,
  variant = 'compact',
  addLabel = 'ADD',
  onAdd,
}) {
  const { addItem, updateQuantity, removeItem, getItemQuantity } = useCart()
  const quantity = getItemQuantity(product.id)

  const stop = (event) => {
    event.stopPropagation()
    event.preventDefault()
  }

  const handleAdd = (event) => {
    stop(event)
    addItem(product)
    onAdd?.()
  }

  const handleIncrease = (event) => {
    stop(event)
    addItem(product)
  }

  const handleDecrease = (event) => {
    stop(event)
    if (quantity <= 1) {
      removeItem(product.id)
    } else {
      updateQuantity(product.id, -1)
    }
  }

  if (variant === 'block') {
    if (quantity <= 0) {
      return (
        <button
          type="button"
          onClick={handleAdd}
          className="w-full rounded-3xl bg-emerald-950 px-6 py-4 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          Add to cart
        </button>
      )
    }

    return (
      <div className="flex w-full items-center justify-between rounded-3xl bg-emerald-950 px-3 py-2 text-white">
        <button
          type="button"
          onClick={handleDecrease}
          className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-emerald-800"
          aria-label="Decrease quantity"
        >
          <Minus size={18} />
        </button>
        <span className="text-base font-semibold">{quantity}</span>
        <button
          type="button"
          onClick={handleIncrease}
          className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-emerald-800"
          aria-label="Increase quantity"
        >
          <Plus size={18} />
        </button>
      </div>
    )
  }

  if (variant === 'shop') {
    if (quantity <= 0) {
      return (
        <button
          type="button"
          onClick={handleAdd}
          className="min-w-[52px] rounded-md border-2 border-emerald-600 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-700 transition hover:bg-emerald-50"
        >
          {addLabel}
        </button>
      )
    }

    return (
      <div className="inline-flex min-w-[52px] items-center rounded-md border-2 border-emerald-600 bg-white text-emerald-700">
        <button
          type="button"
          onClick={handleDecrease}
          className="flex h-7 w-7 items-center justify-center transition hover:bg-emerald-50"
          aria-label="Decrease quantity"
        >
          <Minus size={12} />
        </button>
        <span className="min-w-[1rem] text-center text-[11px] font-bold">{quantity}</span>
        <button
          type="button"
          onClick={handleIncrease}
          className="flex h-7 w-7 items-center justify-center transition hover:bg-emerald-50"
          aria-label="Increase quantity"
        >
          <Plus size={12} />
        </button>
      </div>
    )
  }

  if (quantity <= 0) {
    return (
      <button
        type="button"
        onClick={handleAdd}
        className="rounded-md border border-emerald-600 px-3 py-1.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-600 hover:text-white"
      >
        {addLabel}
      </button>
    )
  }

  return (
    <div className="inline-flex items-center rounded-md bg-emerald-600 text-white">
      <button
        type="button"
        onClick={handleDecrease}
        className="flex h-8 w-8 items-center justify-center rounded-l-md transition hover:bg-emerald-700"
        aria-label="Decrease quantity"
      >
        <Minus size={14} />
      </button>
      <span className="min-w-[1.25rem] text-center text-xs font-bold">{quantity}</span>
      <button
        type="button"
        onClick={handleIncrease}
        className="flex h-8 w-8 items-center justify-center rounded-r-md transition hover:bg-emerald-700"
        aria-label="Increase quantity"
      >
        <Plus size={14} />
      </button>
    </div>
  )
}
