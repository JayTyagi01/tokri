import crypto from 'crypto'
import { prisma } from '../lib/prisma.js'
import { sendOtpMessage } from './twilio.js'

const OTP_TTL_MS = 10 * 60 * 1000
const MAX_ATTEMPTS = 5
const RESEND_COOLDOWN_MS = 60 * 1000

function normalizePhone(value) {
  const digits = String(value || '').replace(/\D/g, '')
  if (digits.length === 10) return digits
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2)
  return null
}

function hashCode(phone, code) {
  return crypto.createHash('sha256').update(`${phone}:${code}`).digest('hex')
}

function generateCode() {
  return String(Math.floor(1000 + Math.random() * 9000))
}

export async function requestOtp(rawPhone) {
  const phone = normalizePhone(rawPhone)
  if (!phone) {
    throw Object.assign(new Error('Please enter a valid 10-digit mobile number.'), { status: 400 })
  }

  const recent = await prisma.otpRequest.findFirst({
    where: { phone },
    orderBy: { createdAt: 'desc' },
  })

  if (recent && Date.now() - recent.createdAt.getTime() < RESEND_COOLDOWN_MS) {
    throw Object.assign(new Error('Please wait a minute before requesting another OTP.'), { status: 429 })
  }

  const code = generateCode()
  const expiresAt = new Date(Date.now() + OTP_TTL_MS)

  await prisma.otpRequest.create({
    data: {
      phone,
      codeHash: hashCode(phone, code),
      expiresAt,
    },
  })

  const delivery = await sendOtpMessage(phone, code)

  return {
    phone,
    expiresInSeconds: OTP_TTL_MS / 1000,
    channel: delivery.channel,
  }
}

export async function verifyOtp(rawPhone, rawCode) {
  const phone = normalizePhone(rawPhone)
  const code = String(rawCode || '').trim()

  if (!phone) {
    throw Object.assign(new Error('Please enter a valid 10-digit mobile number.'), { status: 400 })
  }

  if (!/^\d{4}$/.test(code)) {
    throw Object.assign(new Error('Please enter the 4-digit OTP.'), { status: 400 })
  }

  const record = await prisma.otpRequest.findFirst({
    where: { phone },
    orderBy: { createdAt: 'desc' },
  })

  if (!record) {
    throw Object.assign(new Error('OTP expired or not found. Please request a new one.'), { status: 400 })
  }

  if (record.expiresAt.getTime() < Date.now()) {
    throw Object.assign(new Error('OTP has expired. Please request a new one.'), { status: 400 })
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    throw Object.assign(new Error('Too many incorrect attempts. Please request a new OTP.'), { status: 429 })
  }

  const isValid = record.codeHash === hashCode(phone, code)

  if (!isValid) {
    await prisma.otpRequest.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    })
    throw Object.assign(new Error('Incorrect OTP. Please try again.'), { status: 400 })
  }

  let user = await prisma.user.findFirst({ where: { phone } })

  if (!user) {
    user = await prisma.user.create({
      data: {
        phone,
        role: 'customer',
        isActive: true,
      },
    })
  } else if (!user.isActive) {
    throw Object.assign(new Error('This account is inactive. Please contact support.'), { status: 403 })
  }

  return {
    user: {
      id: user.id,
      phone: user.phone,
      name: user.name,
    },
  }
}
