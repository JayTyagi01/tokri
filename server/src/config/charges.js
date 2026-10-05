import { prisma } from '../lib/prisma.js'

export const DELIVERY_CHARGE = 25
export const EXPRESS_DELIVERY_CHARGE = 99
export const HANDLING_CHARGE = 2
export const SMALL_CART_CHARGE = 0

export const DEFAULT_DELIVERY = {
  morning: {
    id: 'morning',
    title: 'Flawless Morning Delivery',
    subtitle: 'Freshness Guaranteed',
    fee: DELIVERY_CHARGE,
    freeAbove: 0,
  },
  express: {
    id: 'express',
    title: '90-Minute Emergency Drops',
    subtitle: 'On-Demand Luxury',
    fee: EXPRESS_DELIVERY_CHARGE,
    freeAbove: 0,
  },
}

function toMoney(value, fallback) {
  const amount = Number(value)
  if (!Number.isFinite(amount) || amount < 0) return fallback
  return Math.round(amount * 100) / 100
}

export function normalizeDeliveryOption(value) {
  return String(value || '').toLowerCase() === 'express' ? 'express' : 'morning'
}

export function publicDeliveryConfig(settings) {
  return {
    morning: {
      id: 'morning',
      title: String(settings?.morningDeliveryTitle || DEFAULT_DELIVERY.morning.title).trim() || DEFAULT_DELIVERY.morning.title,
      subtitle: String(settings?.morningDeliverySubtitle || DEFAULT_DELIVERY.morning.subtitle).trim() || DEFAULT_DELIVERY.morning.subtitle,
      fee: toMoney(settings?.morningShippingFee ?? settings?.shippingFee, DELIVERY_CHARGE),
      freeAbove: toMoney(settings?.morningFreeAbove, 0),
    },
    express: {
      id: 'express',
      title: String(settings?.expressDeliveryTitle || DEFAULT_DELIVERY.express.title).trim() || DEFAULT_DELIVERY.express.title,
      subtitle: String(settings?.expressDeliverySubtitle || DEFAULT_DELIVERY.express.subtitle).trim() || DEFAULT_DELIVERY.express.subtitle,
      fee: toMoney(settings?.expressShippingFee, EXPRESS_DELIVERY_CHARGE),
      freeAbove: toMoney(settings?.expressFreeAbove, 0),
    },
  }
}

export function deliveryChargeFor(option, itemsTotal, rates = DEFAULT_DELIVERY) {
  const key = normalizeDeliveryOption(option)
  const spec = rates?.[key] || DEFAULT_DELIVERY[key]
  const fee = toMoney(spec?.fee ?? rates?.deliveryCharge, key === 'express' ? EXPRESS_DELIVERY_CHARGE : DELIVERY_CHARGE)
  const freeAbove = toMoney(spec?.freeAbove, 0)
  if (freeAbove > 0 && Number(itemsTotal) >= freeAbove) return 0
  return fee
}

export function defaultChargeRates(option = 'morning') {
  const chosen = normalizeDeliveryOption(option)
  return {
    option: chosen,
    deliveryCharge: DEFAULT_DELIVERY[chosen].fee,
    handlingCharge: HANDLING_CHARGE,
    smallCartCharge: SMALL_CART_CHARGE,
    ...DEFAULT_DELIVERY,
  }
}

export function ratesFromSettings(settings, option = 'morning') {
  const delivery = publicDeliveryConfig(settings)
  const chosen = normalizeDeliveryOption(option)
  return {
    option: chosen,
    deliveryCharge: delivery[chosen].fee,
    handlingCharge: toMoney(settings?.handlingFee, HANDLING_CHARGE),
    smallCartCharge: SMALL_CART_CHARGE,
    ...delivery,
  }
}

export async function getChargeRates(option = 'morning') {
  try {
    const settings = await prisma.setting.findUnique({ where: { id: 1 } })
    return ratesFromSettings(settings, option)
  } catch (error) {
    console.error('Failed to load charge settings:', error)
    return defaultChargeRates(option)
  }
}

export function calcCartTotals(items, rates = defaultChargeRates(), discount = 0) {
  const itemsTotal = items.reduce((sum, item) => sum + Number(item.priceValue) * Number(item.quantity), 0)
  const hasItems = items.length > 0
  const deliveryCharge = hasItems ? deliveryChargeFor(rates.option || 'morning', itemsTotal, rates) : 0
  const handlingCharge = hasItems ? toMoney(rates.handlingCharge, HANDLING_CHARGE) : 0
  const smallCartCharge = 0
  const safeDiscount = Math.max(0, toMoney(discount, 0))
  const grandTotal = Math.max(0, itemsTotal + deliveryCharge + handlingCharge - safeDiscount)

  return {
    itemsTotal,
    deliveryCharge,
    handlingCharge,
    smallCartCharge,
    discount: safeDiscount,
    grandTotal,
    totalCount: items.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
  }
}
