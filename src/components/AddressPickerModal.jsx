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
      <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-4 sm:items-center">
        <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
          <button
            type="button"
            onClick={closePicker}
            className="absolute right-6 top-6 text-slate-500 sm:right-8 sm:top-8"
            aria-label="Close"
          >
            <X size={20} />
          </button>
          <h2 className="text-lg font-bold text-slate-900">Select delivery address</h2>
          <p className="mt-2 text-sm text-slate-600">
            Log in to save a delivery address and place your order.
          </p>
          <button
            type="button"
            onClick={handleLogin}
            className="mt-6 w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
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
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 sm:items-center sm:p-4" onClick={closePicker}>
      <div
        className="relative max-h-[85vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:max-w-lg sm:rounded-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={closePicker}
          className="absolute right-4 top-4 text-slate-500 hover:text-slate-900"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h2 className="pr-8 text-lg font-bold text-slate-900">Select delivery address</h2>
        <p className="mt-1 text-sm text-slate-500">Choose where we should deliver your order.</p>

        <ul className="mt-5 divide-y divide-slate-100 rounded-2xl border border-slate-200">
          {addresses.map((address) => {
            const Icon = addressLabelIcon(address.label)
            const active = address.id === selectedAddressId

            return (
              <li key={address.id}>
                <button
                  type="button"
                  onClick={() => selectAddress(address.id)}
                  className={`flex w-full items-start gap-3 px-4 py-4 text-left transition ${
                    active ? 'bg-emerald-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <span
                    className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                      active ? 'border-emerald-600' : 'border-slate-300'
                    }`}
                  >
                    {active && <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />}
                  </span>
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                    <Icon size={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-slate-900">{address.label}</span>
                    <span className="mt-1 block text-sm leading-5 text-slate-600">{address.formatted}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        <button
          type="button"
          onClick={() => setFormOpen(true)}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-900"
        >
          <Plus size={16} />
          Add new address
        </button>
      </div>
    </div>
  )
}
