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
    whatsappLanguage: process.env.MSG91_WHATSAPP_LANGUAGE || 'en',
    whatsappOtpEnabled:
      settings?.msg91WhatsappOtpEnabled == null ? true : Boolean(settings.msg91WhatsappOtpEnabled),
    whatsappOtpTemplate:
      settings?.msg91WhatsappOtpTemplate || process.env.MSG91_WHATSAPP_OTP_TEMPLATE || '',
    whatsappOrderEnabled:
      settings?.msg91WhatsappOrderEnabled == null ? true : Boolean(settings.msg91WhatsappOrderEnabled),
    whatsappOrderTemplate:
      settings?.msg91WhatsappOrderTemplate || process.env.MSG91_WHATSAPP_ORDER_TEMPLATE || '',
    whatsappPartnerEnabled:
      settings?.msg91WhatsappPartnerEnabled == null
        ? true
        : Boolean(settings.msg91WhatsappPartnerEnabled),
    whatsappPartnerTemplate:
      settings?.msg91WhatsappPartnerTemplate ||
      process.env.MSG91_WHATSAPP_PARTNER_TEMPLATE ||
      'tokriii_delivery_assigned',
    whatsappOtpButton: Boolean(settings?.msg91WhatsappOtpButton),
  }
}
