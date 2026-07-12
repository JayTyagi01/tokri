import { Router } from 'express'
import { requireCustomer } from '../middleware/customerAuth.js'
import {
  createAddress,
  deleteAddress,
  listAddresses,
  updateAddress,
} from '../services/addresses.js'
import { getCustomerOrder, listCustomerOrders } from '../services/customerOrders.js'

const router = Router()

router.use(requireCustomer)

router.get('/addresses', async (req, res, next) => {
  try {
    const addresses = await listAddresses(req.customer.id)
    res.json({ addresses })
  } catch (error) {
    next(error)
  }
})

router.post('/addresses', async (req, res, next) => {
  try {
    const address = await createAddress(req.customer.id, req.body)
    res.status(201).json({ address })
  } catch (error) {
    next(error)
  }
})

router.put('/addresses/:id', async (req, res, next) => {
  try {
    const address = await updateAddress(req.customer.id, req.params.id, req.body)
    res.json({ address })
  } catch (error) {
    next(error)
  }
})

router.delete('/addresses/:id', async (req, res, next) => {
  try {
    await deleteAddress(req.customer.id, req.params.id)
    res.json({ ok: true })
  } catch (error) {
    next(error)
  }
})

router.get('/orders', async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1
    const perPage = Number(req.query.perPage) || 10
    const result = await listCustomerOrders(req.customer.id, { page, perPage })
    res.json(result)
  } catch (error) {
    next(error)
  }
})

router.get('/orders/:orderNo', async (req, res, next) => {
  try {
    const order = await getCustomerOrder(req.customer.id, req.params.orderNo)
    res.json({ order })
  } catch (error) {
    next(error)
  }
})

export default router
