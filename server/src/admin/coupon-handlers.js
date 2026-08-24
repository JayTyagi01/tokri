function toBoolean(value) {
  return value === true || value === 'true' || value === 'on' || value === 1 || value === '1'
}

function parseTargetSlugs(raw) {
  if (!raw) return []
  if (Array.isArray(raw)) return raw.map((item) => String(item).trim()).filter(Boolean)
  if (typeof raw === 'string') {
    const trimmed = raw.trim()
    if (!trimmed) return []
    try {
      const parsed = JSON.parse(trimmed)
      if (Array.isArray(parsed)) return parseTargetSlugs(parsed)
    } catch {
      // comma-separated
    }
    return trimmed
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return []
}

function emptyToNull(value) {
  if (value === undefined || value === null || value === '') return null
  return value
}

export async function prepareCouponPayload(request) {
  if (request.method !== 'post') return request

  const payload = request.payload || {}
  payload.code = String(payload.code || '')
    .trim()
    .toUpperCase()
  payload.type = payload.type === 'flat' ? 'flat' : 'percent'
  payload.applyOn = payload.applyOn === 'shipping' ? 'shipping' : 'cart'
  payload.targetType = ['products', 'categories'].includes(payload.targetType) ? payload.targetType : 'all'
  payload.usageType = payload.usageType === 'single' ? 'single' : 'unlimited'
  payload.isActive = toBoolean(payload.isActive ?? true)
  payload.targetSlugs = payload.targetType === 'all' ? [] : parseTargetSlugs(payload.targetSlugs)
  payload.minCart = emptyToNull(payload.minCart)
  payload.maxDiscount = emptyToNull(payload.maxDiscount)
  payload.startsAt = emptyToNull(payload.startsAt)
  payload.expiresAt = emptyToNull(payload.expiresAt)
  payload.usageLimit = payload.usageType === 'single' ? null : emptyToNull(payload.usageLimit)

  if (!payload.code) {
    throw new Error('Coupon code is required.')
  }

  const value = Number(payload.value)
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error('Enter a discount value greater than 0.')
  }

  if (payload.targetType !== 'all' && !payload.targetSlugs.length) {
    throw new Error(
      payload.targetType === 'categories'
        ? 'Select at least one category for this coupon.'
        : 'Select at least one product for this coupon.',
    )
  }

  request.payload = payload
  return request
}
