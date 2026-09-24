import { prisma } from '../lib/prisma.js'
import { createOrderPaymentLink } from './razorpay.js'
import { toPublicAssetUrl } from '../utils/formatters.js'

function parseAddress(address) {
  if (!address || typeof address !== 'object') return null
  return address
}

export function formatPartnerOrder(order) {
  const address = parseAddress(order.address)
  return {
    id: order.id,
    orderNo: order.orderNo,
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentMode: order.paymentMode || 'cod',
    paymentCollectedAs: order.paymentCollectedAs || null,
    grandTotal: Number(order.grandTotal),
    itemsTotal: Number(order.itemsTotal),
    createdAt: order.createdAt,
    razorpayQrUrl: order.razorpayQrUrl || null,
    razorpayPaymentLinkId: order.razorpayPaymentLinkId || null,
    customerName: order.customer?.name || address?.name || 'Customer',
    customerPhone: order.customer?.phone || address?.phone || '',
    address: address
      ? {
          name: address.name,
          phone: address.phone,
          line1: address.line1,
          line2: address.line2,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          landmark: address.landmark,
        }
      : null,
    items: (order.items || []).map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      priceValue: Number(item.priceValue),
      image: toPublicAssetUrl(item.image) || '',
      weight: item.weight || '',
    })),
  }
}

const partnerOrderInclude = {
  customer: { select: { name: true, phone: true } },
  items: { orderBy: { id: 'asc' } },
}

async function loadAssignedOrder(orderId, partnerId) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: partnerOrderInclude,
  })
  if (!order) throw Object.assign(new Error('Order not found.'), { status: 404 })
  if (partnerId && order.deliveryPartnerId !== partnerId) {
    throw Object.assign(new Error('This order is not assigned to you.'), { status: 403 })
  }
  return order
}

export async function listPartnerOrders(partnerId) {
  const orders = await prisma.order.findMany({
    where: {
      deliveryPartnerId: partnerId,
      status: { not: 'cancelled' },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: partnerOrderInclude,
  })
  return orders.map(formatPartnerOrder)
}

export async function collectCashForOrder(orderId, { partnerId } = {}) {
  const order = await loadAssignedOrder(orderId, partnerId)
  if (order.paymentMode !== 'cod') {
    throw Object.assign(new Error('This order was not placed as cash on delivery.'), { status: 400 })
  }
  if (order.paymentStatus === 'paid') {
    return order
  }

  return prisma.order.update({
    where: { id: order.id },
    data: {
      paymentStatus: 'paid',
      paymentCollectedAs: 'cash',
    },
    include: partnerOrderInclude,
  })
}

export async function createOrderPaymentQr(orderId, { partnerId } = {}) {
  const order = await loadAssignedOrder(orderId, partnerId)
  if (order.paymentMode !== 'cod') {
    throw Object.assign(new Error('QR payment is only for cash on delivery orders.'), { status: 400 })
  }
  if (order.paymentStatus === 'paid') {
    return order
  }
  if (order.razorpayPaymentLinkId && order.razorpayQrUrl) {
    return order
  }

  const address = parseAddress(order.address)
  const link = await createOrderPaymentLink({
    amountInr: order.grandTotal,
    orderNo: order.orderNo,
    customer: {
      name: order.customer?.name || address?.name,
      phone: order.customer?.phone || address?.phone,
    },
  })

  return prisma.order.update({
    where: { id: order.id },
    data: {
      razorpayPaymentLinkId: link.id,
      razorpayQrUrl: link.qrUrl || link.shortUrl,
    },
    include: partnerOrderInclude,
  })
}

export async function markOrderPaidByQr({ orderNo, paymentId }) {
  if (!orderNo) return null
  const order = await prisma.order.findUnique({ where: { orderNo } })
  if (!order) return null
  if (order.paymentStatus === 'paid') return order

  return prisma.order.update({
    where: { id: order.id },
    data: {
      paymentStatus: 'paid',
      paymentCollectedAs: 'qr',
      razorpayPaymentId: paymentId || order.razorpayPaymentId,
    },
  })
}
