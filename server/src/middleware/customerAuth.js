import { prisma } from '../lib/prisma.js'
import { normalizePhone } from '../services/addresses.js'

export async function requireCustomer(req, res, next) {
  try {
    const phone = normalizePhone(req.headers['x-user-phone'])
    if (!phone) {
      return res.status(401).json({ message: 'Please log in to continue.' })
    }

    const user = await prisma.user.findFirst({
      where: { phone, isActive: true },
    })

    if (!user) {
      return res.status(401).json({ message: 'Please log in to continue.' })
    }

    req.customer = user
    return next()
  } catch (error) {
    return next(error)
  }
}
