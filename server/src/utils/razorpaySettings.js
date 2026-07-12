import { prisma } from '../lib/prisma.js'

export async function getRazorpaySettings() {
  const settings = await prisma.setting.findUnique({ where: { id: 1 } })

  return {
    enabled: Boolean(settings?.razorpayEnabled),
    keyId: settings?.razorpayKeyId || process.env.RAZORPAY_KEY_ID || '',
    keySecret: settings?.razorpayKeySecret || process.env.RAZORPAY_KEY_SECRET || '',
  }
}
