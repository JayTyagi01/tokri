import { Link } from 'react-router-dom'
import { ChevronRight, ShoppingCart } from 'lucide-react'
import { useCart } from '../context/CartContext'

const formatPrice = (value) =>
  `₹${Number(value).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`

export default function StickyCartBar() {
  const { totalCount, itemsTotal } = useCart()

  if (totalCount === 0) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 lg:hidden">
      <Link
        to="/cart"
        className="flex items-center gap-3 rounded-2xl bg-emerald-600 px-4 py-3 shadow-lg shadow-emerald-900/20 transition active:scale-[0.99]"
      >
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white">
          <ShoppingCart size={20} />
        </span>

        <span className="min-w-0 flex-1 text-white">
          <span className="block text-sm font-semibold">
            {totalCount} item{totalCount !== 1 ? 's' : ''}
          </span>
          <span className="block text-base font-bold">{formatPrice(itemsTotal)}</span>
        </span>

        <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-white">
          View Cart
          <ChevronRight size={16} />
        </span>
      </Link>
    </div>
  )
}
