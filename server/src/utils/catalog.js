export const PRODUCT_CATEGORY_INCLUDE = {
  category: true,
  categoryLinks: { include: { category: true } },
}

export function productCategoryList(product) {
  const fromJoin = (product.categoryLinks || [])
    .map((row) => row.category)
    .filter(Boolean)
  if (fromJoin.length) return fromJoin
  return product.category ? [product.category] : []
}

export function categoryProductWhere(categoryId) {
  return {
    OR: [{ categoryId }, { categoryLinks: { some: { categoryId } } }],
  }
}

export function formatCategoryRef(category) {
  if (!category) return null
  return {
    id: category.slug,
    slug: category.slug,
    label: category.label,
  }
}
