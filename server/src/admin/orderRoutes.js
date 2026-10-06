import { Router } from 'express'
import { hasPermission } from './permissions.js'
import { generateOrderInvoicePdf } from '../services/invoice.js'

function requireOrderAdmin() {
  return (req, res, next) => {
    const admin = req.session?.adminUser
    if (!hasPermission(admin, 'manageOrders')) {
      return res.status(403).json({ message: 'You do not have permission to view or download invoices.' })
    }
    return next()
  }
}

export function buildOrderRoutes() {
  const router = Router()

  router.get('/:orderId/invoice', requireOrderAdmin(), async (req, res, next) => {
    try {
      const { buffer, order, invoiceNo } = await generateOrderInvoicePdf(req.params.orderId)
      const filename = `invoice-${order.orderNo}.pdf`

      const disposition = req.query.download === '1' ? 'attachment' : 'inline'
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', `${disposition}; filename="${filename}"`)
      res.setHeader('Content-Length', buffer.length)
      return res.send(buffer)
    } catch (error) {
      if (error.status === 404) {
        return res.status(404).json({ message: error.message })
      }
      return next(error)
    }
  })

  return router
}
