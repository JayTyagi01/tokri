import { Router } from 'express'
import { requireCustomer } from '../middleware/customerAuth.js'
import {
  confirmCheckoutPayment,
  confirmCodOrder,
  createCheckoutOrder,
  getCheckoutConfig,
} from '../services/checkout.js'

const router = Router()

router.get('/config', async (_req, res, next) => {
  try {
    const config = await getCheckoutConfig()
    res.json(config)
  } catch (error) {
    next(error)
  }
})

router.use(requireCustomer)

router.post('/create-order', async (req, res, next) => {
  try {
    const result = await createCheckoutOrder(req.customer, req.body)
    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
})

router.post('/verify-payment', async (req, res, next) => {
  try {
    const result = await confirmCheckoutPayment(req.customer, req.body)
    res.json({ ok: true, ...result })
  } catch (error) {
    next(error)
  }
})

router.post('/confirm-cod', async (req, res, next) => {
  try {
    const result = await confirmCodOrder(req.customer, req.body)
    res.json({ ok: true, ...result })
  } catch (error) {
    next(error)
  }
})

export default router
