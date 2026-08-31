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
      return 'https://tokriii.com/api/v1'
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
  if (user?.token) headers.Authorization = `Bearer ${user.token}`
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

export async function authPatch(path, user, body) {
  const response = await fetchWithTimeout(`${API_BASE_URL}${path}`, {
    method: 'PATCH',
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
  let resolved = value
  let branch = 'passthrough'
  if (/^(https?:|data:|blob:)/.test(value)) {
    resolved = value
    branch = 'absolute'
  } else if (value.startsWith('/')) {
    if (typeof window !== 'undefined') {
      const { hostname, origin } = window.location
      if (hostname === 'www.tokriii.com' || hostname === 'tokriii.com') {
        // Uploads are served on tokriii.com; server.tokriii.com /uploads currently 502s
        resolved = `https://tokriii.com${value}`
        branch = 'prod-relative'
      } else if (hostname === 'localhost' || hostname === '127.0.0.1') {
        resolved = `${origin}${value}`
        branch = 'local-relative'
      } else {
        resolved = `${ASSET_BASE_URL}${value}`
        branch = 'asset-base-relative'
      }
    } else {
      resolved = `${ASSET_BASE_URL}${value}`
      branch = 'ssr-relative'
    }
  }

  // Live evidence: API returns https://server.tokriii.com/uploads/* (502),
  // while https://tokriii.com/uploads/* returns 200.
  if (
    typeof resolved === 'string' &&
    resolved.startsWith('https://server.tokriii.com/uploads/')
  ) {
    resolved = resolved.replace(
      'https://server.tokriii.com/uploads/',
      'https://tokriii.com/uploads/',
    )
    branch = `${branch}+rewrite-server-uploads`
  }

  // #region agent log
  if (typeof window !== 'undefined' && String(value).includes('/uploads/')) {
    fetch('http://127.0.0.1:7316/ingest/db52256f-3cb2-454c-a236-a9264b383672', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'e35128' },
      body: JSON.stringify({
        sessionId: 'e35128',
        runId: 'post-fix',
        hypothesisId: 'uploads-host',
        location: 'src/lib/api.js:resolveAssetUrl',
        message: 'Resolved upload asset URL',
        data: {
          input: String(value).slice(0, 200),
          resolved: String(resolved).slice(0, 200),
          branch,
          apiBase: API_BASE_URL,
          assetBase: ASSET_BASE_URL,
          pageHost: window.location.hostname,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {})
  }
  // #endregion
  return resolved
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
