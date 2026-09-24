import { prisma } from '../lib/prisma.js'
import { createRazorpayOrder, verifyRazorpayPayment, getPublicPaymentConfig } from './razorpay.js'
import { listAddresses, snapshotCurrentAddress } from './addresses.js'
import { calcCartTotals, getChargeRates } from '../config/charges.js'
import { clearCart, getCartCheckoutItems } from './cart.js'
import { applyCouponToItems, findActiveCoupon, redeemCoupon } from './coupons.js'
import { PRODUCT_CATEGORY_INCLUDE } from '../utils/catalog.js'
import { notifyOrderStatus } from './push.js'
import { sendOrderConfirmation } from './msg91.js'
import { assignmentForPincode } from './delivery.js'

function parseAddresses(raw) {
  if (!raw) return []
  if (Array.isArray(raw)) return raw
  return []
}

function buildOrderNo() {
  const stamp = Date.now().toString().slice(-8)
  const rand = Math.floor(Math.random() * 900 + 100)
  return `TKR${stamp}${rand}`
}

function normalizeCartItem(raw) {
  const slug = String(raw?.id || raw?.slug || '').trim()
  const quantity = Math.max(1, Number(raw?.quantity) || 1)
  if (!slug) throw Object.assign(new Error('Invalid cart item.'), { status: 400 })
  return { slug, quantity }
}

async function resolveCartItems(rawItems) {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw Object.assign(new Error('Your cart is empty.'), { status: 400 })
  }

  const normalized = rawItems.map(normalizeCartItem)
  const slugs = normalized.map((item) => item.slug)
  const products = await prisma.product.findMany({
    where: { slug: { in: slugs }, isActive: true },
    include: PRODUCT_CATEGORY_INCLUDE,
  })

  const productMap = new Map(products.map((product) => [product.slug, product]))
  const items = []

  for (const entry of normalized) {
    const product = productMap.get(entry.slug)
    if (!product) {
      throw Object.assign(new Error(`Product "${entry.slug}" is no longer available.`), { status: 400 })
    }
    items.push({
      product,
      quantity: entry.quantity,
      priceValue: Number(product.priceValue),
      slug: product.slug,
      category: product.category,
      categories: (product.categoryLinks || []).map((row) => row.category).filter(Boolean),
    })
  }

  return items
}

async function resolveAddress(user, addressId, addressSnapshot) {
  if (String(addressId) === 'current') {
    return await snapshotCurrentAddress(user, addressSnapshot)
  }
  const addresses = await listAddresses(user.id)
  const address = addresses.find((item) => item.id === addressId)
  if (!address) {
    throw Object.assign(new Error('Please select a valid delivery address.'), { status: 400 })
  }
  return address
}

export async function getCheckoutConfig() {
  return getPublicPaymentConfig()
}

