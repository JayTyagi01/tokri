import { prisma } from '../lib/prisma.js'
import {
  captureRazorpayPayment,
  createRazorpayOrder,
  createUpiIntentPayment,
  fetchRazorpayPayment,
  getPublicPaymentConfig,
  verifyRazorpayPayment,
} from './razorpay.js'
import { listAddresses, snapshotCurrentAddress } from './addresses.js'
import { calcCartTotals, calcItemTax, getChargeRates, publicDeliveryConfig } from '../config/charges.js'
import { clearCart, getCartCheckoutItems } from './cart.js'
import { applyCouponToItems, findActiveCoupon, redeemCoupon } from './coupons.js'
import { PRODUCT_CATEGORY_INCLUDE } from '../utils/catalog.js'
import { notifyOrderStatus } from './push.js'
import { sendOrderConfirmation } from './msg91.js'
import { assignmentForPincode, assertDeliveryOptionEnabled } from './delivery.js'
import { applyFreeDeliveryRates, getCustomerFreeDeliveryStatus } from './freeDelivery.js'

export function isStoreIntraState(customerState) {
  if (!customerState) return true
  const norm = String(customerState).trim().toLowerCase()
  return (
    norm === 'dl' ||
    norm === 'delhi' ||
    norm.includes('delhi') ||
    norm.includes('nct')
  )
}

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
      isTaxable: Boolean(product.isTaxable),
      gstRate: Number(product.gstRate || 0),
      hsnCode: product.hsnCode || '0808',
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

export async function getCheckoutConfig(customer) {
  const [payment, settings, freeDelivery] = await Promise.all([
    getPublicPaymentConfig(),
    prisma.setting.findUnique({ where: { id: 1 } }),
    customer?.id ? getCustomerFreeDeliveryStatus(customer.id) : null,
  ])
  return {
    ...payment,
    delivery: publicDeliveryConfig(settings),
    freeDelivery: freeDelivery || { quota: 3, used: 0, remaining: 0, isEligible: false },
  }
}

export async function createCheckoutOrder(user, { items: rawItems, addressId, address: addressSnapshot, paymentMode = 'online', couponCode, upiApp, deliveryOption }, meta = {}) {
  const sourceItems =
    Array.isArray(rawItems) && rawItems.length > 0
      ? rawItems
      : await getCartCheckoutItems(user.id)
  const cartItems = await resolveCartItems(sourceItems)
  const address = await resolveAddress(user, addressId, addressSnapshot)
  const { option } = await assertDeliveryOptionEnabled(address.pincode, deliveryOption || address.delivery?.defaultOption)
  let rates = await getChargeRates(option)

  const freeDeliveryStatus = await getCustomerFreeDeliveryStatus(user.id)
  const isFreeDelivery = Boolean(freeDeliveryStatus?.isEligible)
  if (isFreeDelivery) {
    rates = applyFreeDeliveryRates(rates)
  }

  const isInterState = !isStoreIntraState(address.state)
  let totals = calcCartTotals(cartItems, rates, 0, isInterState)
  let appliedCoupon = null

  if (String(couponCode || '').trim()) {
    const coupon = await findActiveCoupon(couponCode)
    const applied = await applyCouponToItems(coupon, cartItems, user.id, option, isInterState)
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

  const orderItemsData = cartItems.map((entry) => {
    const itemTax = calcItemTax(entry, isInterState)
    return {
      productId: entry.product.id,
      name: entry.product.name,
      priceValue: entry.priceValue,
      quantity: entry.quantity,
      image: entry.product.image,
      weight: entry.product.weight,
      hsnCode: entry.hsnCode || '0808',
      isTaxable: Boolean(entry.isTaxable),
      gstRate: entry.gstRate || 0,
      taxAmount: itemTax.taxAmount,
      cgstAmount: itemTax.cgstAmount,
      sgstAmount: itemTax.sgstAmount,
      igstAmount: itemTax.igstAmount,
    }
  })

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
      taxTotal: totals.taxTotal,
      cgstTotal: totals.cgstTotal,
      sgstTotal: totals.sgstTotal,
      igstTotal: totals.igstTotal,
      isInterState,
      couponCode: appliedCoupon?.code || null,
      deliveryOption: option,
      freeDeliveryApplied: isFreeDelivery,
      grandTotal: totals.grandTotal,
      address,
      razorpayOrderId,
      ...delivery,
      items: {
        create: orderItemsData,
      },
    },
    include: { items: true },
  })

  if (appliedCoupon) {
    await redeemCoupon({ coupon: appliedCoupon, customerId: user.id, orderId: order.id }).catch((error) => {
      console.error('Failed to record coupon use:', error)
    })
  }

  let intent = null
  let intentError = null
  const directUpi = useRazorpay && ['gpay', 'phonepe', 'paytm', 'cred', 'amazon', 'bhim', 'upi'].includes(upiApp)
  if (directUpi) {
    const contact = paymentPhone(user, address)
    if (contact.length !== 10) {
      intentError = 'A 10-digit phone number is required for UPI.'
    } else {
      try {
        intent = await createUpiIntentPayment({
          orderId: razorpayOrderId,
          amountPaise: Math.round(totals.grandTotal * 100),
          contact,
          email: `pay.${contact}@tokriii.com`,
          description: `Order ${orderNo}`,
          orderNo,
          ip: meta.ip,
          userAgent: meta.userAgent,
        })
      } catch (error) {
        intentError = error.message || 'UPI could not be started.'
        console.error('UPI intent was not created:', {
          orderNo,
          message: intentError,
          razorpayStatus: error.razorpayStatus,
          razorpayCode: error.razorpayCode,
        })
      }
    }
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
          upiApp: directUpi ? upiApp : undefined,
        }
      : null,
    intent,
    intentError,
  }
}

