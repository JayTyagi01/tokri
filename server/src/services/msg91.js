import { getMsg91Settings } from '../utils/msg91Settings.js'

const MSG91_FLOW_URL = 'https://api.msg91.com/api/v5/flow/'
const MSG91_SMS_URL = 'https://api.msg91.com/api/v2/sendsms'
const MSG91_WHATSAPP_URL =
  'https://control.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/'

// Exact Airtel DLT bodies. {#numeric#} / {#alphanumeric#} are filled here.
function buildOtpSms(code) {
  return `Use OTP ${code} to login to your Tokriii (M Mahajan Trading Pvt Ltd) account. Valid for 15 minutes. Do not share this OTP with anyone.`
}

function buildOrderSms(orderNo) {
  return `Order Confirmed! Your Tokriii (M Mahajan Trading Pvt Ltd) order ${orderNo} has been received. Delivery partner: Assigned shortly. You can track your order status from the Orders section in the app.`
}

function isDltTemplateId(value) {
  return /^\d{16,20}$/.test(String(value || '').trim())
}

function formatAmount(value) {
  const amount = Number(value || 0)
  return Number.isInteger(amount) ? String(amount) : amount.toFixed(2)
}

function toMsg91Mobile(value) {
  const digits = String(value || '').replace(/\D/g, '')
  if (!digits) return null
  if (digits.length === 10) return `91${digits}`
  return digits
}

async function postToMsg91(url, authKey, payload, label) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authkey: authKey,
    },
    body: JSON.stringify(payload),
  })

  const result = await response.json().catch(() => ({}))
  const flagged = [result?.type, result?.status].some(
    (value) => String(value).toLowerCase() === 'error',
  )

  if (!response.ok || flagged) {
    const reason =
      typeof result?.message === 'string' && result.message
        ? result.message
        : `MSG91 rejected the ${label} request (HTTP ${response.status}).`
    throw new Error(reason)
  }

  return result
}

// Flow variable names come from the approved DLT template and are case sensitive,
// so every value is sent under its readable name plus a VAR1..VARn alias.
// MSG91 ignores keys the template does not declare.
function buildSmsRecipient(mobiles, variables) {
  const recipient = { mobiles }
  let position = 0

  for (const [key, value] of Object.entries(variables)) {
    if (value === undefined || value === null || value === '') continue
    position += 1
    recipient[key] = String(value)
    recipient[`VAR${position}`] = String(value)
  }

  return recipient
}

async function sendSms({ config, mobiles, templateId, variables, message, label }) {
  const id = String(templateId || '').trim()

  // 19-digit Airtel DLT ids are not MSG91 flow ids. Send the approved body
  // through the SMS API with DLT_TE_ID so the admin values already entered work.
  if (isDltTemplateId(id) && message) {
    const payload = {
      route: '4',
      country: '91',
      DLT_TE_ID: id,
      sms: [{ message, to: [mobiles] }],
    }
    if (config.senderId) payload.sender = config.senderId

    const result = await postToMsg91(MSG91_SMS_URL, config.authKey, payload, label)
    return { channel: 'sms', sent: true, requestId: result?.request_id || null }
  }

  // MSG91 renamed flows to templates part way through v5, so the id is sent under
  // both names to work regardless of which the account expects.
  const payload = {
    template_id: id,
    flow_id: id,
    short_url: '0',
    recipients: [buildSmsRecipient(mobiles, variables)],
  }

  if (config.senderId) {
    payload.sender = config.senderId
  }

  const result = await postToMsg91(MSG91_FLOW_URL, config.authKey, payload, label)
  return { channel: 'sms', sent: true, requestId: result?.request_id || null }
}

// WhatsApp templates take positional body variables, so values map to body_1..body_n.
// Authentication templates additionally echo the code into a copy-code button.
function buildWhatsappComponents(values, otpButtonValue) {
  const components = {}

  values
    .filter((value) => value !== undefined && value !== null && value !== '')
    .forEach((value, index) => {
      components[`body_${index + 1}`] = { type: 'text', value: String(value) }
    })

  if (otpButtonValue) {
    components.button_1 = { subtype: 'url', type: 'text', value: String(otpButtonValue) }
  }

  return components
}

