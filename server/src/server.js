import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { env } from './config/env.js'
import { buildAdminRouter } from './admin/index.js'
import adminAuthRouter from './admin/authRoutes.js'
import apiRouter from './routes/api.js'
import mediaRouter from './routes/media.js'
import { errorHandler } from './middleware/errorHandler.js'
import { prisma } from './lib/prisma.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadsPath = path.join(__dirname, '../uploads')

const app = express()

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
)

app.use('/uploads', express.static(uploadsPath))

app.get('/', (_req, res) => {
  res.json({
    name: 'Tokriii API',
    api: '/api/v1',
    health: '/api/v1/health',
  })
})

// Password reset pages (before AdminJS; no global body parser here)
app.use(env.adminPath, adminAuthRouter)

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

app.use(errorHandler)

async function start() {
  try {
    await prisma.$connect()
    app.listen(env.port, () => {
      console.log(`Tokriii server running on http://localhost:${env.port}`)
      console.log(`Admin panel: http://localhost:${env.port}${env.adminPath}`)
      console.log(`API: http://localhost:${env.port}/api/v1`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

start()
