import { ValidationError } from 'adminjs'
import { prisma } from '../lib/prisma.js'
import { sendPartnerSetPasswordEmail } from '../services/partnerPassword.js'
import { collectCashForOrder, createOrderPaymentQr } from '../services/partnerOrders.js'
import { flattenOrder } from './order-handlers.js'

function toBoolean(value, fallback = false) {
  if (value === undefined || value === null || value === '') return fallback
  return value === true || value === 'true' || value === 'on' || value === 1 || value === '1'
}

export function normalizePartnerPhone(value) {
  const digits = String(value || '').replace(/\D/g, '')
  if (digits.length === 10) return digits
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2)
  return ''
}

export async function preparePartnerPayload(request) {
  if (request.method !== 'post') return request
  const payload = { ...(request.payload || {}) }
  payload.email = String(payload.email || '').trim().toLowerCase()
  payload.name = String(payload.name || '').trim()
  payload.phone = normalizePartnerPhone(payload.phone)
  payload.address = String(payload.address || '').trim() || null
  payload.notes = String(payload.notes || '').trim() || null
  payload.isActive = toBoolean(payload.isActive, false)

  if (!payload.name) {
    throw new ValidationError({ name: { message: 'Name is required.' } })
  }
  if (!payload.email || !payload.email.includes('@')) {
    throw new ValidationError({ email: { message: 'A valid email is required so the partner can set a password.' } })
  }
  if (payload.phone.length !== 10) {
    throw new ValidationError({ phone: { message: 'Enter a 10-digit mobile number.' } })
  }

  delete payload.password
  delete payload.hasPassword
  request.payload = {
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    address: payload.address,
    notes: payload.notes,
    isActive: payload.isActive,
  }
  return request
}

export async function afterPartnerSave(response, request) {
  if (request.method !== 'post') return sanitizePartnerRecord(response)
  const id = response?.record?.id || response?.record?.params?.id
  if (!id) return sanitizePartnerRecord(response)
  try {
    const partner = await prisma.deliveryPartner.findUnique({ where: { id } })
    if (partner?.email && !partner.password) {
      await sendPartnerSetPasswordEmail(partner, { isReset: false })
    }
  } catch (error) {
    console.error('Failed to send partner password email:', error)
  }
  return sanitizePartnerRecord(response)
}

export function sanitizePartnerRecord(response) {
  const hidePassword = (record) => {
    if (!record?.params) return
    record.params.hasPassword = Boolean(record.params.password || record.params.hasPassword)
    delete record.params.password
  }
  hidePassword(response?.record)
  if (Array.isArray(response?.records)) response.records.forEach(hidePassword)
  return response
}

export async function sendPartnerPasswordAction(request, _response, context) {
  const partner = await prisma.deliveryPartner.findUnique({ where: { id: request.params.recordId } })
  if (!partner) throw new Error('Partner not found')
  await sendPartnerSetPasswordEmail(partner, { isReset: Boolean(partner.password) })
  return sanitizePartnerRecord({
    record: context.record.toJSON(context.currentAdmin),
    notice: {
      message: `Password email sent to ${partner.email}`,
      type: 'success',
    },
  })
}

export async function togglePartnerActiveAction(request, _response, context) {
  const partner = await prisma.deliveryPartner.findUnique({ where: { id: request.params.recordId } })
  if (!partner) throw new Error('Partner not found')
  const raw = request.payload?.isActive ?? request.payload?.record?.params?.isActive
  const next = raw === undefined ? !partner.isActive : toBoolean(raw)
  const updated = await prisma.deliveryPartner.update({
    where: { id: partner.id },
    data: { isActive: next },
  })
  return sanitizePartnerRecord({
    record: context.resource.build(updated).toJSON(context.currentAdmin),
    notice: {
      message: updated.isActive ? `${updated.name} can now log in.` : `${updated.name} is inactive.`,
      type: 'success',
    },
  })
}

export async function preparePincodePayload(request) {
  if (request.method !== 'post') return request
  const payload = { ...(request.payload || {}) }
  payload.pincode = String(payload.pincode || '').replace(/\D/g, '').slice(0, 6)
  payload.areaLabel = String(payload.areaLabel || '').trim() || null
  payload.city = String(payload.city || '').trim() || null
  payload.isActive = toBoolean(payload.isActive, true)
  const partnerRef = payload.partner ?? payload.partnerId
  payload.partnerId = partnerRef && partnerRef !== 'null' && partnerRef !== '' ? String(partnerRef) : null
  payload.partner = payload.partnerId

  const stateRef = payload.stateCode ?? payload.state
  payload.stateCode =
    stateRef && stateRef !== 'null' && stateRef !== ''
      ? String(stateRef).trim().toUpperCase()
      : null
  payload.state = payload.stateCode

  if (payload.pincode.length !== 6) {
    throw new ValidationError({ pincode: { message: 'Enter a 6-digit pincode.' } })
  }
  if (!payload.city) {
    throw new ValidationError({ city: { message: 'Enter the city for this pincode.' } })
  }
  if (!payload.stateCode) {
    throw new ValidationError({ state: { message: 'Select an Indian state.' } })
  }
  const state = await prisma.indiaState.findUnique({ where: { code: payload.stateCode } })
  if (!state) {
    throw new ValidationError({ state: { message: 'Select a valid Indian state.' } })
  }

  request.payload = {
    pincode: payload.pincode,
    areaLabel: payload.areaLabel,
    city: payload.city,
    stateCode: payload.stateCode,
    state: payload.stateCode,
    isActive: payload.isActive,
    partnerId: payload.partnerId,
    partner: payload.partnerId,
  }
  return request
}

export async function togglePincodeActiveAction(request, _response, context) {
  const row = await prisma.serviceablePincode.findUnique({ where: { id: request.params.recordId } })
  if (!row) throw new Error('Pincode not found')
  const raw = request.payload?.isActive ?? request.payload?.record?.params?.isActive
  const next = raw === undefined ? !row.isActive : toBoolean(raw)
  const updated = await prisma.serviceablePincode.update({
    where: { id: row.id },
    data: { isActive: next },
  })
  return {
    record: context.resource.build(updated).toJSON(context.currentAdmin),
    notice: {
      message: updated.isActive
        ? `${updated.pincode} is now serviceable.`
        : `${updated.pincode} is not delivering.`,
      type: 'success',
    },
  }
}

export async function collectCashAction(request, _response, context) {
  const order = await collectCashForOrder(request.params.recordId)
  return {
    record: context.resource.build(flattenOrder(order)).toJSON(context.currentAdmin),
    notice: { message: 'Cash marked as collected.', type: 'success' },
  }
}

export async function generateQrAction(request, _response, context) {
  const order = await createOrderPaymentQr(request.params.recordId)
  return {
    record: context.resource.build(flattenOrder(order)).toJSON(context.currentAdmin),
    notice: {
      message: order.razorpayQrUrl ? 'Payment QR is ready on the order.' : 'Payment link created.',
      type: 'success',
    },
  }
}
