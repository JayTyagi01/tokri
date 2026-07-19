import { useState } from 'react'
import { X } from 'lucide-react'

const LABELS = ['Home', 'Work', 'Other']

const emptyForm = (defaultPhone = '') => ({
  label: 'Home',
  name: '',
  phone: defaultPhone,
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
  landmark: '',
})

export default function AddressFormModal({ initial, defaultPhone, saving, onClose, onSave }) {
  const [form, setForm] = useState(initial ? { ...emptyForm(defaultPhone), ...initial } : emptyForm(defaultPhone))
  const [error, setError] = useState('')

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    try {
      await onSave(form)
    } catch (err) {
      setError(err.message || 'Could not save address.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-line bg-panel p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-muted hover:text-white"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-white">
          {initial ? 'Edit address' : 'Add new address'}
        </h2>
        <p className="mt-1 text-sm text-muted">Where should we deliver your fresh fruits?</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-white">Save as</label>
            <div className="flex flex-wrap gap-2">
              {LABELS.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => update('label', label)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    form.label === label
                      ? 'bg-brand text-black'
                      : 'border border-line bg-panel-2 text-white hover:bg-panel'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-white">Full name</label>
            <input
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              className="w-full rounded-xl border border-line bg-panel-2 px-3 py-2.5 text-sm text-white outline-none focus:border-brand"
              placeholder="Receiver name"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-white">Mobile number</label>
            <div className="flex items-center rounded-xl border border-line bg-panel-2 px-3 py-2.5">
              <span className="text-sm text-muted">+91</span>
              <input
                value={form.phone}
                onChange={(e) => update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="ml-2 w-full bg-transparent text-sm text-white outline-none"
                placeholder="10-digit mobile"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-white">House / flat / building</label>
            <input
              value={form.line1}
              onChange={(e) => update('line1', e.target.value)}
              className="w-full rounded-xl border border-line bg-panel-2 px-3 py-2.5 text-sm text-white outline-none focus:border-brand"
              placeholder="Flat 402, Green Valley Apartments"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-white">Street / area</label>
            <input
              value={form.line2}
              onChange={(e) => update('line2', e.target.value)}
              className="w-full rounded-xl border border-line bg-panel-2 px-3 py-2.5 text-sm text-white outline-none focus:border-brand"
              placeholder="Sector 18, Noida"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white">City</label>
              <input
                value={form.city}
                onChange={(e) => update('city', e.target.value)}
                className="w-full rounded-xl border border-line bg-panel-2 px-3 py-2.5 text-sm text-white outline-none focus:border-brand"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white">State</label>
              <input
                value={form.state}
                onChange={(e) => update('state', e.target.value)}
                className="w-full rounded-xl border border-line bg-panel-2 px-3 py-2.5 text-sm text-white outline-none focus:border-brand"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white">Pincode</label>
              <input
                value={form.pincode}
                onChange={(e) => update('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full rounded-xl border border-line bg-panel-2 px-3 py-2.5 text-sm text-white outline-none focus:border-brand"
                placeholder="6-digit pincode"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white">Landmark (optional)</label>
              <input
                value={form.landmark}
                onChange={(e) => update('landmark', e.target.value)}
                className="w-full rounded-xl border border-line bg-panel-2 px-3 py-2.5 text-sm text-white outline-none focus:border-brand"
                placeholder="Near metro gate"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-800/50 bg-red-950/40 px-3 py-2 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-brand py-3 text-sm font-semibold text-black transition hover:bg-brand-hover disabled:opacity-60"
          >
            {saving ? 'Saving...' : initial ? 'Save changes' : 'Save address'}
          </button>
        </form>
      </div>
    </div>
  )
}
