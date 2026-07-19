import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAddress } from '../context/AddressContext'
import { authPost } from '../lib/api'
import AddressFormModal from './account/AddressFormModal'
import { addressLabelIcon } from './account/AccountSidebar'

export default function AddressPickerModal({ onDesktopLogin }) {
  const navigate = useNavigate()
  const { user, isLoggedIn } = useAuth()
  const {
    pickerOpen,
    closePicker,
    addresses,
    selectedAddressId,
    selectAddress,
    refreshAddresses,
  } = useAddress()

  const [formOpen, setFormOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  if (!pickerOpen) return null

  const handleLogin = () => {
    closePicker()
    if (window.innerWidth >= 1024) {
      onDesktopLogin?.()
      return
    }
    navigate('/login')
  }

  const handleSave = async (payload) => {
    setSaving(true)
    try {
      const data = await authPost('/account/addresses', user, payload)
      await refreshAddresses()
      selectAddress(data.address.id)
      setFormOpen(false)
    } finally {
      setSaving(false)
    }
  }

  const showForm = formOpen || (isLoggedIn && addresses.length === 0)

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-4 sm:items-center">
        <div className="relative w-full max-w-md rounded-2xl border border-line bg-panel p-6 shadow-2xl shadow-black/40">
          <button
            type="button"
            onClick={closePicker}
            className="absolute right-6 top-6 text-muted transition hover:text-white sm:right-8 sm:top-8"
            aria-label="Close"
          >
            <X size={20} />
          </button>
          <h2 className="text-lg font-bold text-white">Select delivery address</h2>
          <p className="mt-2 text-sm text-muted">
            Log in to save a delivery address and place your order.
          </p>
          <button
            type="button"
            onClick={handleLogin}
            className="mt-6 w-full rounded-xl bg-brand py-3 text-sm font-semibold text-black transition hover:bg-brand-hover"
          >
            Log in to continue
          </button>
        </div>
      </div>
    )
  }

  if (showForm) {
    return (
      <AddressFormModal
        defaultPhone={user?.phone || ''}
        saving={saving}
        onClose={() => {
          if (addresses.length === 0) closePicker()
          setFormOpen(false)
        }}
        onSave={handleSave}
      />
    )
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 sm:items-center sm:p-4" onClick={closePicker}>
      <div
        className="relative max-h-[85vh] w-full overflow-y-auto rounded-t-3xl border border-line bg-panel p-5 shadow-2xl shadow-black/40 sm:max-w-lg sm:rounded-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={closePicker}
          className="absolute right-4 top-4 text-muted transition hover:text-white"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h2 className="pr-8 text-lg font-bold text-white">Select delivery address</h2>
        <p className="mt-1 text-sm text-muted">Choose where we should deliver your order.</p>

        <ul className="mt-5 divide-y divide-line rounded-2xl border border-line">
          {addresses.map((address) => {
            const Icon = addressLabelIcon(address.label)
            const active = address.id === selectedAddressId

            return (
              <li key={address.id}>
                <button
                  type="button"
                  onClick={() => selectAddress(address.id)}
                  className={`flex w-full items-start gap-3 px-4 py-4 text-left transition ${
                    active ? 'bg-brand/10' : 'hover:bg-panel-2'
                  }`}
                >
                  <span
                    className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                      active ? 'border-brand' : 'border-line'
                    }`}
                  >
                    {active && <span className="h-2.5 w-2.5 rounded-full bg-brand" />}
                  </span>
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-panel-2 text-brand">
                    <Icon size={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-white">{address.label}</span>
                    <span className="mt-1 block text-sm leading-5 text-muted">{address.formatted}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        <button
          type="button"
          onClick={() => setFormOpen(true)}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition hover:text-mint"
        >
          <Plus size={16} />
          Add new address
        </button>
      </div>
    </div>
  )
}
