import { prisma } from '../lib/prisma.js'
import { verifyPartnerToken } from '../services/jwt.js'

function readBearerToken(req) {
  const header = String(req.headers.authorization || '')
  if (header.toLowerCase().startsWith('bearer ')) return header.slice(7).trim()
  return ''
}

export async function requirePartner(req, res, next) {
  try {
    const bearer = readBearerToken(req)
    if (!bearer) {
      return res.status(401).json({ message: 'Please log in to continue.' })
    }
    const payload = verifyPartnerToken(bearer)
    const partner = await prisma.deliveryPartner.findFirst({
      where: { id: payload.sub, isActive: true },
    })
    if (!partner) {
      return res.status(401).json({ message: 'This partner account is not activated.' })
    }
    req.partner = partner
    return next()
  } catch (error) {
    return next(error)
  }
}
