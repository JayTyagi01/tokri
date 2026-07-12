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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-500 hover:text-slate-900"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-slate-900">
          {initial ? 'Edit address' : 'Add new address'}
        </h2>
        <p className="mt-1 text-sm text-slate-500">Where should we deliver your fresh fruits?</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Save as</label>
            <div className="flex flex-wrap gap-2">
              {LABELS.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => update('label', label)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    form.label === label
                      ? 'bg-emerald-950 text-white'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Full name</label>
            <input
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
              placeholder="Receiver name"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Mobile number</label>
            <div className="flex items-center rounded-xl border border-slate-300 px-3 py-2.5">
              <span className="text-sm text-slate-500">+91</span>
              <input
                value={form.phone}
                onChange={(e) => update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="ml-2 w-full bg-transparent text-sm outline-none"
                placeholder="10-digit mobile"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">House / flat / building</label>
            <input
              value={form.line1}
              onChange={(e) => update('line1', e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
              placeholder="Flat 402, Green Valley Apartments"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Street / area</label>
            <input
              value={form.line2}
              onChange={(e) => update('line2', e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
              placeholder="Sector 18, Noida"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">City</label>
              <input
                value={form.city}
                onChange={(e) => update('city', e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">State</label>
              <input
                value={form.state}
                onChange={(e) => update('state', e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Pincode</label>
              <input
                value={form.pincode}
                onChange={(e) => update('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                placeholder="6-digit pincode"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Landmark (optional)</label>
              <input
                value={form.landmark}
                onChange={(e) => update('landmark', e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                placeholder="Near metro gate"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-emerald-950 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60"
          >
            {saving ? 'Saving...' : initial ? 'Save changes' : 'Save address'}
          </button>
        </form>
      </div>
    </div>
  )
}
