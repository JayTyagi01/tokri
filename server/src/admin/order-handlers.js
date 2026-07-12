import { prisma } from '../lib/prisma.js'
import { canManage } from './permissions.js'

function parseAddress(address) {
  if (!address || typeof address !== 'object') return null
  return address
}

function formatAddress(address) {
  if (!address) return ''
  const parts = [
    address.name,
    address.line1,
    address.line2,
    [address.city, address.state, address.pincode].filter(Boolean).join(', '),
    address.landmark ? `Landmark: ${address.landmark}` : null,
  ].filter(Boolean)
  return parts.join(', ')
}

function flattenOrder(order) {
  const address = parseAddress(order.address)
  const customerName = order.user?.name || address?.name || 'Guest'
  const customerPhone = order.user?.phone || address?.phone || ''

  return {
    id: order.id,
    orderNo: order.orderNo,
    status: order.status,
    paymentStatus: order.paymentStatus,
    itemsTotal: String(order.itemsTotal),
    deliveryCharge: String(order.deliveryCharge),
    handlingCharge: String(order.handlingCharge),
    smallCartCharge: String(order.smallCartCharge),
    discount: String(order.discount),
    grandTotal: String(order.grandTotal),
    couponCode: order.couponCode || '',
    razorpayOrderId: order.razorpayOrderId || '',
    razorpayPaymentId: order.razorpayPaymentId || '',
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    customerName,
    customerPhone,
    customerEmail: order.user?.email || '',
    addressLabel: address?.label || 'Delivery',
    addressFormatted: formatAddress(address),
    addressJson: JSON.stringify(address || {}),
    itemsJson: JSON.stringify(
      (order.items || []).map((item) => ({
        id: item.id,
        name: item.name,
        priceValue: String(item.priceValue),
        quantity: item.quantity,
        weight: item.weight || '',
        image: item.image || '',
        lineTotal: String(Number(item.priceValue) * item.quantity),
      })),
    ),
    paymentMethod: order.razorpayPaymentId ? 'Razorpay' : 'Cash on delivery',
  }
}

async function loadOrder(recordId) {
  return prisma.order.findUnique({
    where: { id: recordId },
    include: {
      user: { select: { id: true, name: true, phone: true, email: true } },
      items: { orderBy: { id: 'asc' } },
    },
  })
}

export const orderListHandler = {
  isAccessible: canManage('manageOrders'),
  handler: async (request, _response, context) => {
    const { query } = request
    const perPage = Math.min(Number(query.perPage) || 10, 50)
    const page = Number(query.page) || 1
    const searchTerm = String(query['filters.orderNo'] || query['filters.customerName'] || '').trim()

    const where = searchTerm
      ? {
          OR: [
            { orderNo: { contains: searchTerm } },
            { user: { is: { name: { contains: searchTerm } } } },
            { user: { is: { phone: { contains: searchTerm } } } },
          ],
        }
      : {}

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, phone: true } },
        },
      }),
      prisma.order.count({ where }),
    ])

    const records = orders.map((order) => {
      const address = parseAddress(order.address)
      return context.resource.build({
        id: order.id,
        orderNo: order.orderNo,
        status: order.status,
        paymentStatus: order.paymentStatus,
        grandTotal: String(order.grandTotal),
        createdAt: order.createdAt,
        customerName: order.user?.name || address?.name || 'Guest',
        customerPhone: order.user?.phone || address?.phone || '',
      }).toJSON(context.currentAdmin)
    })

    return {
      meta: { total, perPage, page, direction: 'desc', sortBy: 'createdAt' },
      records,
    }
  },
}

export const orderShowHandler = {
  isAccessible: canManage('manageOrders'),
  isVisible: true,
  handler: async (request, _response, context) => {
    const order = await loadOrder(request.params.recordId)
    if (!order) {
      throw new Error('Order not found')
    }
    return {
      record: context.resource.build(flattenOrder(order)).toJSON(context.currentAdmin),
    }
  },
}

export const orderEditHandler = {
  isAccessible: canManage('manageOrders'),
  isVisible: true,
  before: async (request) => {
    if (request.method === 'post') {
      const { status, paymentStatus } = request.payload || {}
      request.payload = { status, paymentStatus }
    }
    return request
  },
  handler: async (request, _response, context) => {
    if (request.method === 'get') {
      const order = await loadOrder(request.params.recordId)
      if (!order) throw new Error('Order not found')
      return {
        record: context.resource.build(flattenOrder(order)).toJSON(context.currentAdmin),
      }
    }

    const { status, paymentStatus } = request.payload || {}
    await prisma.order.update({
      where: { id: request.params.recordId },
      data: {
        ...(status ? { status } : {}),
        ...(paymentStatus ? { paymentStatus } : {}),
      },
    })

    const order = await loadOrder(request.params.recordId)
    return {
      record: context.resource.build(flattenOrder(order)).toJSON(context.currentAdmin),
      notice: { message: 'Order updated successfully.', type: 'success' },
      redirectUrl: context.h.recordActionUrl({
        resourceId: context.resource.id(),
        recordId: order.id,
        actionName: 'show',
      }),
    }
  },
}
