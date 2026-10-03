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
          className="w-full rounded-3xl bg-brand px-6 py-4 text-sm font-semibold text-black transition hover:bg-brand-hover"
        >
          Add to cart
        </button>
      )
    }

    return (
      <div className="flex w-full items-center justify-between rounded-3xl bg-brand px-3 py-2 text-black">
        <button
          type="button"
          onClick={handleDecrease}
          className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-brand-hover"
          aria-label="Decrease quantity"
        >
          <Minus size={18} />
        </button>
        <span className="text-base font-semibold">{quantity}</span>
        <button
          type="button"
          onClick={handleIncrease}
          className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-brand-hover"
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
          className="rounded-md border-2 border-brand bg-[#163322] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-brand transition hover:bg-brand hover:text-white sm:min-w-[52px] sm:px-3 sm:text-[11px]"
        >
          {addLabel}
        </button>
      )
    }

    return (
      <div className="inline-flex items-center rounded-md bg-brand text-white sm:min-w-[52px]">
        <button
          type="button"
          onClick={handleDecrease}
          className="flex h-7 w-6 items-center justify-center transition hover:bg-brand-hover sm:w-7"
          aria-label="Decrease quantity"
        >
          <Minus size={12} />
        </button>
        <span className="min-w-[1rem] text-center text-[11px] font-bold">{quantity}</span>
        <button
          type="button"
          onClick={handleIncrease}
          className="flex h-7 w-6 items-center justify-center transition hover:bg-brand-hover sm:w-7"
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
        className="rounded border border-brand bg-[#163322] px-1.5 py-0.5 text-[10px] font-bold leading-none text-brand transition hover:bg-brand hover:text-white"
      >
        {addLabel}
      </button>
    )
  }

  return (
    <div className="inline-flex items-center rounded bg-brand text-white">
      <button
        type="button"
        onClick={handleDecrease}
        className="flex h-6 w-5 items-center justify-center rounded-l transition hover:bg-brand-hover"
        aria-label="Decrease quantity"
      >
        <Minus size={10} />
      </button>
      <span className="min-w-[0.9rem] text-center text-[10px] font-bold leading-none">
        {quantity}
      </span>
      <button
        type="button"
        onClick={handleIncrease}
        className="flex h-6 w-5 items-center justify-center rounded-r transition hover:bg-brand-hover"
        aria-label="Increase quantity"
      >
        <Plus size={10} />
      </button>
    </div>
  )
}
