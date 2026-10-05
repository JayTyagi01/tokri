import ExcelJS from 'exceljs'
import { prisma } from '../lib/prisma.js'
import { slugify, syncProductCategories } from '../admin/product-handlers.js'

function escapeCsv(value) {
  if (value == null || value === '') return ''
  const text = String(value)
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`
  return text
}

function normalizeHeader(value) {
  return String(value ?? '')
    .replace(/^\uFEFF/, '')
    .trim()
    .toLowerCase()
}

function parseCsv(text) {
  const rows = []
  let row = []
  let cell = ''
  let inQuotes = false
  const source = String(text || '').replace(/^\uFEFF/, '')

  for (let i = 0; i < source.length; i += 1) {
    const char = source[i]
    const next = source[i + 1]

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

  const headers = rows[0].map((header) => normalizeHeader(header))
  return rows.slice(1).map((values) => {
    const record = {}
    headers.forEach((header, index) => {
      if (!header) return
      record[header] = values[index] ?? ''
    })
    return record
  })
}

function cellToString(value) {
  if (value == null) return ''
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  if (value instanceof Date) return value.toISOString()
  if (typeof value === 'object') {
    if (typeof value.text === 'string') return value.text.trim()
    if (value.result != null) return cellToString(value.result)
    if (Array.isArray(value.richText)) return value.richText.map((part) => part.text || '').join('').trim()
    if (typeof value.hyperlink === 'string') return String(value.text || value.hyperlink).trim()
  }
  return String(value).trim()
}

function looksLikeXlsx(buffer, filename = '') {
  const name = String(filename || '').toLowerCase()
  if (name.endsWith('.xlsx')) return true
  return Boolean(buffer?.length >= 2 && buffer[0] === 0x50 && buffer[1] === 0x4b)
}

async function parseXlsx(buffer) {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(buffer)
  const sheet = workbook.worksheets[0]
  if (!sheet) return []

  const headers = []
  sheet.getRow(1).eachCell({ includeEmpty: true }, (cell, colNumber) => {
    headers[colNumber] = normalizeHeader(cellToString(cell.value))
  })

  const records = []
  sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return
    const record = {}
    headers.forEach((header, colNumber) => {
      if (!header) return
      record[header] = cellToString(row.getCell(colNumber).value)
    })
    if (Object.values(record).some((value) => value !== '')) records.push(record)
  })
  return records
}

export async function parseCatalogFile(buffer, filename = '') {
  const name = String(filename || '').toLowerCase()
  if (name.endsWith('.xls') && !name.endsWith('.xlsx')) {
    throw Object.assign(new Error('Old .xls files are not supported. Save as .xlsx or .csv and try again.'), {
      status: 400,
    })
  }
  if (looksLikeXlsx(buffer, filename)) {
    try {
      return await parseXlsx(buffer)
    } catch (error) {
      throw Object.assign(new Error('Could not read this Excel file. Export again as .xlsx or use CSV.'), {
        status: 400,
        cause: error,
      })
    }
  }
  const text = Buffer.isBuffer(buffer) ? buffer.toString('utf-8') : String(buffer || '')
  return parseCsv(text)
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

function excelCell(value) {
  if (value == null || value === '') return ''
  if (typeof value === 'number' && Number.isFinite(value)) return value
  const numeric = Number(value)
  if (typeof value !== 'boolean' && String(value).trim() !== '' && Number.isFinite(numeric)) {
    const asText = String(value).trim()
    if (asText === String(numeric) || asText === numeric.toFixed?.(2)) return numeric
  }
  return String(value)
}

export function rowsToCsv(headers, rows) {
  const lines = [headers.join(',')]
  for (const row of rows) {
    lines.push(headers.map((header) => escapeCsv(row[header])).join(','))
  }
  return `${lines.join('\n')}\n`
}

async function rowsToXlsx(sheetName, headers, rows) {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet(sheetName)
  sheet.columns = headers.map((header) => ({
    header,
    key: header,
    width: ['description', 'name', 'label', 'title', 'categorySlugs', 'image', 'bannerImage'].includes(header)
      ? 28
      : 16,
  }))
  for (const row of rows) {
    const line = {}
    for (const header of headers) line[header] = excelCell(row[header])
    sheet.addRow(line)
  }
  sheet.getRow(1).font = { bold: true }
  return Buffer.from(await workbook.xlsx.writeBuffer())
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
  'categorySlugs',
  'badge',
  'isBestSeller',
  'isImported',
  'isFeatured',
  'stock',
  'sortOrder',
  'isActive',
]

function productCategorySlugs(product) {
  const fromLinks = (product.categoryLinks || [])
    .map((row) => row.category?.slug)
    .filter(Boolean)
  if (fromLinks.length) return [...new Set(fromLinks)]
  return product.category?.slug ? [product.category.slug] : []
}

function parseCategorySlugs(row) {
  const raw = row.categoryslugs ?? row.categorySlugs ?? row.categoryslug ?? row.categorySlug ?? row.categories ?? ''
  return [...new Set(String(raw)
    .split(/[,|;]+/)
    .map((item) => slugify(item))
    .filter(Boolean))]
}

function moneyNumber(value) {
  if (value == null || value === '') return ''
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : String(value)
}

async function categoryRows() {
  const categories = await prisma.category.findMany({ orderBy: [{ sortOrder: 'asc' }, { label: 'asc' }] })
  return categories.map((item) => ({
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
}

async function productRows() {
  const products = await prisma.product.findMany({
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    include: {
      category: { select: { slug: true } },
      categoryLinks: { include: { category: { select: { slug: true } } } },
    },
  })

  return products.map((item) => ({
    slug: item.slug,
    name: item.name,
    description: item.description || '',
    image: item.image || '',
    priceValue: moneyNumber(item.priceValue),
    oldPriceValue: item.oldPriceValue == null ? '' : moneyNumber(item.oldPriceValue),
    currency: item.currency || 'INR',
    weight: item.weight || '',
    categorySlugs: productCategorySlugs(item).join(', '),
    badge: item.badge || '',
    isBestSeller: item.isBestSeller ? 'true' : 'false',
    isImported: item.isImported ? 'true' : 'false',
    isFeatured: item.isFeatured ? 'true' : 'false',
    stock: item.stock,
    sortOrder: item.sortOrder,
    isActive: item.isActive ? 'true' : 'false',
  }))
}

export async function exportCategoriesCsv() {
  return rowsToCsv(CATEGORY_HEADERS, await categoryRows())
}

export async function exportCategoriesXlsx() {
  return rowsToXlsx('Categories', CATEGORY_HEADERS, await categoryRows())
}

export async function exportProductsCsv() {
  return rowsToCsv(PRODUCT_HEADERS, await productRows())
}

export async function exportProductsXlsx() {
  return rowsToXlsx('Products', PRODUCT_HEADERS, await productRows())
}

export async function importCategoriesRows(rows) {
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

export async function importProductsRows(rows) {
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

      const priceValue = toNumber(row.pricevalue ?? row.priceValue ?? row.price, NaN)
      if (!Number.isFinite(priceValue) || priceValue < 0) {
        throw new Error('A valid price is required.')
      }

      const slug = slugify(row.slug || name)
      const categorySlugs = parseCategorySlugs(row)
      const categoryIds = categorySlugs
        .map((categorySlug) => categoryBySlug.get(categorySlug))
        .filter(Boolean)
      const categoryId = categoryIds[0] || null

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
      const saved = existing
        ? await prisma.product.update({ where: { id: existing.id }, data })
        : await prisma.product.create({ data })
      await syncProductCategories(saved.id, categoryIds)
      if (existing) updated += 1
      else created += 1
    } catch (error) {
      errors.push({ line, message: error.message || 'Could not import row.' })
    }
  }

  return { created, updated, errors }
}

export async function importCategoriesCsv(csvText) {
  return importCategoriesRows(parseCsv(csvText))
}

export async function importProductsCsv(csvText) {
  return importProductsRows(parseCsv(csvText))
}

export async function importCategoriesFile(buffer, filename) {
  return importCategoriesRows(await parseCatalogFile(buffer, filename))
}

export async function importProductsFile(buffer, filename) {
  return importProductsRows(await parseCatalogFile(buffer, filename))
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
      categorySlugs: 'fresh-fruits, imported',
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

export async function categoryImportTemplateXlsx() {
  return rowsToXlsx('Categories', CATEGORY_HEADERS, [
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

export async function productImportTemplateXlsx() {
  return rowsToXlsx('Products', PRODUCT_HEADERS, [
    {
      slug: 'alphonso-mango',
      name: 'Alphonso Mango',
      description: 'Sweet and juicy alphonso mangoes.',
      image: '/uploads/products/mango.jpg',
      priceValue: 199,
      oldPriceValue: 249,
      currency: 'INR',
      weight: '1 kg',
      categorySlugs: 'fresh-fruits, imported',
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
