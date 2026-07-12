import { prisma } from '../lib/prisma.js'

export async function getTwilioSettings() {
  const settings = await prisma.setting.findUnique({ where: { id: 1 } })

  return {
    enabled: Boolean(settings?.twilioEnabled),
    accountSid: settings?.twilioAccountSid || process.env.TWILIO_ACCOUNT_SID || '',
    authToken: settings?.twilioAuthToken || process.env.TWILIO_AUTH_TOKEN || '',
    smsFrom: settings?.twilioSmsFrom || process.env.TWILIO_SMS_FROM || '',
    whatsappFrom: settings?.twilioWhatsappFrom || process.env.TWILIO_WHATSAPP_FROM || '',
  }
}
