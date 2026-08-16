export function formatDateOfBirth(value) {
  if (!value) return null
  if (typeof value === 'string') {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/)
    if (match) return `${match[1]}-${match[2]}-${match[3]}`
  }

  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return null

  // Noon UTC avoids timezone shifting a DATE column to the previous day.
  const utc = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 12))
  const year = utc.getUTCFullYear()
  const month = String(utc.getUTCMonth() + 1).padStart(2, '0')
  const day = String(utc.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function parseDateOfBirth(value) {
  if (value === undefined) return undefined
  if (value === null || String(value).trim() === '') return null

  const raw = String(value).trim()
  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})/)
  const dmy = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  let year
  let month
  let day

  if (iso) {
    year = Number(iso[1])
    month = Number(iso[2])
    day = Number(iso[3])
  } else if (dmy) {
    day = Number(dmy[1])
    month = Number(dmy[2])
    year = Number(dmy[3])
  } else {
    throw Object.assign(new Error('Enter date of birth as DD/MM/YYYY.'), { status: 400 })
  }

  const date = new Date(Date.UTC(year, month - 1, day, 12))
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw Object.assign(new Error('Enter a valid date of birth.'), { status: 400 })
  }

  const today = new Date()
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const isoValue = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  if (isoValue > todayIso) {
    throw Object.assign(new Error('Date of birth cannot be in the future.'), { status: 400 })
  }

  return isoValue
}

export function formatAuthCustomer(customer) {
  return {
    id: customer.id,
    phone: customer.phone,
    name: customer.name || null,
    dateOfBirth: formatDateOfBirth(customer.dateOfBirth),
  }
}
