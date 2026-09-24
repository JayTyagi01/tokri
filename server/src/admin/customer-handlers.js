import { ValidationError } from 'adminjs'
import { prisma } from '../lib/prisma.js'

function toBoolean(value, fallback = true) {
  if (value === undefined || value === null || value === '') return fallback
  return value === true || value === 'true' || value === 'on' || value === 1 || value === '1'
}

function emptyToNull(value) {
  const text = String(value || '').trim()
  return text || null
}

export async function attachCustomerAddresses(response, request) {
  if (request.method !== 'get' && request.method !== 'post') return response
  const id = response?.record?.id || response?.record?.params?.id
  if (!id || !response?.record?.params) return response
  const customer = await prisma.customer.findUnique({
    where: { id },
    select: { addresses: true },
  })
  response.record.params.addresses = customer?.addresses || []
  return response
}

export async function prepareCustomerPayload(request) {
  if (request.method !== 'post') return request
  const payload = { ...(request.payload || {}) }
  const name = String(payload.name || '').trim()
  const dateOfBirth = emptyToNull(payload.dateOfBirth)

  if (dateOfBirth && Number.isNaN(new Date(dateOfBirth).getTime())) {
    throw new ValidationError({ dateOfBirth: { message: 'Enter a valid date of birth.' } })
  }

  request.payload = {
    name: name || null,
    dateOfBirth,
    isActive: toBoolean(payload.isActive, true),
  }
  return request
}

export async function toggleCustomerActiveAction(request, _response, context) {
  const customer = await prisma.customer.findUnique({ where: { id: request.params.recordId } })
  if (!customer) throw new Error('Customer not found')
  const raw = request.payload?.isActive ?? request.payload?.record?.params?.isActive
  const next = raw === undefined ? !customer.isActive : toBoolean(raw)
  const updated = await prisma.customer.update({
    where: { id: customer.id },
    data: { isActive: next },
  })
  const label = updated.name || updated.phone
  return {
    record: context.resource.build(updated).toJSON(context.currentAdmin),
    notice: {
      message: updated.isActive ? `${label} can log in.` : `${label} is inactive.`,
      type: 'success',
    },
  }
}
