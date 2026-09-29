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

async function razorpayFetch(path, { method = 'GET', body } = {}) {
  const { config } = await getClient()
  const response = await fetch(`https://api.razorpay.com/v1${path}`, {
    method,
    headers: {
      Authorization: `Basic ${Buffer.from(`${config.keyId}:${config.keySecret}`).toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    const rzp = payload?.error || {}
    const message =
      rzp.description ||
      rzp.reason ||
      rzp.code ||
      `Razorpay ${path} failed (${response.status}).`
    console.error('Razorpay API error:', {
      path,
      status: response.status,
      code: rzp.code,
      description: rzp.description,
      reason: rzp.reason,
      field: rzp.field,
      source: rzp.source,
      step: rzp.step,
    })
    throw Object.assign(new Error(message), {
      status: 400,
      razorpayStatus: response.status,
      razorpayCode: rzp.code || null,
    })
  }
  return payload
}

function extractIntentUrl(payload) {
  const urls = []
  const push = (value) => {
    if (typeof value === 'string' && value) urls.push(value)
  }
  push(payload?.link)
  push(payload?.intent_url)
  push(payload?.intent_uri)
  push(payload?.data?.intent_url)
  push(payload?.data?.link)
  if (Array.isArray(payload?.next)) {
    for (const step of payload.next) {
      push(step?.url)
      push(step?.intent_url)
      push(step?.link)
    }
  }
  return (
    urls.find((url) => /^(upi:|intent:|tez:|phonepe:|paytmmp:|gpay:|credpay:|amazonpay:)/i.test(url)) ||
    ''
  )
}

async function razorpayForm(path, fields) {
  const { config } = await getClient()
  const body = new URLSearchParams()
  for (const [key, value] of Object.entries(fields)) {
    if (value == null || value === '') continue
    body.append(key, String(value))
  }
  const response = await fetch(`https://api.razorpay.com/v1${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${config.keyId}:${config.keySecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    const rzp = payload?.error || {}
    const message =
      rzp.description ||
      rzp.reason ||
      rzp.code ||
      `Razorpay ${path} failed (${response.status}).`
    console.error('Razorpay form API error:', {
      path,
      status: response.status,
      code: rzp.code,
      description: rzp.description,
      reason: rzp.reason,
    })
    throw Object.assign(new Error(message), {
      status: 400,
      razorpayStatus: response.status,
      razorpayCode: rzp.code || null,
    })
  }
  return payload
}

export async function createUpiIntentPayment({
  orderId,
  amountPaise,
  contact,
  email,
  description,
  orderNo,
  ip,
  userAgent,
}) {
  const jsonBody = {
    amount: amountPaise,
    currency: 'INR',
    order_id: orderId,
    email,
    contact,
    method: 'upi',
    description,
    ip: ip || '127.0.0.1',
    referer: 'https://tokriii.com',
    user_agent: userAgent || 'Tokriii',
    upi: { flow: 'intent' },
    ...(orderNo ? { notes: { orderNo } } : {}),
  }

  let payload
  let lastError = null
  try {
    payload = await razorpayFetch('/payments/create/json', { method: 'POST', body: jsonBody })
  } catch (error) {
    lastError = error
    try {
      payload = await razorpayForm('/payments/create/upi', {
        amount: amountPaise,
        currency: 'INR',
        order_id: orderId,
        email,
        contact,
        method: 'upi',
        description,
        'upi[flow]': 'intent',
      })
    } catch (formError) {
      lastError = formError
      try {
        payload = await razorpayFetch('/payments/create/upi', { method: 'POST', body: jsonBody })
      } catch (thirdError) {
        throw lastError || thirdError
      }
    }
  }

  const intentUrl = extractIntentUrl(payload)
  const paymentId = payload.razorpay_payment_id || payload.id || ''
  if (!intentUrl || !paymentId) {
    console.error('Razorpay UPI intent response missing link:', {
      paymentId,
      keys: Object.keys(payload || {}),
      next: payload?.next,
      link: payload?.link,
      error: lastError?.message,
    })
    throw Object.assign(
      new Error(
        lastError?.message ||
          'UPI Intent is not enabled on this Razorpay account. Ask Razorpay support to enable S2S UPI Intent (POST /v1/payments/create/upi with upi.flow=intent).',
      ),
      { status: 400, razorpayStatus: lastError?.razorpayStatus, razorpayCode: lastError?.razorpayCode },
    )
  }
  return { paymentId, intentUrl }
}

export async function fetchRazorpayPayment(paymentId) {
  return razorpayFetch(`/payments/${encodeURIComponent(paymentId)}`)
}

export async function captureRazorpayPayment(paymentId, amountPaise, currency = 'INR') {
  return razorpayFetch(`/payments/${encodeURIComponent(paymentId)}/capture`, {
    method: 'POST',
    body: { amount: amountPaise, currency },
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
