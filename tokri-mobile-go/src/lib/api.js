import { API_BASE_URL } from '../config'

const ASSET_BASE = API_BASE_URL.replace(/\/api\/v1$/, '')

function resolveAssetUrl(value) {
  if (!value) return null
  if (/^https?:\/\//i.test(value)) {
    return value.replace('http://localhost:5223', ASSET_BASE).replace('http://127.0.0.1:5223', ASSET_BASE)
  }
  if (value.startsWith('/')) return `${ASSET_BASE}${value}`
  return value
}

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`)
  }
  return data
}

function authHeaders(token) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  return headers
}

export async function fetchJson(path) {
  const response = await fetch(`${API_BASE_URL}${path}`)
  return parseResponse(response)
}

export async function authGet(path, token) {
  const response = await fetch(`${API_BASE_URL}${path}`, { headers: authHeaders(token) })
  return parseResponse(response)
}

export async function authPost(path, token, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(body),
  })
  return parseResponse(response)
}

export async function authPut(path, token, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(body),
  })
  return parseResponse(response)
}

export async function authPatch(path, token, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify(body),
  })
  return parseResponse(response)
}

export async function authDelete(path, token) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
  return parseResponse(response)
}

export async function postJson(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return parseResponse(response)
}

export function normalizeProduct(product) {
  return {
    ...product,
    id: product.slug || product.id,
    image: resolveAssetUrl(product.image),
  }
}

export function formatPrice(value) {
  return `₹${Number(value).toLocaleString('en-IN')}`
}
