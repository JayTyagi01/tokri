import React from 'react'

const FULFILLMENT = {
  pending: { label: 'New', tone: 'pending' },
  paid: { label: 'Processing', tone: 'processing' },
  packed: { label: 'Packed', tone: 'packed' },
  shipped: { label: 'Shipped', tone: 'shipped' },
  delivered: { label: 'Delivered', tone: 'delivered' },
  cancelled: { label: 'Cancelled', tone: 'cancelled' },
}

function isOnlineOrder(params = {}) {
  const mode = String(params.paymentMode || '').toLowerCase()
  if (mode === 'online') return true
  if (mode === 'cod') return false
  return Boolean(params.razorpayPaymentId || params.razorpayOrderId)
}

function paymentBadge(params = {}) {
  const online = isOnlineOrder(params)
  const method = online ? 'Online' : 'COD'
  const status = String(params.paymentStatus || 'pending').toLowerCase()

  if (status === 'paid') return { label: `${method} · Paid`, tone: 'paid' }
  if (status === 'failed') return { label: `${method} · Failed`, tone: 'failed' }
  if (status === 'refunded') return { label: `${method} · Refunded`, tone: 'refunded' }
  if (online) return { label: 'Online · Waiting', tone: 'waiting' }
  return { label: 'COD · Unpaid', tone: 'pending' }
}

function Pill({ label, tone }) {
  return <span className={`tokri-order-pill tokri-list-pill is-${tone}`}>{label}</span>
}

export function getFulfillmentBadge(status) {
  const key = String(status || 'pending').toLowerCase()
  return FULFILLMENT[key] || FULFILLMENT.pending
}

export function getPaymentBadge(params) {
  return paymentBadge(params)
}

function FulfillmentBadge({ record }) {
  const badge = getFulfillmentBadge(record?.params?.status)
  return <Pill label={badge.label} tone={badge.tone} />
}

function PaymentBadge({ record }) {
  const badge = getPaymentBadge(record?.params)
  return <Pill label={badge.label} tone={badge.tone} />
}

export default function OrderListBadge({ record, property }) {
  const path = property?.path || property?.propertyPath || ''
  if (path === 'status') return <FulfillmentBadge record={record} />
  return <PaymentBadge record={record} />
}
