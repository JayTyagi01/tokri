import { prisma } from '../lib/prisma.js'
import { slugify } from '../admin/product-handlers.js'

function escapeCsv(value) {
  if (value == null || value === '') return ''
  const text = String(value)
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`
  return text
}

function parseCsv(text) {
  const rows = []
  let row = []
  let cell = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]
    const next = text[i + 1]

    if (inQuotes) {
      if (char === '"' && next === '"') {
        cell += '"'
        i += 1
      } else if (char === '"') {
        inQuotes = false
      } else {
        cell += char
      }
      continue
    }

    if (char === '"') {
      inQuotes = true
    } else if (char === ',') {
      row.push(cell.trim())
      cell = ''
    } else if (char === '\n' || (char === '\r' && next === '\n')) {
      row.push(cell.trim())
      if (row.some((value) => value !== '')) rows.push(row)
      row = []
      cell = ''
      if (char === '\r') i += 1
    } else if (char !== '\r') {
      cell += char
    }
  }

  if (cell.length || row.length) {
    row.push(cell.trim())
    if (row.some((value) => value !== '')) rows.push(row)
  }

  if (!rows.length) return []

  const headers = rows[0].map((header) => header.trim().toLowerCase())
  return rows.slice(1).map((values) => {
    const record = {}
    headers.forEach((header, index) => {
      record[header] = values[index] ?? ''
    })
    return record
  })
}

function toBoolean(value, fallback = false) {
  if (value === '' || value == null) return fallback
  const normalized = String(value).trim().toLowerCase()
  return ['1', 'true', 'yes', 'y'].includes(normalized)
}

function toNumber(value, fallback = 0) {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : fallback
}

function toOptionalNumber(value) {
  if (value === '' || value == null) return null
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : null
}

function toOptionalString(value) {
  const text = String(value ?? '').trim()
  return text || null
}

export function rowsToCsv(headers, rows) {
  const lines = [headers.join(',')]
  for (const row of rows) {
    lines.push(headers.map((header) => escapeCsv(row[header])).join(','))
  }
  return `${lines.join('\n')}\n`
}

const CATEGORY_HEADERS = [
  'slug',
  'label',
  'title',
  'subtitle',
  'description',
  'image',
  'bannerImage',
  'sortOrder',
  'isActive',
]

const PRODUCT_HEADERS = [
  'slug',
  'name',
  'description',
  'image',
  'priceValue',
  'oldPriceValue',
  'currency',
  'weight',
  'categorySlug',
  'badge',
  'isBestSeller',
  'isImported',
  'isFeatured',
  'stock',
  'sortOrder',
  'isActive',
]

export async function exportCategoriesCsv() {
  const categories = await prisma.category.findMany({ orderBy: [{ sortOrder: 'asc' }, { label: 'asc' }] })
  const rows = categories.map((item) => ({
    slug: item.slug,
    label: item.label,
    title: item.title || '',
    subtitle: item.subtitle || '',
    description: item.description || '',
    image: item.image || '',
    bannerImage: item.bannerImage || '',
    sortOrder: item.sortOrder,
    isActive: item.isActive ? 'true' : 'false',
  }))
  return rowsToCsv(CATEGORY_HEADERS, rows)
}

export async function exportProductsCsv() {
  const products = await prisma.product.findMany({
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    include: { category: { select: { slug: true } } },
  })

  const rows = products.map((item) => ({
    slug: item.slug,
    name: item.name,
    description: item.description || '',
    image: item.image || '',
    priceValue: item.priceValue,
    oldPriceValue: item.oldPriceValue ?? '',
    currency: item.currency || 'INR',
    weight: item.weight || '',
    categorySlug: item.category?.slug || '',
    badge: item.badge || '',
    isBestSeller: item.isBestSeller ? 'true' : 'false',
    isImported: item.isImported ? 'true' : 'false',
    isFeatured: item.isFeatured ? 'true' : 'false',
    stock: item.stock,
    sortOrder: item.sortOrder,
    isActive: item.isActive ? 'true' : 'false',
  }))

  return rowsToCsv(PRODUCT_HEADERS, rows)
}

export async function importCategoriesCsv(csvText) {
  const rows = parseCsv(csvText)
  let created = 0
  let updated = 0
  const errors = []

  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index]
    const line = index + 2

    try {
      const label = toOptionalString(row.label)
      if (!label) throw new Error('Label is required.')

      const slug = slugify(row.slug || label)
      const data = {
        label,
        slug,
        title: toOptionalString(row.title),
        subtitle: toOptionalString(row.subtitle),
        description: toOptionalString(row.description),
        image: toOptionalString(row.image),
        bannerImage: toOptionalString(row.bannerimage || row.bannerImage),
        sortOrder: toNumber(row.sortorder ?? row.sortOrder, 0),
        isActive: toBoolean(row.isactive ?? row.isActive, true),
      }

      const existing = await prisma.category.findUnique({ where: { slug } })
      if (existing) {
        await prisma.category.update({ where: { id: existing.id }, data })
        updated += 1
      } else {
        await prisma.category.create({ data })
        created += 1
      }
    } catch (error) {
      errors.push({ line, message: error.message || 'Could not import row.' })
    }
  }

  return { created, updated, errors }
}

export async function importProductsCsv(csvText) {
  const rows = parseCsv(csvText)
  let created = 0
  let updated = 0
  const errors = []

  const categories = await prisma.category.findMany({ select: { id: true, slug: true } })
  const categoryBySlug = new Map(categories.map((item) => [item.slug, item.id]))

  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index]
    const line = index + 2

    try {
      const name = toOptionalString(row.name)
      if (!name) throw new Error('Name is required.')

      const priceValue = toNumber(row.pricevalue ?? row.priceValue, NaN)
      if (!Number.isFinite(priceValue) || priceValue < 0) {
        throw new Error('A valid price is required.')
      }

      const slug = slugify(row.slug || name)
      const categorySlug = slugify(row.categoryslug || row.categorySlug || '')
      const categoryId = categorySlug ? categoryBySlug.get(categorySlug) || null : null

      const data = {
        name,
        slug,
        description: toOptionalString(row.description),
        image: toOptionalString(row.image),
        priceValue,
        oldPriceValue: toOptionalNumber(row.oldpricevalue ?? row.oldPriceValue),
        currency: toOptionalString(row.currency) || 'INR',
        weight: toOptionalString(row.weight),
        categoryId,
        badge: toOptionalString(row.badge),
        isBestSeller: toBoolean(row.isbestseller ?? row.isBestSeller, false),
        isImported: toBoolean(row.isimported ?? row.isImported, false),
        isFeatured: toBoolean(row.isfeatured ?? row.isFeatured, false),
        stock: toNumber(row.stock, 100),
        sortOrder: toNumber(row.sortorder ?? row.sortOrder, 0),
        isActive: toBoolean(row.isactive ?? row.isActive, true),
      }

      const existing = await prisma.product.findUnique({ where: { slug } })
      if (existing) {
        await prisma.product.update({ where: { id: existing.id }, data })
        updated += 1
      } else {
        await prisma.product.create({ data })
        created += 1
      }
    } catch (error) {
      errors.push({ line, message: error.message || 'Could not import row.' })
    }
  }

  return { created, updated, errors }
}

export function categoryImportTemplateCsv() {
  return rowsToCsv(CATEGORY_HEADERS, [
    {
      slug: 'fresh-fruits',
      label: 'Fresh Fruits',
      title: 'Fresh Fruits',
      subtitle: '',
      description: '',
      image: '/uploads/categories/fresh-fruits.jpg',
      bannerImage: '',
      sortOrder: 1,
      isActive: 'true',
    },
  ])
}

export function productImportTemplateCsv() {
  return rowsToCsv(PRODUCT_HEADERS, [
    {
      slug: 'alphonso-mango',
      name: 'Alphonso Mango',
      description: 'Sweet and juicy alphonso mangoes.',
      image: '/uploads/products/mango.jpg',
      priceValue: 199,
      oldPriceValue: 249,
      currency: 'INR',
      weight: '1 kg',
      categorySlug: 'fresh-fruits',
      badge: '',
      isBestSeller: 'true',
      isImported: 'false',
      isFeatured: 'false',
      stock: 100,
      sortOrder: 1,
      isActive: 'true',
    },
  ])
}
