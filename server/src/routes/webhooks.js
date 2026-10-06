import { verifyRazorpayWebhook } from '../services/razorpay.js'
import { markOrderPaidByQr } from '../services/partnerOrders.js'
import { markOnlineOrderPaidFromWebhook, reconcileOnlineOrderFromRazorpay } from '../services/checkout.js'
import { prisma } from '../lib/prisma.js'

function extractOrderNo(payload) {
  const payment = payload?.payload?.payment?.entity || {}
  const paymentLink = payload?.payload?.payment_link?.entity || {}
  const qr = payload?.payload?.qr_code?.entity || {}
  const order = payload?.payload?.order?.entity || {}
  return (
    payment.notes?.orderNo ||
    order.notes?.orderNo ||
    paymentLink.notes?.orderNo ||
    qr.notes?.orderNo ||
    order.receipt ||
    paymentLink.reference_id ||
    null
  )
}

function extractPaymentId(payload) {
  return payload?.payload?.payment?.entity?.id || payload?.payload?.payment_link?.entity?.id || null
}

function extractRazorpayOrderId(payload) {
  return payload?.payload?.payment?.entity?.order_id || payload?.payload?.order?.entity?.id || null
}

const PAID_EVENTS = new Set([
  'payment.captured',
  'payment.authorized',
  'order.paid',
  'payment_link.paid',
  'qr_code.credited',
])

export async function handleRazorpayWebhook(req, res, next) {
  try {
    const raw = Buffer.isBuffer(req.body) ? req.body : Buffer.from(JSON.stringify(req.body || {}))
    await verifyRazorpayWebhook(raw, req.headers['x-razorpay-signature'])

    const payload = JSON.parse(raw.toString('utf8'))
    const event = String(payload?.event || '')
    if (!PAID_EVENTS.has(event)) {
      return res.json({ ok: true, ignored: event })
    }

    const orderNo = extractOrderNo(payload)
    const paymentId = extractPaymentId(payload)
    const razorpayOrderId = extractRazorpayOrderId(payload)

    if (event === 'payment.captured' || event === 'payment.authorized' || event === 'order.paid') {
      let marked = null
      if (event === 'payment.captured') {
        marked = await markOnlineOrderPaidFromWebhook({ orderNo, razorpayOrderId, paymentId })
      }
      if (!marked && razorpayOrderId) {
        const order = await prisma.order.findFirst({ where: { razorpayOrderId } })
        if (order) {
          const result = await reconcileOnlineOrderFromRazorpay(order)
          marked = result.status === 'paid' ? result.order : null
        }
      }
      if (!marked && orderNo && event === 'payment.captured') {
        await markOrderPaidByQr({ orderNo, paymentId })
      }
    } else {
      await markOrderPaidByQr({ orderNo, paymentId })
    }

    res.json({ ok: true })
  } catch (error) {
    next(error)
  }
}
