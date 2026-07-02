export function formatProduct(product) {
  const priceValue = Number(product.priceValue)
  const oldPriceValue = product.oldPriceValue ? Number(product.oldPriceValue) : null

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
    image: product.image,
    badge: product.badge,
    categoryId: product.category?.slug ?? null,
    category: product.category
      ? {
          id: product.category.slug,
          slug: product.category.slug,
          label: product.category.label,
        }
      : null,
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
    image: category.image,
    bannerImage: category.bannerImage,
    sortOrder: category.sortOrder,
    productCount: category._count?.products ?? category.products?.length ?? 0,
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
