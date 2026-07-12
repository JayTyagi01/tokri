import { prisma } from '../lib/prisma.js'

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

export function formatCustomerOrder(order) {
  const address = parseAddress(order.address)

  return {
    id: order.id,
    orderNo: order.orderNo,
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.razorpayPaymentId ? 'Razorpay' : 'Cash on delivery',
    createdAt: order.createdAt,
    itemsTotal: Number(order.itemsTotal),
    deliveryCharge: Number(order.deliveryCharge),
    handlingCharge: Number(order.handlingCharge),
    smallCartCharge: Number(order.smallCartCharge),
    discount: Number(order.discount),
    grandTotal: Number(order.grandTotal),
    itemCount: order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
    address: address
      ? {
          label: address.label || 'Delivery',
          name: address.name,
          phone: address.phone,
          formatted: formatAddress(address),
        }
      : null,
    items: (order.items || []).map((item) => ({
      id: item.id,
      name: item.name,
      priceValue: Number(item.priceValue),
      quantity: item.quantity,
      weight: item.weight || '',
      image: item.image || '',
      lineTotal: Number(item.priceValue) * item.quantity,
    })),
  }
}

const orderInclude = {
  items: { orderBy: { id: 'asc' } },
}

const DEFAULT_PER_PAGE = 10
const MAX_PER_PAGE = 20

export async function listCustomerOrders(userId, { page = 1, perPage = DEFAULT_PER_PAGE } = {}) {
  const requestedPerPage = Number(perPage) || DEFAULT_PER_PAGE
  const safePerPage = Math.min(MAX_PER_PAGE, Math.max(1, requestedPerPage))
  const where = { userId }

  const totalCount = await prisma.order.count({ where })
  const totalPages = Math.max(1, Math.ceil(totalCount / safePerPage))
  const safePage = Math.min(Math.max(1, Number(page) || 1), totalPages)
  const skip = (safePage - 1) * safePerPage

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip,
    take: safePerPage,
    include: orderInclude,
  })

  return {
    orders: orders.map(formatCustomerOrder),
    pagination: {
      page: safePage,
      perPage: safePerPage,
      totalCount,
      totalPages,
      hasNextPage: safePage < totalPages,
      hasPrevPage: safePage > 1,
    },
  }
}

export async function getCustomerOrder(userId, orderNo) {
  const order = await prisma.order.findFirst({
    where: { userId, orderNo },
    include: orderInclude,
  })

  if (!order) {
    throw Object.assign(new Error('Order not found.'), { status: 404 })
  }

  return formatCustomerOrder(order)
}
