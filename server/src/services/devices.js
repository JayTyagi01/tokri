import { prisma } from '../lib/prisma.js'

const PLATFORMS = new Set(['ios', 'android', 'web'])
const PROVIDERS = new Set(['expo', 'fcm', 'apns'])

function httpError(message, status = 400) {
  return Object.assign(new Error(message), { status })
}

function formatDevice(device) {
  return {
    id: device.id,
    platform: device.platform,
    provider: device.provider,
  }
}

function sanitizeToken(raw) {
  const token = String(raw || '').trim()
  if (token.length < 10 || token.length > 4096) {
    throw httpError('A valid device token is required.')
  }
  return token
}

export async function registerDevice(customerId, { token, platform, provider = 'expo' }) {
  const safeToken = sanitizeToken(token)
  const safePlatform = String(platform || '').toLowerCase()
  const safeProvider = String(provider || 'expo').toLowerCase()

  if (!PLATFORMS.has(safePlatform)) {
    throw httpError('Platform must be ios, android, or web.')
  }
  if (!PROVIDERS.has(safeProvider)) {
    throw httpError('Provider must be expo, fcm, or apns.')
  }

  const device = await prisma.deviceToken.findUnique({ where: { token: safeToken } })
  if (device) {
    return formatDevice(
      await prisma.deviceToken.update({
        where: { token: safeToken },
        data: {
          customerId,
          platform: safePlatform,
          provider: safeProvider,
        },
      }),
    )
  }

  const created = await prisma.deviceToken.create({
    data: {
      customerId,
      token: safeToken,
      platform: safePlatform,
      provider: safeProvider,
    },
  })

  return formatDevice(created)
}

export async function unregisterDevice(customerId, token) {
  const safeToken = sanitizeToken(token)
  await prisma.deviceToken.deleteMany({
    where: { customerId, token: safeToken },
  })
  return { ok: true }
}

export async function listUserDeviceTokens(customerId) {
  return prisma.deviceToken.findMany({
    where: { customerId },
    select: { token: true, platform: true, provider: true },
  })
}

export async function deleteDeviceTokens(tokens) {
  if (!tokens.length) return
  await prisma.deviceToken.deleteMany({
    where: { token: { in: tokens } },
  })
}
