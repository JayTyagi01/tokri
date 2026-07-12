import Razorpay from 'razorpay'
import crypto from 'crypto'
import { getRazorpaySettings } from '../utils/razorpaySettings.js'

async function getClient() {
  const config = await getRazorpaySettings()
  if (!config.enabled || !config.keyId || !config.keySecret) {
    throw Object.assign(new Error('Razorpay is not configured. Enable it in admin settings.'), {
      status: 400,
      code: 'RAZORPAY_NOT_CONFIGURED',
    })
  }
  return {
    client: new Razorpay({ key_id: config.keyId, key_secret: config.keySecret }),
    config,
  }
}

export async function getPublicPaymentConfig() {
  const config = await getRazorpaySettings()
  return {
    razorpay: {
      enabled: config.enabled && Boolean(config.keyId && config.keySecret),
      keyId: config.enabled ? config.keyId : '',
    },
  }
}

export async function createRazorpayOrder({ amountInr, receipt, notes = {} }) {
  const { client } = await getClient()
  const amountPaise = Math.round(Number(amountInr) * 100)

  if (amountPaise < 100) {
    throw Object.assign(new Error('Order total must be at least ₹1.'), { status: 400 })
  }

  return client.orders.create({
    amount: amountPaise,
    currency: 'INR',
    receipt,
    notes,
  })
}

export async function verifyRazorpayPayment({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
  const { config } = await getClient()
  const expected = crypto
    .createHmac('sha256', config.keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex')

  if (expected !== razorpaySignature) {
    throw Object.assign(new Error('Payment verification failed.'), { status: 400 })
  }

  return true
}
