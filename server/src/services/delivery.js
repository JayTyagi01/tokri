import { prisma } from '../lib/prisma.js'

export function normalizePincode(value) {
  return String(value || '').replace(/\D/g, '').slice(0, 6)
}

export function deliveryAvailability(row) {
  if (!row || !row.isActive) {
    return {
      serviceable: false,
      morning: { enabled: false, comingSoon: true },
      express: { enabled: false, comingSoon: true },
      defaultOption: null,
    }
  }

  const morningOn = Boolean(row.morningEnabled)
  const expressOn = Boolean(row.expressEnabled)
  return {
    serviceable: morningOn || expressOn,
    morning: { enabled: morningOn, comingSoon: !morningOn },
    express: { enabled: expressOn, comingSoon: !expressOn },
    defaultOption: morningOn ? 'morning' : expressOn ? 'express' : null,
  }
}

function emptyNetworkRow(pincode) {
  return {
    pincode,
    isActive: true,
    morningEnabled: true,
    expressEnabled: false,
    partner: null,
  }
}

export async function findServiceablePincode(pincode) {
  const code = normalizePincode(pincode)
  if (code.length !== 6) return null
  return prisma.serviceablePincode.findUnique({
    where: { pincode: code },
    include: { partner: true },
  })
}

export async function assertPincodeServiceable(pincode) {
  const code = normalizePincode(pincode)
  if (code.length !== 6) {
    throw Object.assign(new Error('Enter a valid 6-digit pincode.'), { status: 400 })
  }

  const total = await prisma.serviceablePincode.count()
  if (total === 0) return emptyNetworkRow(code)

  const row = await prisma.serviceablePincode.findUnique({
    where: { pincode: code },
    include: { partner: true },
  })
  const availability = deliveryAvailability(row)
  if (!availability.serviceable) {
    throw Object.assign(new Error("We don't deliver to this pincode yet."), { status: 400 })
  }
  return row
}

export async function assertDeliveryOptionEnabled(pincode, option) {
  const row = await assertPincodeServiceable(pincode)
  const availability = deliveryAvailability(row)
  const requested = String(option || '').toLowerCase()
  const chosen =
    requested === 'express' || requested === 'morning' ? requested : availability.defaultOption
  if (!chosen || !availability[chosen]?.enabled) {
    throw Object.assign(new Error('This delivery option is not available for your pincode yet.'), { status: 400 })
  }
  return { row, option: chosen, availability }
}

export function partnerSnapshot(partner) {
  if (!partner || !partner.isActive) return {}
  return {
    deliveryPartnerId: partner.id,
    deliveryPartnerName: partner.name,
    deliveryPartnerPhone: partner.phone,
    deliveryAssignedAt: new Date(),
  }
}

export async function serviceablePincodeSet(pincodes) {
  const codes = [...new Set((pincodes || []).map(normalizePincode).filter((code) => code.length === 6))]
  if (!codes.length) return new Set()
  const total = await prisma.serviceablePincode.count()
  if (total === 0) return new Set(codes)
  const rows = await prisma.serviceablePincode.findMany({
    where: { pincode: { in: codes }, isActive: true },
    select: { pincode: true, morningEnabled: true, expressEnabled: true },
  })
  return new Set(
    rows.filter((row) => row.morningEnabled || row.expressEnabled).map((row) => row.pincode),
  )
}

export async function deliveryOptionsByPincode(pincodes) {
  const codes = [...new Set((pincodes || []).map(normalizePincode).filter((code) => code.length === 6))]
  const map = new Map()
  if (!codes.length) return map

  const total = await prisma.serviceablePincode.count()
  if (total === 0) {
    for (const code of codes) map.set(code, deliveryAvailability(emptyNetworkRow(code)))
    return map
  }

  const rows = await prisma.serviceablePincode.findMany({
    where: { pincode: { in: codes } },
    select: { pincode: true, isActive: true, morningEnabled: true, expressEnabled: true },
  })
  const byCode = new Map(rows.map((row) => [row.pincode, row]))
  for (const code of codes) {
    map.set(code, deliveryAvailability(byCode.get(code) || null))
  }
  return map
}

export async function assignmentForPincode(pincode) {
  const row = await assertPincodeServiceable(pincode)
  return {
    deliveryPincode: row.pincode,
    ...partnerSnapshot(row.partner),
  }
}
