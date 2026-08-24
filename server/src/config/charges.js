import { prisma } from '../lib/prisma.js'

export const DELIVERY_CHARGE = 25
export const HANDLING_CHARGE = 2
export const SMALL_CART_CHARGE = 0

function toMoney(value, fallback) {
  const amount = Number(value)
  if (!Number.isFinite(amount) || amount < 0) return fallback
  return Math.round(amount * 100) / 100
}

export function defaultChargeRates() {
  return {
    deliveryCharge: DELIVERY_CHARGE,
    handlingCharge: HANDLING_CHARGE,
    smallCartCharge: SMALL_CART_CHARGE,
  }
}

export async function getChargeRates() {
  try {
    const settings = await prisma.setting.findUnique({ where: { id: 1 } })
    return {
      deliveryCharge: toMoney(settings?.shippingFee, DELIVERY_CHARGE),
      handlingCharge: toMoney(settings?.handlingFee, HANDLING_CHARGE),
      smallCartCharge: SMALL_CART_CHARGE,
    }
  } catch (error) {
    console.error('Failed to load charge settings:', error)
    return defaultChargeRates()
  }
}

export function calcCartTotals(items, rates = defaultChargeRates(), discount = 0) {
  const itemsTotal = items.reduce((sum, item) => sum + Number(item.priceValue) * Number(item.quantity), 0)
  const hasItems = items.length > 0
  const deliveryCharge = hasItems ? toMoney(rates.deliveryCharge, DELIVERY_CHARGE) : 0
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
