import { prisma } from '../lib/prisma.js'
import { createRazorpayOrder, verifyRazorpayPayment, getPublicPaymentConfig } from './razorpay.js'
import { listAddresses } from './addresses.js'
import { calcCartTotals } from '../config/charges.js'
import { clearCart, getCartCheckoutItems } from './cart.js'
import { notifyOrderStatus } from './push.js'

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

function calcTotals(items) {
  return calcCartTotals(items)
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
    })
  }

  return items
}

async function resolveAddress(user, addressId) {
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

export async function createCheckoutOrder(user, { items: rawItems, addressId, paymentMode = 'online' }) {
  const sourceItems =
    Array.isArray(rawItems) && rawItems.length > 0
      ? rawItems
      : await getCartCheckoutItems(user.id)
  const cartItems = await resolveCartItems(sourceItems)
  const address = await resolveAddress(user, addressId)
  const totals = calcTotals(cartItems)
  const paymentConfig = await getPublicPaymentConfig()
  const useRazorpay = paymentMode === 'online' && paymentConfig.razorpay.enabled

  const orderNo = buildOrderNo()
  let razorpayOrderId = null

  if (useRazorpay) {
    const razorpayOrder = await createRazorpayOrder({
      amountInr: totals.grandTotal,
      receipt: orderNo,
      notes: { orderNo, customerId: user.id },
    })
    razorpayOrderId = razorpayOrder.id
  } else if (paymentMode === 'online') {
    throw Object.assign(
      new Error('Online payment is not available yet. Enable Razorpay in admin or choose cash on delivery.'),
      { status: 400, code: 'RAZORPAY_NOT_CONFIGURED' },
    )
  }

  const order = await prisma.order.create({
    data: {
      orderNo,
      customerId: user.id,
      status: 'pending',
      paymentStatus: useRazorpay ? 'pending' : 'pending',
      itemsTotal: totals.itemsTotal,
      deliveryCharge: totals.deliveryCharge,
      handlingCharge: totals.handlingCharge,
      smallCartCharge: totals.smallCartCharge,
      grandTotal: totals.grandTotal,
      address,
      razorpayOrderId,
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

  return {
    order: {
      id: order.id,
      orderNo: order.orderNo,
      grandTotal: Number(order.grandTotal),
      paymentMode: useRazorpay ? 'online' : 'cod',
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
      status: 'paid',
      razorpayPaymentId,
    },
  })

  await clearCart(user.id).catch((error) => console.error('Failed to clear cart:', error))
  notifyOrderStatus(updated, 'paid').catch((error) => console.error('Failed to send push:', error))

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

  return { orderNo: order.orderNo, paymentStatus: order.paymentStatus, status: order.status }
}