export async function createCheckoutOrder(user, { items: rawItems, addressId, address: addressSnapshot, paymentMode = 'online', couponCode }) {
  const sourceItems =
    Array.isArray(rawItems) && rawItems.length > 0
      ? rawItems
      : await getCartCheckoutItems(user.id)
  const cartItems = await resolveCartItems(sourceItems)
  const address = await resolveAddress(user, addressId, addressSnapshot)
  const rates = await getChargeRates()
  let totals = calcCartTotals(cartItems, rates)
  let appliedCoupon = null

  if (String(couponCode || '').trim()) {
    const coupon = await findActiveCoupon(couponCode)
    const applied = await applyCouponToItems(coupon, cartItems, user.id)
    totals = applied.totals
    appliedCoupon = applied.coupon
  }

  const paymentConfig = await getPublicPaymentConfig()
  const requestedMode = String(paymentMode || '').toLowerCase() === 'cod' ? 'cod' : 'online'
  const razorpayOn = Boolean(paymentConfig.razorpay?.enabled)
  const codOn = paymentConfig.codEnabled !== false

  if (requestedMode === 'online' && !razorpayOn) {
    throw Object.assign(
      new Error('Online payment is not available. Choose cash on delivery or enable Razorpay in admin.'),
      { status: 400, code: 'RAZORPAY_NOT_CONFIGURED' },
    )
  }
  if (requestedMode === 'cod' && !codOn) {
    throw Object.assign(new Error('Cash on delivery is not available for this order.'), { status: 400 })
  }
  if (!razorpayOn && !codOn) {
    throw Object.assign(new Error('Checkout is temporarily unavailable. Enable a payment method in admin.'), {
      status: 400,
    })
  }

  const useRazorpay = requestedMode === 'online'
  const delivery = await assignmentForPincode(address.pincode)

  const orderNo = buildOrderNo()
  let razorpayOrderId = null

  if (useRazorpay) {
    const razorpayOrder = await createRazorpayOrder({
      amountInr: totals.grandTotal,
      receipt: orderNo,
      notes: { orderNo, customerId: user.id },
    })
    razorpayOrderId = razorpayOrder.id
  }

  const order = await prisma.order.create({
    data: {
      orderNo,
      customerId: user.id,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMode: requestedMode,
      itemsTotal: totals.itemsTotal,
      deliveryCharge: totals.deliveryCharge,
      handlingCharge: totals.handlingCharge,
      smallCartCharge: totals.smallCartCharge,
      discount: totals.discount,
      couponCode: appliedCoupon?.code || null,
      grandTotal: totals.grandTotal,
      address,
      razorpayOrderId,
      ...delivery,
      items: {
        create: cartItems.map(({ product, quantity, priceValue }) => ({
          productId: product.id,
          name: product.name,
          priceValue,
          quantity,
          image: product.image,
          weight: product.weight,
        })),
      },
    },
    include: { items: true },
  })

  if (appliedCoupon) {
    await redeemCoupon({ coupon: appliedCoupon, customerId: user.id, orderId: order.id }).catch((error) => {
      console.error('Failed to record coupon use:', error)
    })
  }

  return {
    order: {
      id: order.id,
      orderNo: order.orderNo,
      grandTotal: Number(order.grandTotal),
      paymentMode: requestedMode,
    },
    razorpay: useRazorpay
      ? {
          keyId: paymentConfig.razorpay.keyId,
          orderId: razorpayOrderId,
          amount: Math.round(totals.grandTotal * 100),
          currency: 'INR',
          name: 'Tokriii',
          description: `Order ${orderNo}`,
          prefill: {
            name: address.name,
            contact: address.phone,
          },
        }
      : null,
  }
}

export async function confirmCheckoutPayment(user, { orderNo, razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
  const order = await prisma.order.findFirst({
    where: { orderNo, customerId: user.id },
  })

  if (!order) throw Object.assign(new Error('Order not found.'), { status: 404 })
  if (order.paymentStatus === 'paid') {
    return { orderNo: order.orderNo, paymentStatus: order.paymentStatus }
  }

  if (order.razorpayOrderId !== razorpayOrderId) {
    throw Object.assign(new Error('Payment details do not match this order.'), { status: 400 })
  }

  await verifyRazorpayPayment({ razorpayOrderId, razorpayPaymentId, razorpaySignature })

  const updated = await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentStatus: 'paid',
      status: order.status === 'pending' ? 'paid' : order.status,
      paymentCollectedAs: 'online',
      razorpayPaymentId,
    },
  })

  await clearCart(user.id).catch((error) => console.error('Failed to clear cart:', error))
  notifyOrderStatus(updated, 'paid').catch((error) => console.error('Failed to send push:', error))
  sendOrderConfirmation(updated, { phone: user.phone, name: user.name }).catch((error) =>
    console.error('Failed to send order confirmation:', error),
  )

  return { orderNo: updated.orderNo, paymentStatus: updated.paymentStatus }
}

export async function confirmCodOrder(user, { orderNo }) {
  const order = await prisma.order.findFirst({
    where: { orderNo, customerId: user.id },
  })

  if (!order) throw Object.assign(new Error('Order not found.'), { status: 404 })

  await clearCart(user.id).catch((error) => console.error('Failed to clear cart:', error))
  notifyOrderStatus(order, order.status || 'pending').catch((error) =>
    console.error('Failed to send push:', error),
  )
  sendOrderConfirmation(order, { phone: user.phone, name: user.name }).catch((error) =>
    console.error('Failed to send order confirmation:', error),
  )

  return { orderNo: order.orderNo, paymentStatus: order.paymentStatus, status: order.status }
}
