const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1').replace(
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
