import { ChevronDown, MapPin } from 'lucide-react'
import { useAddress } from '../context/AddressContext'
import { useAuth } from '../context/AuthContext'

function shortAddress(address) {
  if (!address) return ''
  const line = [address.line1, address.line2, address.city].filter(Boolean).join(', ')
  return line.length > 42 ? `${line.slice(0, 42)}...` : line
}

export default function DeliveryAddressBar({ className = '', variant = 'mobile' }) {
  const { isLoggedIn } = useAuth()
  const { selectedAddress, addresses, openPicker } = useAddress()

  const label = !isLoggedIn || !selectedAddress ? 'Select address' : shortAddress(selectedAddress)
  const canChangeAddress = isLoggedIn && addresses.length > 1 && selectedAddress

  if (variant === 'desktop') {
    return (
      <button
        type="button"
        onClick={openPicker}
        className={`text-left text-sm text-slate-700 sm:flex sm:items-center sm:gap-2 ${className}`}
      >
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
          <MapPin size={18} />
        </span>
        <span className="min-w-0">
          <span className="block text-xs font-medium text-black">Deliver To</span>
          <span className="flex items-center gap-1.5">
            <span
              className={`block truncate text-sm font-medium ${
                !isLoggedIn || !selectedAddress ? 'text-emerald-700' : 'text-[#595959]'
              }`}
            >
              {label}
            </span>
            {canChangeAddress && (
              <ChevronDown size={14} className="shrink-0 text-slate-500" aria-hidden="true" />
            )}
          </span>
        </span>
      </button>
    )
  }

  return (
    <div className={className}>
      <p className="text-sm font-bold text-slate-900">Delivery in 12 minutes</p>
      <button
        type="button"
        onClick={openPicker}
        className="mt-0.5 flex max-w-full items-center gap-1.5 text-left text-xs"
      >
        <span
          className={`truncate ${!isLoggedIn || !selectedAddress ? 'font-semibold text-emerald-700' : 'text-slate-600'}`}
        >
          {label}
        </span>
        {canChangeAddress ? (
          <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
            Change
            <ChevronDown size={12} />
          </span>
        ) : (
          <ChevronDown size={14} className="shrink-0 text-slate-500" />
        )}
      </button>
    </div>
  )
}
