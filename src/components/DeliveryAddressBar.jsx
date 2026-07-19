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
        className={`text-left text-sm text-mint sm:flex sm:items-center sm:gap-2 ${className}`}
      >
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-panel-2 text-brand">
          <MapPin size={18} />
        </span>
        <span className="min-w-0">
          <span className="block text-xs font-medium text-white">Deliver To</span>
          <span className="flex items-center gap-1.5">
            <span
              className={`block truncate text-sm font-medium ${
                !isLoggedIn || !selectedAddress ? 'text-brand' : 'text-mint'
              }`}
            >
              {label}
            </span>
            {canChangeAddress && (
              <ChevronDown size={14} className="shrink-0 text-muted" aria-hidden="true" />
            )}
          </span>
        </span>
      </button>
    )
  }

  return (
    <div className={className}>
      <p className="text-sm font-bold text-white">Delivery in 12 minutes</p>
      <button
        type="button"
        onClick={openPicker}
        className="mt-0.5 flex max-w-full items-center gap-1.5 text-left text-xs"
      >
        <span
          className={`truncate ${!isLoggedIn || !selectedAddress ? 'font-semibold text-brand' : 'text-mint'}`}
        >
          {label}
        </span>
        {canChangeAddress ? (
          <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-panel-2 px-1.5 py-0.5 text-[10px] font-semibold text-mint">
            Change
            <ChevronDown size={12} />
          </span>
        ) : (
          <ChevronDown size={14} className="shrink-0 text-muted" />
        )}
      </button>
    </div>
  )
}