function paymentPhone(user, address) {
  const raw = address?.phone || user?.phone || ''
  return String(raw).replace(/\D/g, '').slice(-10)
}

async function markOnlineOrderPaid(user, order, razorpayPaymentId) {
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

  return updated
}

export async function markOnlineOrderPaidFromWebhook({ orderNo, razorpayOrderId, paymentId }) {
  let order = null
  if (orderNo) order = await prisma.order.findUnique({ where: { orderNo } })
  if (!order && razorpayOrderId) {
    order = await prisma.order.findFirst({ where: { razorpayOrderId } })
  }
  if (!order || order.paymentMode !== 'online') return null
  if (order.paymentStatus === 'paid') return order

  const customer = order.customerId
    ? await prisma.customer.findUnique({ where: { id: order.customerId } })
    : null

  return markOnlineOrderPaid(
    { id: order.customerId, phone: customer?.phone || '', name: customer?.name || '' },
    order,
    paymentId,
  )
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
  const updated = await markOnlineOrderPaid(user, order, razorpayPaymentId)
  return { orderNo: updated.orderNo, paymentStatus: updated.paymentStatus }
}

export async function startUpiIntent(user, { orderNo }, meta = {}) {
  const order = await prisma.order.findFirst({
    where: { orderNo, customerId: user.id },
  })
  if (!order) throw Object.assign(new Error('Order not found.'), { status: 404 })
  if (order.paymentStatus === 'paid') {
    throw Object.assign(new Error('This order is already paid.'), { status: 400 })
  }
  if (order.paymentMode !== 'online' || !order.razorpayOrderId) {
    throw Object.assign(new Error('This order is not waiting for an online payment.'), { status: 400 })
  }

  const address = order.address && typeof order.address === 'object' ? order.address : {}
  const contact = paymentPhone(user, address)
  if (contact.length !== 10) {
    throw Object.assign(new Error('A 10-digit phone number is required for UPI.'), { status: 400 })
  }

  const intent = await createUpiIntentPayment({
    orderId: order.razorpayOrderId,
    amountPaise: Math.round(Number(order.grandTotal) * 100),
    contact,
    email: `pay.${contact}@tokriii.com`,
    description: `Order ${order.orderNo}`,
    orderNo: order.orderNo,
    ip: meta.ip,
    userAgent: meta.userAgent,
  })

  return { orderNo: order.orderNo, paymentId: intent.paymentId, intentUrl: intent.intentUrl }
}

export async function syncIntentPayment(user, { orderNo, razorpayPaymentId }) {
  const order = await prisma.order.findFirst({
    where: { orderNo, customerId: user.id },
  })
  if (!order) throw Object.assign(new Error('Order not found.'), { status: 404 })
  if (order.paymentStatus === 'paid') return { status: 'paid', orderNo: order.orderNo }
  if (!razorpayPaymentId) {
    throw Object.assign(new Error('Payment details do not match this order.'), { status: 400 })
  }

  let payment = await fetchRazorpayPayment(razorpayPaymentId)
  const expected = Math.round(Number(order.grandTotal) * 100)
  if (payment.order_id !== order.razorpayOrderId || Number(payment.amount) !== expected) {
    throw Object.assign(new Error('Payment details do not match this order.'), { status: 400 })
  }

  if (payment.status === 'authorized') {
    payment = await captureRazorpayPayment(payment.id, expected, payment.currency || 'INR')
  }

  if (payment.status === 'captured') {
    await markOnlineOrderPaid(user, order, payment.id)
    return { status: 'paid', orderNo: order.orderNo }
  }

  if (payment.status === 'failed') {
    return {
      status: 'failed',
      message: payment.error_description || payment.error_reason || 'Payment failed. Please try again.',
    }
  }

  return { status: 'pending', orderNo: order.orderNo }
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
