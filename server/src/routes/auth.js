import { Router } from 'express'
import { env } from '../config/env.js'
import { requireCustomer } from '../middleware/customerAuth.js'
import { requestOtp, verifyOtp } from '../services/otp.js'
import { formatAuthUser } from '../services/jwt.js'
import { unregisterDevice } from '../services/devices.js'

const router = Router()

router.post('/send-otp', async (req, res, next) => {
  try {
    const result = await requestOtp(req.body?.phone)
    res.json({
      ok: true,
      message: 'OTP sent successfully.',
      ...result,
    })
  } catch (error) {
    next(error)
  }
})

router.post('/verify-otp', async (req, res, next) => {
  try {
    const result = await verifyOtp(req.body?.phone, req.body?.otp)
    res.json({
      ok: true,
      message: 'Login successful.',
      ...result,
    })
  } catch (error) {
    next(error)
  }
})

router.get('/me', requireCustomer, (req, res) => {
  res.json({
    user: formatAuthUser(req.customer),
    expiresIn: env.jwtExpiresInSeconds,
  })
})

router.post('/logout', requireCustomer, async (req, res, next) => {
  try {
    if (req.body?.token) {
      await unregisterDevice(req.customer.id, req.body.token)
    }
    res.json({ ok: true })
  } catch (error) {
    next(error)
  }
})

export default router
