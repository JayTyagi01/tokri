import { Router } from 'express'
import fs from 'fs/promises'
import { hasPermission } from './permissions.js'
import {
  exportCategoriesCsv,
  exportProductsCsv,
  importCategoriesCsv,
  importProductsCsv,
  categoryImportTemplateCsv,
  productImportTemplateCsv,
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

function sendCsv(res, filename, content) {
  res.setHeader('Content-Type', 'text/csv; charset=utf-8')
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
  return res.send(content)
}

function formidableUpload(req) {
  const raw = req.files?.file
  if (raw) return Array.isArray(raw) ? raw[0] : raw
  const values = req.files ? Object.values(req.files) : []
  const first = values.flatMap((value) => (Array.isArray(value) ? value : [value]))[0]
  return first || null
}

async function readCsvFromRequest(req) {
  const uploaded = formidableUpload(req)
  const diskPath = uploaded?.filepath || uploaded?.path
  if (diskPath) {
    try {
      return await fs.readFile(diskPath, 'utf-8')
    } finally {
      await fs.unlink(diskPath).catch(() => {})
    }
  }
  if (uploaded?.data) {
    return Buffer.from(uploaded.data).toString('utf-8')
  }
  if (req.file?.buffer) {
    return req.file.buffer.toString('utf-8')
  }
  return String(req.body?.csv || req.fields?.csv || '')
}

export function buildCatalogRoutes() {
  const router = Router()

  router.get('/categories/export', requireAdminPermission('manageCatalog'), async (_req, res, next) => {
    try {
      const csv = await exportCategoriesCsv()
      return sendCsv(res, 'tokri-categories.csv', csv)
    } catch (error) {
      return next(error)
    }
  })

  router.get(
    '/categories/template',
    requireAdminPermission('manageCatalog'),
    (_req, res) => sendCsv(res, 'tokri-categories-template.csv', categoryImportTemplateCsv()),
  )

  router.post('/categories/import', requireAdminPermission('manageCatalog'), async (req, res, next) => {
    try {
      const csvText = await readCsvFromRequest(req)
      if (!String(csvText || '').trim()) {
        return res.status(400).json({ message: 'Please upload a CSV file.' })
      }
      const result = await importCategoriesCsv(csvText)
      return res.json(result)
    } catch (error) {
      return next(error)
    }
  })

  router.get('/products/export', requireAdminPermission('manageProducts'), async (_req, res, next) => {
    try {
      const csv = await exportProductsCsv()
      return sendCsv(res, 'tokri-products.csv', csv)
    } catch (error) {
      return next(error)
    }
  })

  router.get(
    '/products/template',
    requireAdminPermission('manageProducts'),
    (_req, res) => sendCsv(res, 'tokri-products-template.csv', productImportTemplateCsv()),
  )

  router.post('/products/import', requireAdminPermission('manageProducts'), async (req, res, next) => {
    try {
      const csvText = await readCsvFromRequest(req)
      if (!String(csvText || '').trim()) {
        return res.status(400).json({ message: 'Please upload a CSV file.' })
      }
      const result = await importProductsCsv(csvText)
      return res.json(result)
    } catch (error) {
      return next(error)
    }
  })

  return router
}
