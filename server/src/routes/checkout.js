import { Router } from 'express'
import { prisma } from '../lib/prisma.js'
import { optionalCustomer, requireCustomer } from '../middleware/customerAuth.js'
import {
  confirmCheckoutPayment,
  confirmCodOrder,
  createCheckoutOrder,
  getCheckoutConfig,
} from '../services/checkout.js'
import { previewCoupon } from '../services/coupons.js'
import { PRODUCT_CATEGORY_INCLUDE } from '../utils/catalog.js'

const router = Router()

async function resolvePreviewItems(rawItems) {
  const list = Array.isArray(rawItems) ? rawItems : []
  const slugs = list
    .map((item) => String(item?.slug || item?.id || '').trim())
    .filter(Boolean)
  if (!slugs.length) {
    throw Object.assign(new Error('Add items to your cart before applying a coupon.'), { status: 400 })
  }

  const products = await prisma.product.findMany({
    where: { slug: { in: slugs }, isActive: true },
    include: PRODUCT_CATEGORY_INCLUDE,
  })
  const productMap = new Map(products.map((product) => [product.slug, product]))
  const items = []

  for (const raw of list) {
    const slug = String(raw?.slug || raw?.id || '').trim()
    const product = productMap.get(slug)
    if (!product) continue
    items.push({
      slug: product.slug,
      quantity: Math.max(1, Number(raw?.quantity) || 1),
      priceValue: Number(product.priceValue),
      category: product.category,
      categories: (product.categoryLinks || []).map((row) => row.category).filter(Boolean),
    })
  }

  if (!items.length) {
    throw Object.assign(new Error('Your cart items are no longer available.'), { status: 400 })
  }

  return items
}

router.get('/config', async (_req, res, next) => {
  try {
    const config = await getCheckoutConfig()
    res.json(config)
  } catch (error) {
    next(error)
  }
})

router.post('/preview-coupon', optionalCustomer, async (req, res, next) => {
  try {
    const items = await resolvePreviewItems(req.body?.items)
    const result = await previewCoupon({
      code: req.body?.code,
      items,
      customerId: req.customer?.id || null,
    })
    res.json({ coupon: result.preview, totals: result.totals })
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
