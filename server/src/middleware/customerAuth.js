import { prisma } from '../lib/prisma.js'
import { normalizePhone } from '../services/addresses.js'
import { verifyCustomerToken } from '../services/jwt.js'

function readBearerToken(req) {
  const header = String(req.headers.authorization || '')
  if (header.toLowerCase().startsWith('bearer ')) {
    return header.slice(7).trim()
  }
  return ''
}

export async function resolveCustomer(req) {
  const bearer = readBearerToken(req)
  if (bearer) {
    const payload = verifyCustomerToken(bearer)
    const user = await prisma.user.findFirst({
      where: { id: payload.sub, isActive: true },
    })
    if (!user) {
      throw Object.assign(new Error('Please log in to continue.'), { status: 401 })
    }
    return user
  }

  const phone = normalizePhone(req.headers['x-user-phone'])
  if (!phone) return null

  const user = await prisma.user.findFirst({
    where: { phone, isActive: true },
  })
  return user || null
}

export async function requireCustomer(req, res, next) {
  try {
    const user = await resolveCustomer(req)
    if (!user) {
      return res.status(401).json({ message: 'Please log in to continue.' })
    }
    req.customer = user
    return next()
  } catch (error) {
    return next(error)
  }
}

export async function optionalCustomer(req, _res, next) {
  try {
    req.customer = await resolveCustomer(req)
  } catch {
    req.customer = null
  }
  return next()
}
