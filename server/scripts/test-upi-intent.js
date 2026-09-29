/**
 * Local-only: call Razorpay UPI Intent and print the real error/code.
 *
 * Usage:
 *   RAZORPAY_KEY_ID=rzp_live_xxx RAZORPAY_KEY_SECRET=xxx node scripts/test-upi-intent.js
 *
 * Optional:
 *   AMOUNT_PAISE=100 CONTACT=9876543210
 */

const keyId = process.env.RAZORPAY_KEY_ID || ''
const keySecret = process.env.RAZORPAY_KEY_SECRET || ''
const amountPaise = Number(process.env.AMOUNT_PAISE || 100)
const contact = String(process.env.CONTACT || '9876543210').replace(/\D/g, '').slice(-10)
const email = process.env.EMAIL || `pay.${contact}@tokriii.com`

if (!keyId || !keySecret) {
  console.error(`
Missing keys.

Run:
  RAZORPAY_KEY_ID=rzp_live_xxx RAZORPAY_KEY_SECRET=xxx node scripts/test-upi-intent.js
`)
  process.exit(1)
}

const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64')

async function razorpay(path, { method = 'GET', body, form } = {}) {
  const headers = { Authorization: `Basic ${auth}` }
  let payloadBody
  if (form) {
    headers['Content-Type'] = 'application/x-www-form-urlencoded'
    payloadBody = new URLSearchParams(form).toString()
  } else if (body) {
    headers['Content-Type'] = 'application/json'
    payloadBody = JSON.stringify(body)
  }

  const response = await fetch(`https://api.razorpay.com/v1${path}`, {
    method,
    headers,
    body: payloadBody,
  })
  const text = await response.text()
  let json = {}
  try {
    json = JSON.parse(text)
  } catch {
    json = { raw: text }
  }
  return { ok: response.ok, status: response.status, json }
}

function printResult(label, result) {
  console.log(`\n=== ${label} ===`)
  console.log('HTTP status:', result.status)
  console.log(JSON.stringify(result.json, null, 2))
  const err = result.json?.error
  if (err) {
    console.log('\nRazorpay error fields to send to support:')
    console.log('  code       :', err.code || '(none)')
    console.log('  description:', err.description || '(none)')
    console.log('  reason     :', err.reason || '(none)')
    console.log('  field      :', err.field || '(none)')
    console.log('  source     :', err.source || '(none)')
    console.log('  step       :', err.step || '(none)')
  }
}

console.log('Key ID:', keyId)
console.log('Amount (paise):', amountPaise)
console.log('Contact:', contact)

const order = await razorpay('/orders', {
  method: 'POST',
  body: {
    amount: amountPaise,
    currency: 'INR',
    receipt: `local_upi_${Date.now()}`,
    notes: { purpose: 'local-upi-intent-test' },
  },
})
printResult('1) Create order', order)
if (!order.ok) process.exit(1)

const orderId = order.json.id
const intentBody = {
  amount: amountPaise,
  currency: 'INR',
  order_id: orderId,
  email,
  contact,
  method: 'upi',
  ip: '127.0.0.1',
  referer: 'https://tokriii.com',
  user_agent: 'TokriiiLocalTest/1.0',
  description: 'Local UPI intent test',
  notes: { purpose: 'local-upi-intent-test' },
  upi: { flow: 'intent' },
}

const jsonIntent = await razorpay('/payments/create/json', {
  method: 'POST',
  body: intentBody,
})
printResult('2) POST /payments/create/json (upi.flow=intent)', jsonIntent)

const upiJson = await razorpay('/payments/create/upi', {
  method: 'POST',
  body: intentBody,
})
printResult('3) POST /payments/create/upi JSON (upi.flow=intent)', upiJson)

const upiForm = await razorpay('/payments/create/upi', {
  method: 'POST',
  form: {
    amount: amountPaise,
    currency: 'INR',
    order_id: orderId,
    email,
    contact,
    method: 'upi',
    description: 'Local UPI intent test',
    'upi[flow]': 'intent',
  },
})
printResult('4) POST /payments/create/upi form (upi[flow]=intent)', upiForm)

const winners = [jsonIntent, upiJson, upiForm].filter((row) => {
  const link = row.json?.link || row.json?.intent_url || ''
  return row.ok && /^upi:|^intent:/i.test(link)
})

console.log('\n=== RESULT ===')
if (winners.length) {
  console.log('SUCCESS: got UPI intent link')
  console.log(winners[0].json.link || winners[0].json.intent_url)
} else {
  console.log('FAILED: no upi:// link returned.')
  console.log('Copy the error code + description from the sections above and send to Razorpay Support.')
  console.log('Ask them to enable S2S UPI Intent for this merchant / live key.')
}
