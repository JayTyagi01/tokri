import { env } from '../config/env.js'
import { formatCategoryRef, productCategoryList } from './catalog.js'

export function toPublicAssetUrl(value) {
  if (!value) return null
  const raw = String(value)

  // Absolute URLs: rewrite known broken upload host → working public asset host
  if (/^(https?:|data:|blob:)/i.test(raw)) {
    let out = raw
    if (out.startsWith('https://server.tokriii.com/uploads/')) {
      out = out.replace('https://server.tokriii.com', env.publicAssetUrl)
    }
    return out
  }

  if (raw.startsWith('/')) {
    return `${env.publicAssetUrl}${raw}`
  }
  return raw
}

export function formatProduct(product) {
  const priceValue = Number(product.priceValue)
  const oldPriceValue = product.oldPriceValue ? Number(product.oldPriceValue) : null

  const categories = productCategoryList(product).map(formatCategoryRef)
  const primary = categories[0] || null

  return {
    id: product.slug,
    slug: product.slug,
    name: product.name,
    description: product.description,
    price: formatCurrency(priceValue),
    priceValue,
    oldPrice: oldPriceValue ? formatCurrency(oldPriceValue) : null,
    oldPriceValue,
    currency: product.currency,
    weight: product.weight,
    image: toPublicAssetUrl(product.image),
    badge: product.badge,
    categoryId: primary?.slug ?? null,
    category: primary,
    categories,
    isBestSeller: product.isBestSeller,
    isImported: product.isImported,
    isFeatured: product.isFeatured,
    stock: product.stock,
  }
}

export function formatCategory(category, { includeProducts = false } = {}) {
  const base = {
    id: category.slug,
    slug: category.slug,
    label: category.label,
    title: category.title || category.label,
    subtitle: category.subtitle,
    description: category.description,
    image: toPublicAssetUrl(category.image),
    bannerImage: toPublicAssetUrl(category.bannerImage),
    sortOrder: category.sortOrder,
    productCount:
      category._count?.productLinks ??
      category._count?.products ??
      category.products?.length ??
      0,
  }

  if (includeProducts && category.products) {
    base.products = category.products.map(formatProduct)
  }

  return base
}

export function formatPage(page) {
  return {
    slug: page.slug,
    title: page.title,
    body: page.body || '',
    updatedAt: page.updatedAt,
  }
}

function formatCurrency(value) {
  return `₹${value.toLocaleString('en-IN', {
    maximumFractionDigits: 0,
  })}`
}
