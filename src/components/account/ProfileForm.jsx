import { useRef, useState } from 'react'
import { Calendar } from 'lucide-react'
import Swal from 'sweetalert2'
import { useAuth } from '../../context/AuthContext'

function maskDob(value) {
  const digits = String(value || '').replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
}

function toDisplayDate(value) {
  if (!value) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-')
    return `${day}/${month}/${year}`
  }
  return maskDob(value)
}

function toIsoDate(value) {
  const masked = maskDob(value)
  const match = masked.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!match) return ''
  return `${match[3]}-${match[2]}-${match[1]}`
}

export default function ProfileForm() {
  const { user, updateProfile } = useAuth()
  const pickerRef = useRef(null)
  const [name, setName] = useState(user?.name || '')
  const [dateOfBirth, setDateOfBirth] = useState(toDisplayDate(user?.dateOfBirth))
  const [saving, setSaving] = useState(false)

  const openPicker = () => {
    const input = pickerRef.current
    if (!input) return
    if (typeof input.showPicker === 'function') input.showPicker()
    else input.click()
  }

  const handleSave = async (event) => {
    event.preventDefault()
    const nextName = name.trim()
    if (!nextName) {
      Swal.fire({ icon: 'error', title: 'Name required', text: 'Please enter your name.', confirmButtonColor: '#047857' })
      return
    }

    setSaving(true)
    try {
      await updateProfile({ name: nextName, dateOfBirth: toIsoDate(dateOfBirth) || null })
      Swal.fire({
        icon: 'success',
        title: 'Profile saved',
        timer: 1400,
        showConfirmButton: false,
      })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Could not save',
        text: error.message || 'Please try again.',
        confirmButtonColor: '#047857',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="max-w-md">
      <h1 className="text-2xl font-bold text-white">Profile</h1>
      <p className="mt-2 text-sm text-muted">Update your name and date of birth.</p>

      <label className="mt-6 block text-sm font-semibold text-white" htmlFor="profile-name">
        Name
      </label>
      <input
        id="profile-name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        maxLength={80}
        className="mt-2 w-full rounded-xl border border-line bg-panel-2 px-4 py-3 text-white outline-none focus:border-brand"
        placeholder="Your name"
      />

      <label className="mt-5 block text-sm font-semibold text-white" htmlFor="profile-dob">
        Date of birth
      </label>
      <div className="relative mt-2">
        <input
          id="profile-dob"
          value={dateOfBirth}
          onChange={(event) => setDateOfBirth(maskDob(event.target.value))}
          inputMode="numeric"
          maxLength={10}
          placeholder="DD/MM/YYYY"
          className="w-full rounded-xl border border-line bg-panel-2 py-3 pr-12 pl-4 text-white outline-none focus:border-brand"
        />
        <button
          type="button"
          onClick={openPicker}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-brand"
          aria-label="Open date picker"
        >
          <Calendar size={20} />
        </button>
        <input
          ref={pickerRef}
          type="date"
          max={new Date().toISOString().slice(0, 10)}
          min="1920-01-01"
          value={toIsoDate(dateOfBirth)}
          onChange={(event) => setDateOfBirth(toDisplayDate(event.target.value))}
          className="pointer-events-none absolute h-0 w-0 opacity-0"
          tabIndex={-1}
          aria-hidden="true"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="mt-6 inline-flex rounded-full bg-brand px-6 py-3 text-sm font-semibold text-black hover:bg-brand-hover disabled:opacity-60"
      >
        {saving ? 'Saving…' : 'Save'}
      </button>
    </form>
  )
}
