import dotenv from 'dotenv'

dotenv.config()

function stripTrailingSlash(value) {
  return String(value || '').replace(/\/+$/, '')
}

const port = Number(process.env.PORT) || 5222
const adminPath = process.env.ADMIN_PATH || '/tokri-backoffice'
const clientUrl = stripTrailingSlash(process.env.CLIENT_URL || 'http://localhost:5222')
const appUrl = stripTrailingSlash(process.env.APP_URL || clientUrl)
const apiUrl = stripTrailingSlash(process.env.API_URL || appUrl || `http://localhost:${port}`)

const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((origin) => stripTrailingSlash(origin.trim())).filter(Boolean)
  : [clientUrl, appUrl].filter((value, index, list) => value && list.indexOf(value) === index)

export const env = {
  port,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl,
  appUrl,
  apiUrl,
  corsOrigins,
  trustProxy: process.env.TRUST_PROXY === 'true' || process.env.NODE_ENV === 'production',
  adminPath: adminPath.startsWith('/') ? adminPath : `/${adminPath}`,
  adminEmail: process.env.ADMIN_EMAIL || 'admin@tokriii.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
  sessionSecret: process.env.SESSION_SECRET || 'dev-session-secret',
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || 'Tokriii <noreply@tokriii.com>',
  },
}
