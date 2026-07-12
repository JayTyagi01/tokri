import crypto from 'crypto'
import { prisma } from '../lib/prisma.js'

const LABELS = new Set(['Home', 'Work', 'Other'])

function normalizePhone(value) {
  const digits = String(value || '').replace(/\D/g, '')
  if (digits.length === 10) return digits
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2)
  return null
}

function parseAddresses(raw) {
  if (!raw) return []
  if (Array.isArray(raw)) return raw
  return []
}

function formatAddressLine(address) {
  const parts = [
    address.name,
    address.line1,
    address.line2,
    [address.city, address.state, address.pincode].filter(Boolean).join(', '),
    address.landmark ? `Landmark: ${address.landmark}` : null,
  ].filter(Boolean)
  return parts.join(', ')
}

function sanitizeAddressInput(input = {}, fallbackPhone = '') {
  const label = LABELS.has(input.label) ? input.label : 'Home'
  const name = String(input.name || '').trim()
  const line1 = String(input.line1 || '').trim()
  const line2 = String(input.line2 || '').trim()
  const city = String(input.city || '').trim()
  const state = String(input.state || '').trim()
  const pincode = String(input.pincode || '').replace(/\D/g, '').slice(0, 6)
  const landmark = String(input.landmark || '').trim()
  const phone = normalizePhone(input.phone) || fallbackPhone

  if (!name) throw Object.assign(new Error('Full name is required.'), { status: 400 })
  if (!line1) throw Object.assign(new Error('House / flat details are required.'), { status: 400 })
  if (!line2) throw Object.assign(new Error('Street / area is required.'), { status: 400 })
  if (!city) throw Object.assign(new Error('City is required.'), { status: 400 })
  if (!state) throw Object.assign(new Error('State is required.'), { status: 400 })
  if (pincode.length !== 6) throw Object.assign(new Error('Enter a valid 6-digit pincode.'), { status: 400 })
  if (!phone) throw Object.assign(new Error('A valid mobile number is required.'), { status: 400 })

  return {
    label,
    name,
    phone,
    line1,
    line2,
    city,
    state,
    pincode,
    landmark,
  }
}

export function formatAddressRecord(address) {
  return {
    ...address,
    formatted: formatAddressLine(address),
  }
}

export async function listAddresses(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw Object.assign(new Error('User not found.'), { status: 404 })

  return parseAddresses(user.addresses).map(formatAddressRecord)
}

export async function createAddress(userId, input) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw Object.assign(new Error('User not found.'), { status: 404 })

  const addresses = parseAddresses(user.addresses)
  const payload = sanitizeAddressInput(input, user.phone)
  const nextAddress = {
    id: crypto.randomUUID(),
    ...payload,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  await prisma.user.update({
    where: { id: userId },
    data: { addresses: [...addresses, nextAddress] },
  })

  return formatAddressRecord(nextAddress)
}

export async function updateAddress(userId, addressId, input) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw Object.assign(new Error('User not found.'), { status: 404 })

  const addresses = parseAddresses(user.addresses)
  const index = addresses.findIndex((item) => item.id === addressId)
  if (index === -1) throw Object.assign(new Error('Address not found.'), { status: 404 })

  const payload = sanitizeAddressInput(input, user.phone)
  const updated = {
    ...addresses[index],
    ...payload,
    updatedAt: new Date().toISOString(),
  }

  addresses[index] = updated
  await prisma.user.update({
    where: { id: userId },
    data: { addresses },
  })

  return formatAddressRecord(updated)
}

export async function deleteAddress(userId, addressId) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw Object.assign(new Error('User not found.'), { status: 404 })

  const addresses = parseAddresses(user.addresses)
  const nextAddresses = addresses.filter((item) => item.id !== addressId)
  if (nextAddresses.length === addresses.length) {
    throw Object.assign(new Error('Address not found.'), { status: 404 })
  }

  await prisma.user.update({
    where: { id: userId },
    data: { addresses: nextAddresses },
  })

  return { ok: true }
}

export { normalizePhone }
