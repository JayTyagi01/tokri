import { prisma } from '../lib/prisma.js'

export function normalizePincode(value) {
  return String(value || '').replace(/\D/g, '').slice(0, 6)
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
  if (total === 0) return { pincode: code, isActive: true, partner: null }

  const row = await prisma.serviceablePincode.findUnique({
    where: { pincode: code },
    include: { partner: true },
  })
  if (!row || !row.isActive) {
    throw Object.assign(new Error("We don't deliver to this pincode yet."), { status: 400 })
  }
  return row
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
    select: { pincode: true },
  })
  return new Set(rows.map((row) => row.pincode))
}

export async function assignmentForPincode(pincode) {
  const row = await assertPincodeServiceable(pincode)
  return {
    deliveryPincode: row.pincode,
    ...partnerSnapshot(row.partner),
  }
}
