import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma.js'
import { env } from '../config/env.js'
import { sendPartnerPasswordEmail } from './email.js'

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000

export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex')
}

export function generateResetToken() {
  return crypto.randomBytes(32).toString('hex')
}

export function partnerSetPasswordUrl(token) {
  return `${env.appUrl}${env.adminPath}/partner/set-password?token=${token}`
}

export function partnerForgotPasswordUrl() {
  return `${env.appUrl}${env.adminPath}/partner/forgot`
}

export async function sendPartnerSetPasswordEmail(partner, { isReset = false } = {}) {
  if (!partner?.email) {
    throw new Error('Partner must have an email address.')
  }

  const token = generateResetToken()
  const tokenHash = hashToken(token)

  await prisma.partnerPasswordToken.updateMany({
    where: { partnerId: partner.id, usedAt: null },
    data: { usedAt: new Date() },
  })

  await prisma.partnerPasswordToken.create({
    data: {
      partnerId: partner.id,
      tokenHash,
      expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
    },
  })

  const setUrl = partnerSetPasswordUrl(token)
  await sendPartnerPasswordEmail(partner, setUrl, {
    isReset,
    forgotUrl: partnerForgotPasswordUrl(),
  })
  return { email: partner.email }
}

export async function requestPartnerPasswordReset(email) {
  const partner = await prisma.deliveryPartner.findFirst({
    where: { email: String(email || '').trim().toLowerCase(), isActive: true },
  })
  if (!partner) return { ok: true }
  await sendPartnerSetPasswordEmail(partner, { isReset: true })
  return { ok: true }
}

export async function setPartnerPasswordWithToken(token, newPassword) {
  const tokenHash = hashToken(token)
  const record = await prisma.partnerPasswordToken.findFirst({
    where: {
      tokenHash,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    include: { partner: true },
  })

  if (!record?.partner) {
    throw new Error('Invalid or expired link')
  }

  const password = await bcrypt.hash(newPassword, 10)
  await prisma.$transaction([
    prisma.deliveryPartner.update({
      where: { id: record.partnerId },
      data: { password },
    }),
    prisma.partnerPasswordToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
  ])

  return { ok: true }
}
