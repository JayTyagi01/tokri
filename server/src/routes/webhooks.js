import { verifyRazorpayWebhook } from '../services/razorpay.js'
import { markOrderPaidByQr } from '../services/partnerOrders.js'
import { markOnlineOrderPaidFromWebhook } from '../services/checkout.js'

function extractOrderNo(payload) {
  const entity = payload?.payload?.payment_link?.entity || payload?.payload?.qr_code?.entity || {}
  const payment = payload?.payload?.payment?.entity || {}
  return (
    entity.notes?.orderNo ||
    payment.notes?.orderNo ||
    entity.reference_id ||
    null
  )
}

function extractPaymentId(payload) {
  return payload?.payload?.payment?.entity?.id || payload?.payload?.payment_link?.entity?.id || null
}

export async function handleRazorpayWebhook(req, res, next) {
  try {
    const raw = Buffer.isBuffer(req.body) ? req.body : Buffer.from(JSON.stringify(req.body || {}))
    await verifyRazorpayWebhook(raw, req.headers['x-razorpay-signature'])

    const payload = JSON.parse(raw.toString('utf8'))
    const event = String(payload?.event || '')
    const paidEvents = new Set([
      'payment_link.paid',
      'qr_code.credited',
      'payment.captured',
    ])
    if (!paidEvents.has(event)) {
      return res.json({ ok: true, ignored: event })
    }

    const orderNo = extractOrderNo(payload)
    const paymentId = extractPaymentId(payload)
    const razorpayOrderId = payload?.payload?.payment?.entity?.order_id || null

    if (event === 'payment.captured') {
      const marked = await markOnlineOrderPaidFromWebhook({ orderNo, razorpayOrderId, paymentId })
      if (!marked && orderNo) {
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
