import { Router } from 'express'
import multer from 'multer'
import { hasPermission } from './permissions.js'
import {
  exportCategoriesCsv,
  exportProductsCsv,
  importCategoriesCsv,
  importProductsCsv,
  categoryImportTemplateCsv,
  productImportTemplateCsv,
} from '../services/catalogImportExport.js'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
})

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

  router.post(
    '/categories/import',
    requireAdminPermission('manageCatalog'),
    upload.single('file'),
    async (req, res, next) => {
      try {
        const csvText = req.file?.buffer?.toString('utf-8') || String(req.body?.csv || '')
        if (!csvText.trim()) {
          return res.status(400).json({ message: 'Please upload a CSV file.' })
        }
        const result = await importCategoriesCsv(csvText)
        return res.json(result)
      } catch (error) {
        return next(error)
      }
    },
  )

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

  router.post(
    '/products/import',
    requireAdminPermission('manageProducts'),
    upload.single('file'),
    async (req, res, next) => {
      try {
        const csvText = req.file?.buffer?.toString('utf-8') || String(req.body?.csv || '')
        if (!csvText.trim()) {
          return res.status(400).json({ message: 'Please upload a CSV file.' })
        }
        const result = await importProductsCsv(csvText)
        return res.json(result)
      } catch (error) {
        return next(error)
      }
    },
  )

  return router
}
