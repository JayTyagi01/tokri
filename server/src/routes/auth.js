import { Router } from 'express'
import { requestOtp, verifyOtp } from '../services/otp.js'

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

export default router
