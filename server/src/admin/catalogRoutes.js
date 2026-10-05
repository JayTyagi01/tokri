import { Router } from 'express'
import fs from 'fs/promises'
import { hasPermission } from './permissions.js'
import {
  exportCategoriesCsv,
  exportCategoriesXlsx,
  exportProductsCsv,
  exportProductsXlsx,
  importCategoriesFile,
  importProductsFile,
  categoryImportTemplateCsv,
  categoryImportTemplateXlsx,
  productImportTemplateCsv,
  productImportTemplateXlsx,
} from '../services/catalogImportExport.js'

function requireAdminPermission(key) {
  return (req, res, next) => {
    const admin = req.session?.adminUser
    if (!hasPermission(admin, key)) {
      return res.status(403).json({ message: 'You do not have permission for this action.' })
    }
    return next()
  }
}

function wantsExcel(req) {
  const raw = String(req.query.format || req.query.type || '').toLowerCase()
  return raw === 'xlsx' || raw === 'excel' || raw === 'xls'
}

function sendCsv(res, filename, content) {
  res.setHeader('Content-Type', 'text/csv; charset=utf-8')
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
  return res.send(content)
}

function sendXlsx(res, filename, buffer) {
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
  return res.send(buffer)
}

function formidableUpload(req) {
  const raw = req.files?.file
  if (raw) return Array.isArray(raw) ? raw[0] : raw
  const values = req.files ? Object.values(req.files) : []
  const first = values.flatMap((value) => (Array.isArray(value) ? value : [value]))[0]
  return first || null
}

async function readUploadFromRequest(req) {
  const uploaded = formidableUpload(req)
  const filename =
    uploaded?.originalFilename ||
    uploaded?.name ||
    req.file?.originalname ||
    req.body?.filename ||
    req.fields?.filename ||
    ''
  const diskPath = uploaded?.filepath || uploaded?.path
  if (diskPath) {
    try {
      return { buffer: await fs.readFile(diskPath), filename }
    } finally {
      await fs.unlink(diskPath).catch(() => {})
    }
  }
  if (uploaded?.data) {
    return { buffer: Buffer.from(uploaded.data), filename }
  }
  if (req.file?.buffer) {
    return { buffer: req.file.buffer, filename: filename || req.file.originalname || '' }
  }
  const csv = String(req.body?.csv || req.fields?.csv || '')
  if (csv.trim()) return { buffer: Buffer.from(csv, 'utf-8'), filename: filename || 'upload.csv' }
  return { buffer: Buffer.alloc(0), filename }
}

export function buildCatalogRoutes() {
  const router = Router()

  router.get('/categories/export', requireAdminPermission('manageCatalog'), async (req, res, next) => {
    try {
      if (wantsExcel(req)) {
        return sendXlsx(res, 'tokri-categories.xlsx', await exportCategoriesXlsx())
      }
      return sendCsv(res, 'tokri-categories.csv', await exportCategoriesCsv())
    } catch (error) {
      return next(error)
    }
  })

  router.get('/categories/template', requireAdminPermission('manageCatalog'), async (req, res, next) => {
    try {
      if (wantsExcel(req)) {
        return sendXlsx(res, 'tokri-categories-template.xlsx', await categoryImportTemplateXlsx())
      }
      return sendCsv(res, 'tokri-categories-template.csv', categoryImportTemplateCsv())
    } catch (error) {
      return next(error)
    }
  })

  router.post('/categories/import', requireAdminPermission('manageCatalog'), async (req, res, next) => {
    try {
      const { buffer, filename } = await readUploadFromRequest(req)
      if (!buffer?.length) {
        return res.status(400).json({ message: 'Please upload a CSV or Excel (.xlsx) file.' })
      }
      const result = await importCategoriesFile(buffer, filename)
      return res.json(result)
    } catch (error) {
      return next(error)
    }
  })

  router.get('/products/export', requireAdminPermission('manageProducts'), async (req, res, next) => {
    try {
      if (wantsExcel(req)) {
        return sendXlsx(res, 'tokri-products.xlsx', await exportProductsXlsx())
      }
      return sendCsv(res, 'tokri-products.csv', await exportProductsCsv())
    } catch (error) {
      return next(error)
    }
  })

  router.get('/products/template', requireAdminPermission('manageProducts'), async (req, res, next) => {
    try {
      if (wantsExcel(req)) {
        return sendXlsx(res, 'tokri-products-template.xlsx', await productImportTemplateXlsx())
      }
      return sendCsv(res, 'tokri-products-template.csv', productImportTemplateCsv())
    } catch (error) {
      return next(error)
    }
  })

  router.post('/products/import', requireAdminPermission('manageProducts'), async (req, res, next) => {
    try {
      const { buffer, filename } = await readUploadFromRequest(req)
      if (!buffer?.length) {
        return res.status(400).json({ message: 'Please upload a CSV or Excel (.xlsx) file.' })
      }
      const result = await importProductsFile(buffer, filename)
      return res.json(result)
    } catch (error) {
      return next(error)
    }
  })

  return router
}
