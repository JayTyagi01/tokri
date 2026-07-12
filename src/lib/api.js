const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5222/api/v1').replace(
  /\/+$/,
  '',
)

const ASSET_BASE_URL = API_BASE_URL.replace(/\/api\/v1$/, '')
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/600x600?text=Tokriii'

export async function fetchJson(path) {
  const response = await fetch(`${API_BASE_URL}${path}`)

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'Request failed')
  }

  return response.json()
}

export async function postJson(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || 'Request failed')
  }

  return data
}

function authHeaders(user) {
  const headers = { 'Content-Type': 'application/json' }
  if (user?.phone) headers['X-User-Phone'] = user.phone
  return headers
}

export async function authGet(path, user) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: authHeaders(user),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || 'Request failed')
  return data
}

export async function authPost(path, user, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: authHeaders(user),
    body: JSON.stringify(body),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || 'Request failed')
  return data
}

export async function authPut(path, user, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'PUT',
    headers: authHeaders(user),
    body: JSON.stringify(body),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || 'Request failed')
  return data
}

export async function authDelete(path, user) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'DELETE',
    headers: authHeaders(user),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || 'Request failed')
  return data
}

export function resolveAssetUrl(value) {
  if (!value) return PLACEHOLDER_IMAGE
  if (/^(https?:|data:|blob:)/.test(value)) return value
  if (value.startsWith('/')) return `${ASSET_BASE_URL}${value}`
  return value
}

export function normalizeProduct(product) {
  return {
    ...product,
    id: product.slug || product.id,
    image: resolveAssetUrl(product.image),
  }
}

export function normalizeProducts(products) {
  return products.map(normalizeProduct)
}
