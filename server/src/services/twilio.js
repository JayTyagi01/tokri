import twilio from 'twilio'
import { getTwilioSettings } from '../utils/twilioSettings.js'

export async function sendOtpMessage(phone, code) {
  const config = await getTwilioSettings()
  const to = phone.startsWith('+') ? phone : `+91${phone}`
  const body = `Your Tokriii verification code is ${code}. Valid for 10 minutes.`

  if (!config.enabled) {
    console.log(`[OTP dev mode] +91${phone.replace(/^\+91/, '')} -> ${code}`)
    return { channel: 'dev' }
  }

  if (!config.accountSid || !config.authToken) {
    throw new Error('Twilio is enabled but Account SID or Auth Token is missing in admin settings.')
  }

  const client = twilio(config.accountSid, config.authToken)

  if (config.smsFrom) {
    await client.messages.create({
      body,
      from: config.smsFrom,
      to,
    })
    return { channel: 'sms' }
  }

  if (config.whatsappFrom) {
    const from = config.whatsappFrom.startsWith('whatsapp:')
      ? config.whatsappFrom
      : `whatsapp:${config.whatsappFrom}`
    const whatsappTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`

    await client.messages.create({
      body,
      from,
      to: whatsappTo,
    })
    return { channel: 'whatsapp' }
  }

  throw new Error('Twilio is enabled but no SMS or WhatsApp sender number is configured.')
}