async function sendWhatsapp({ config, mobiles, templateName, values, otpValue, label }) {
  const template = {
    name: templateName,
    language: { code: config.whatsappLanguage || 'en', policy: 'deterministic' },
    to_and_components: [
      {
        to: [mobiles],
        components: buildWhatsappComponents(
          values,
          config.whatsappOtpButton ? otpValue : null,
        ),
      },
    ],
  }

  if (config.whatsappNamespace) {
    template.namespace = config.whatsappNamespace
  }

  const payload = {
    integrated_number: toMsg91Mobile(config.whatsappNumber),
    content_type: 'template',
    payload: {
      messaging_product: 'whatsapp',
      type: 'template',
      template,
    },
  }

  const result = await postToMsg91(MSG91_WHATSAPP_URL, config.authKey, payload, label)
  return { channel: 'whatsapp', sent: true, requestId: result?.request_id || null }
}

// SMS is tried first because it needs no opt-in from the customer, and WhatsApp
// takes over whenever SMS is unconfigured or the gateway rejects the request.
async function deliver({ phone, label, sms, whatsapp }) {
  const config = await getMsg91Settings()
  const mobiles = toMsg91Mobile(phone)

  const smsReady = Boolean(config.smsEnabled && config.authKey && config[sms.templateKey])
  const whatsappReady = Boolean(
    config.whatsappEnabled &&
      config.authKey &&
      config.whatsappNumber &&
      config[whatsapp.templateKey],
  )

  if (!mobiles || (!smsReady && !whatsappReady)) {
    console.log(
      `[MSG91 not configured] ${label} -> ${mobiles || 'no number'}`,
      sms.variables,
    )
    return { channel: 'dev', sent: false }
  }

  const failures = []

  if (smsReady) {
    try {
      return await sendSms({
        config,
        mobiles,
        templateId: config[sms.templateKey],
        variables: sms.variables,
        message: sms.message,
        label,
      })
    } catch (error) {
      failures.push(`SMS: ${error.message}`)
      if (!whatsappReady) throw error
      console.error(`MSG91 SMS failed for ${label}, trying WhatsApp:`, error.message)
    }
  }

  try {
    return await sendWhatsapp({
      config,
      mobiles,
      templateName: config[whatsapp.templateKey],
      values: whatsapp.values,
      otpValue: whatsapp.otpValue,
      label,
    })
  } catch (error) {
    failures.push(`WhatsApp: ${error.message}`)
    throw new Error(`MSG91 could not deliver ${label}. ${failures.join(' | ')}`)
  }
}

export function sendOtpMessage(phone, code) {
  return deliver({
    phone,
    label: 'login OTP',
    sms: {
      templateKey: 'otpTemplateId',
      variables: { otp: code },
      message: buildOtpSms(code),
    },
    whatsapp: { templateKey: 'whatsappOtpTemplate', values: [code], otpValue: code },
  })
}

export async function sendOrderConfirmation(order, { phone, name } = {}) {
  const address = order?.address && typeof order.address === 'object' ? order.address : null
  const to = phone || address?.phone || null

  if (!order?.orderNo || !to) {
    return { channel: 'none', sent: false }
  }

  const customerName = name || address?.name || 'Customer'
  const amount = formatAmount(order.grandTotal)

  return deliver({
    phone: to,
    label: `order confirmation ${order.orderNo}`,
    // The approved DLT order template carries a single variable, the order number.
    sms: {
      templateKey: 'orderTemplateId',
      variables: { order_id: order.orderNo },
      message: buildOrderSms(order.orderNo),
    },
    whatsapp: {
      templateKey: 'whatsappOrderTemplate',
      values: [customerName, order.orderNo, amount],
    },
  })
}
