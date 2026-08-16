import crypto from 'crypto'
import { env } from '../config/env.js'

function toBase64Url(value) {
  const buffer = Buffer.isBuffer(value) ? value : Buffer.from(value)
  return buffer.toString('base64url')
}

function sign(input, secret) {
  return toBase64Url(crypto.createHmac('sha256', secret).update(input).digest())
}

export function signCustomerToken(user) {
  const header = toBase64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const now = Math.floor(Date.now() / 1000)
  const payload = toBase64Url(
    JSON.stringify({
      sub: user.id,
      phone: user.phone,
      role: user.role || 'customer',
      iat: now,
      exp: now + env.jwtExpiresInSeconds,
    }),
  )
  const signingInput = `${header}.${payload}`
  return `${signingInput}.${sign(signingInput, env.jwtSecret)}`
}

export function verifyCustomerToken(token) {
  const parts = String(token || '').split('.')
  if (parts.length !== 3) {
    throw Object.assign(new Error('Invalid session. Please log in again.'), { status: 401 })
  }

  const [header, payload, signature] = parts
  const signingInput = `${header}.${payload}`
  const expected = sign(signingInput, env.jwtSecret)
  const actualBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expected)

  if (actualBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(actualBuffer, expectedBuffer)) {
    throw Object.assign(new Error('Invalid session. Please log in again.'), { status: 401 })
  }

  let data
  try {
    data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
  } catch {
    throw Object.assign(new Error('Invalid session. Please log in again.'), { status: 401 })
  }

  if (!data?.sub || !data?.exp || data.exp * 1000 < Date.now()) {
    throw Object.assign(new Error('Session expired. Please log in again.'), { status: 401 })
  }

  return data
}

export function formatAuthUser(user) {
  return {
    id: user.id,
    phone: user.phone,
    name: user.name || null,
  }
}
