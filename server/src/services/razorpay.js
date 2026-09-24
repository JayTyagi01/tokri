import Razorpay from 'razorpay'
import crypto from 'crypto'
import { getRazorpaySettings } from '../utils/razorpaySettings.js'
import { prisma } from '../lib/prisma.js'

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
  const [config, settings] = await Promise.all([
    getRazorpaySettings(),
    prisma.setting.findUnique({ where: { id: 1 }, select: { codEnabled: true } }),
  ])
  return {
    razorpay: {
      enabled: config.enabled && Boolean(config.keyId && config.keySecret),
      keyId: config.enabled ? config.keyId : '',
    },
    codEnabled: settings?.codEnabled !== false,
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

export async function createOrderPaymentLink({ amountInr, orderNo, customer = {} }) {
  const { client } = await getClient()
  const amountPaise = Math.round(Number(amountInr) * 100)
  if (amountPaise < 100) {
    throw Object.assign(new Error('Order total must be at least ₹1.'), { status: 400 })
  }

  const link = await client.paymentLink.create({
    amount: amountPaise,
    currency: 'INR',
    accept_partial: false,
    reference_id: String(orderNo).slice(0, 40),
    description: `Tokriii order ${orderNo}`,
    customer: {
      name: customer.name || 'Customer',
      contact: customer.phone || undefined,
    },
    notify: { sms: false, email: false },
    reminder_enable: false,
    notes: { orderNo },
  })

  const shortUrl = link.short_url || ''
  return {
    id: link.id,
    shortUrl,
    qrUrl: shortUrl
      ? `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(shortUrl)}`
      : '',
  }
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

export async function verifyRazorpayWebhook(rawBody, signature) {
  const config = await getRazorpaySettings()
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || config.keySecret
  if (!secret) {
    throw Object.assign(new Error('Razorpay webhook secret is not configured.'), { status: 400 })
  }
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
  const actualBuffer = Buffer.from(String(signature || ''))
  const expectedBuffer = Buffer.from(expected)
  if (
    actualBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(actualBuffer, expectedBuffer)
  ) {
    throw Object.assign(new Error('Invalid webhook signature.'), { status: 400 })
  }
  return true
}
