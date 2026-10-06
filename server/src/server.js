import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { env } from './config/env.js'
import { buildAdminRouter } from './admin/index.js'
import adminAuthRouter from './admin/authRoutes.js'
import partnerPagesRouter from './routes/partnerPages.js'
import { handleRazorpayWebhook } from './routes/webhooks.js'
import { handleRazorpayCheckoutCallback } from './routes/checkout.js'
import apiRouter from './routes/api.js'
import mediaRouter from './routes/media.js'
import { errorHandler } from './middleware/errorHandler.js'
import { prisma } from './lib/prisma.js'
import { recoverPendingOnlinePayments } from './services/checkout.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadsPath = path.join(__dirname, '../uploads')
const distPath = path.join(__dirname, '../../dist')
const hasDist = fs.existsSync(path.join(distPath, 'index.html'))

const app = express()

if (env.trustProxy) {
  app.set('trust proxy', 1)
}

app.use(
  cors({
    origin: env.corsOrigins,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-User-Phone'],
  }),
)

app.use('/uploads', express.static(uploadsPath))

// Serve storefront from dist/ when present (staging/single-host). Live often uses nginx for this.
if (hasDist) {
  app.use(express.static(distPath, { index: false, maxAge: '1h' }))
} else {
  app.get('/', (_req, res) => {
    res.json({
      name: 'Tokriii API',
      api: '/api/v1',
      health: '/api/v1/health',
    })
  })
}

// Password reset pages (before AdminJS; no global body parser here)
app.use(env.adminPath, adminAuthRouter)
app.use(`${env.adminPath}/partner`, partnerPagesRouter)
app.use('/partner', partnerPagesRouter)

app.post('/api/v1/webhooks/razorpay', express.raw({ type: 'application/json' }), handleRazorpayWebhook)
app.post(
  '/api/v1/checkout/razorpay-callback',
  express.urlencoded({ extended: true }),
  handleRazorpayCheckoutCallback,
)

// CMS theme assets
app.use(
  `${env.adminPath}/assets`,
  express.static(path.join(__dirname, 'admin/assets')),
)

// AdminJS must be mounted BEFORE express.json() on overlapping paths
const { admin, adminRouter } = await buildAdminRouter()
app.use(admin.options.rootPath, adminRouter)

// API routes use body parser (after AdminJS)
const api = express.Router()
api.use(express.json({ limit: '2mb' }))
api.use(express.urlencoded({ extended: true }))
api.use('/', apiRouter)
api.use('/media', mediaRouter)
app.use('/api/v1', api)

// SPA fallback for storefront routes (must be after API + admin)
if (hasDist) {
  app.get('*', (req, res, next) => {
    if (
      req.path.startsWith('/api') ||
      req.path.startsWith(env.adminPath) ||
      req.path.startsWith('/admin') ||
      req.path.startsWith('/uploads') ||
      req.path.startsWith('/partner')
    ) {
      return next()
    }
    return res.sendFile(path.join(distPath, 'index.html'))
  })
}

app.use(errorHandler)

async function start() {
  try {
    await prisma.$connect()
    app.listen(env.port, () => {
      console.log(`Tokriii server listening on port ${env.port}`)
      console.log(`Public site: ${env.clientUrl}`)
      console.log(`Admin panel: ${env.appUrl}${env.adminPath}`)
      console.log(`API: ${env.apiUrl}/api/v1`)
      console.log(`Storefront dist: ${hasDist ? distPath : 'not found (API-only root)'}`)
      const recover = () =>
        recoverPendingOnlinePayments()
          .then((ids) => {
            if (ids.length) console.log('Recovered Razorpay payments:', ids.join(', '))
          })
          .catch((error) => console.error('Razorpay payment recovery failed:', error))
      setTimeout(recover, 8000)
      setInterval(recover, 5 * 60 * 1000)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

start()
