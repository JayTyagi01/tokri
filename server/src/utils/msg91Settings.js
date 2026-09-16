import { prisma } from '../lib/prisma.js'

export async function getMsg91Settings() {
  const settings = await prisma.setting.findUnique({ where: { id: 1 } })

  return {
    authKey: settings?.msg91AuthKey || process.env.MSG91_AUTH_KEY || '',
    smsEnabled: Boolean(settings?.msg91Enabled),
    senderId: settings?.msg91SenderId || process.env.MSG91_SENDER_ID || '',
    otpTemplateId: settings?.msg91OtpTemplateId || process.env.MSG91_OTP_TEMPLATE_ID || '',
    orderTemplateId: settings?.msg91OrderTemplateId || process.env.MSG91_ORDER_TEMPLATE_ID || '',
    whatsappEnabled: Boolean(settings?.msg91WhatsappEnabled),
    whatsappNumber: settings?.msg91WhatsappNumber || process.env.MSG91_WHATSAPP_NUMBER || '',
    whatsappNamespace:
      settings?.msg91WhatsappNamespace || process.env.MSG91_WHATSAPP_NAMESPACE || '',
    whatsappLanguage:
      settings?.msg91WhatsappLanguage || process.env.MSG91_WHATSAPP_LANGUAGE || 'en',
    whatsappOtpTemplate:
      settings?.msg91WhatsappOtpTemplate || process.env.MSG91_WHATSAPP_OTP_TEMPLATE || '',
    whatsappOrderTemplate:
      settings?.msg91WhatsappOrderTemplate || process.env.MSG91_WHATSAPP_ORDER_TEMPLATE || '',
    whatsappOtpButton: Boolean(settings?.msg91WhatsappOtpButton),
  }
}
