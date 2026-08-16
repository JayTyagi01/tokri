export function formatOrderWhen(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const day = date.getDate()
  const month = date.toLocaleString('en-GB', { month: 'short' })
  let hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const suffix = hours >= 12 ? 'pm' : 'am'
  hours = hours % 12 || 12
  return `${day} ${month}, ${hours}:${minutes} ${suffix}`
}

export function paymentLabel(order) {
  if (!order) return 'Payment'
  if (String(order.paymentMethod || '').toLowerCase().includes('razor')) return 'Paid online'
  if (order.paymentStatus === 'paid' && order.paymentMethod !== 'Cash on delivery') return 'Paid online'
  return 'Cash on delivery'
}

export function statusLabel(order) {
  const status = String(order?.status || '').toLowerCase()
  if (status === 'delivered') return 'Arrived'
  if (status === 'shipped') return 'Out for delivery'
  if (status === 'packed') return 'Packed'
  if (status === 'cancelled') return 'Cancelled'
  return 'Ordered'
}

export function uniqueOrderedProducts(orders) {
  const seen = new Set()
  const products = []
  for (const order of orders || []) {
    for (const item of order.items || []) {
      const key = item.slug || item.name
      if (!key || seen.has(key)) continue
      seen.add(key)
      products.push({
        id: item.slug || item.id,
        slug: item.slug,
        name: item.name,
        image: item.image,
        priceValue: item.priceValue,
        oldPriceValue: item.oldPriceValue,
        price: item.price,
        weight: item.weight,
      })
    }
  }
  return products
}
