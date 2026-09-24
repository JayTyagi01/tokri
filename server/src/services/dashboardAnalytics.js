import { prisma } from '../lib/prisma.js'

const ZONE = 'Asia/Kolkata'
const PAGE_SIZE = 10

function dayKey(date) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

function addDays(date, days) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000)
}

function istToday() {
  return new Date(`${dayKey(new Date())}T00:00:00+05:30`)
}

function startOfMonth(date) {
  const [year, month] = dayKey(date).split('-')
  return new Date(`${year}-${month}-01T00:00:00+05:30`)
}

function addMonths(date, delta) {
  const [year, month] = dayKey(date).split('-').map(Number)
  const shifted = new Date(Date.UTC(year, month - 1 + delta, 1))
  const nextYear = shifted.getUTCFullYear()
  const nextMonth = String(shifted.getUTCMonth() + 1).padStart(2, '0')
  return new Date(`${nextYear}-${nextMonth}-01T00:00:00+05:30`)
}

function dayCount(from, until) {
  return Math.round((until.getTime() - from.getTime()) / (24 * 60 * 60 * 1000))
}

function rangeWindow(rangeKey) {
  const today = istToday()
  const tomorrow = addDays(today, 1)
  if (rangeKey === 'thisMonth') {
    const from = startOfMonth(today)
    return { key: 'thisMonth', label: 'This month', from, until: tomorrow, days: dayCount(from, tomorrow) }
  }
  if (rangeKey === 'lastMonth') {
    const until = startOfMonth(today)
    const from = startOfMonth(addDays(until, -1))
    return { key: 'lastMonth', label: 'Last month', from, until, days: dayCount(from, until) }
  }
  if (rangeKey === '90d') {
    const from = addMonths(today, -2)
    return { key: '90d', label: '3 months', from, until: tomorrow, days: dayCount(from, tomorrow) }
  }
  const from = addDays(today, -6)
  return { key: '7d', label: '7 days', from, until: tomorrow, days: 7 }
}

function dayLabel(key, days) {
  const date = new Date(`${key}T12:00:00+05:30`)
  if (days <= 7) {
    return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', timeZone: ZONE })
  }
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: ZONE })
}

function formatWhen(date) {
  return new Date(date).toLocaleString('en-IN', {
    timeZone: ZONE,
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function money(value) {
  return Math.round(Number(value) || 0)
}

function customerName(order) {
  const address = order.address && typeof order.address === 'object' ? order.address : null
  const name = (order.customer?.name || address?.name || '').trim()
  return name || '-'
}

function formatDob(date) {
  if (!date) return '-'
  const key = new Date(date).toISOString().slice(0, 10)
  const [year, month, day] = key.split('-').map(Number)
  const label = new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
  return label
}

function pageNumber(value) {
  const page = Number.parseInt(value, 10)
  return Number.isFinite(page) && page > 0 ? page : 1
}

async function orderValueWidget(rangeKey) {
  const window = rangeWindow(rangeKey)
  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: window.from, lt: window.until }, status: { not: 'cancelled' } },
    select: { createdAt: true, grandTotal: true },
  })

  const buckets = new Map()
  for (let index = 0; index < window.days; index += 1) {
    const key = dayKey(addDays(window.from, index))
    buckets.set(key, { date: key, label: dayLabel(key, window.days), orderValue: 0, orderCount: 0 })
  }

  let total = 0
  for (const order of orders) {
    const amount = money(order.grandTotal)
    total += amount
    const bucket = buckets.get(dayKey(order.createdAt))
    if (!bucket) continue
    bucket.orderValue += amount
    bucket.orderCount += 1
  }

  return {
    range: window.key,
    rangeLabel: window.label,
    total,
    orderCount: orders.length,
    series: [...buckets.values()],
  }
}

async function ordersWidget(rangeKey, pageValue) {
  const window = rangeWindow(rangeKey)
  const page = pageNumber(pageValue)
  const where = { createdAt: { gte: window.from, lt: window.until }, status: { not: 'cancelled' } }
  const [total, rows] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        orderNo: true,
        grandTotal: true,
        createdAt: true,
        address: true,
        customer: { select: { name: true } },
      },
    }),
  ])

  return {
    range: window.key,
    rangeLabel: window.label,
    total,
    page,
    pageSize: PAGE_SIZE,
    rows: rows.map((order) => ({
      id: order.id,
      orderNo: order.orderNo,
      name: customerName(order),
      amount: money(order.grandTotal),
      placedAt: formatWhen(order.createdAt),
    })),
  }
}

async function customersWidget(rangeKey, pageValue) {
  const window = rangeWindow(rangeKey)
  const page = pageNumber(pageValue)
  const where = { createdAt: { gte: window.from, lt: window.until } }
  const [total, rows] = await Promise.all([
    prisma.customer.count({ where }),
    prisma.customer.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: { id: true, name: true, phone: true, dateOfBirth: true, createdAt: true },
    }),
  ])

  return {
    range: window.key,
    rangeLabel: window.label,
    total,
    page,
    pageSize: PAGE_SIZE,
    rows: rows.map((customer) => ({
      id: customer.id,
      name: customer.name?.trim() || '-',
      phone: customer.phone,
      dateOfBirth: formatDob(customer.dateOfBirth),
      registeredAt: formatWhen(customer.createdAt),
    })),
  }
}

async function productsWidget(rangeKey) {
  const window = rangeWindow(rangeKey)
  const items = await prisma.orderItem.findMany({
    where: {
      order: { createdAt: { gte: window.from, lt: window.until }, status: { not: 'cancelled' } },
    },
    select: { name: true, quantity: true, priceValue: true, orderId: true },
  })
  const totals = new Map()
  for (const item of items) {
    const current = totals.get(item.name) || { name: item.name, quantity: 0, amount: 0, orders: 0, seen: new Set() }
    if (!current.seen.has(item.orderId)) {
      current.seen.add(item.orderId)
      current.orders += 1
    }
    current.quantity += item.quantity
    current.amount += money(item.priceValue) * item.quantity
    totals.set(item.name, current)
  }
  const rows = [...totals.values()]
    .sort((a, b) => b.orders - a.orders || b.quantity - a.quantity)
    .slice(0, 5)
    .map(({ name, orders, quantity, amount }) => ({ name, orders, quantity, amount }))
  return {
    range: window.key,
    rangeLabel: window.label,
    total: totals.size,
    rows,
  }
}

const WIDGETS = {
  orderValue: orderValueWidget,
  orders: ordersWidget,
  customers: customersWidget,
  products: productsWidget,
}

export async function buildDashboardAnalytics(filters = {}) {
  const range = filters.range || '7d'
  const widget = filters.widget
  if (widget && WIDGETS[widget]) {
    return { [widget]: await WIDGETS[widget](range, filters.page) }
  }
  const [orderValue, orders, customers, products] = await Promise.all([
    orderValueWidget(range),
    ordersWidget(range),
    customersWidget(range),
    productsWidget(range),
  ])
  return { orderValue, orders, customers, products }
}
