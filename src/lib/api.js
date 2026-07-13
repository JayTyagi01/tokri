const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/600x600?text=Tokriii'
const FETCH_TIMEOUT_MS = 15000

function stripTrailingSlash(value) {
  return String(value || '').replace(/\/+$/, '')
}

function resolveApiBaseUrl() {
  const configured = stripTrailingSlash(import.meta.env.VITE_API_BASE_URL)
  if (configured) return configured

  if (typeof window !== 'undefined') {
    const { hostname, origin } = window.location

    if (hostname === 'www.tokriii.com' || hostname === 'tokriii.com') {
      return 'https://server.tokriii.com/api/v1'
    }

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `${origin}/api/v1`
    }
  }

  return 'http://localhost:5223/api/v1'
}

const API_BASE_URL = resolveApiBaseUrl()
const ASSET_BASE_URL = API_BASE_URL.replace(/\/api\/v1$/, '') || API_BASE_URL

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new Error(`Request timed out for ${url}`)
    }
    throw error
  } finally {
    window.clearTimeout(timer)
  }
}

export async function fetchJson(path) {
  const response = await fetchWithTimeout(`${API_BASE_URL}${path}`)

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || `Request failed (${response.status})`)
  }

  return response.json()
}

export async function postJson(path, body) {
  const response = await fetchWithTimeout(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`)
  }

  return data
}

function authHeaders(user) {
  const headers = { 'Content-Type': 'application/json' }
  if (user?.phone) headers['X-User-Phone'] = user.phone
  return headers
}

export async function authGet(path, user) {
  const response = await fetchWithTimeout(`${API_BASE_URL}${path}`, {
    headers: authHeaders(user),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || `Request failed (${response.status})`)
  return data
}

export async function authPost(path, user, body) {
  const response = await fetchWithTimeout(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: authHeaders(user),
    body: JSON.stringify(body),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || `Request failed (${response.status})`)
  return data
}

export async function authPut(path, user, body) {
  const response = await fetchWithTimeout(`${API_BASE_URL}${path}`, {
    method: 'PUT',
    headers: authHeaders(user),
    body: JSON.stringify(body),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || `Request failed (${response.status})`)
  return data
}

export async function authDelete(path, user) {
  const response = await fetchWithTimeout(`${API_BASE_URL}${path}`, {
    method: 'DELETE',
    headers: authHeaders(user),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || `Request failed (${response.status})`)
  return data
}

export function resolveAssetUrl(value) {
  if (!value) return PLACEHOLDER_IMAGE
  if (/^(https?:|data:|blob:)/.test(value)) return value
  if (value.startsWith('/')) {
    if (typeof window !== 'undefined') {
      const { hostname, origin } = window.location
      if (hostname === 'www.tokriii.com' || hostname === 'tokriii.com') {
        return `https://server.tokriii.com${value}`
      }
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return `${origin}${value}`
      }
    }
    return `${ASSET_BASE_URL}${value}`
  }
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

export function getApiBaseUrl() {
  return API_BASE_URL
}
