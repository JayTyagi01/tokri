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

// Uploads public host. Live evidence (2026-08-31):
// server.tokriii.com/uploads → 502, tokriii.com/uploads → 200.
// If API_URL points at the broken subdomain and PUBLIC_ASSET_URL is unset, fall back automatically.
function resolvePublicAssetUrl() {
  if (process.env.PUBLIC_ASSET_URL) {
    return stripTrailingSlash(process.env.PUBLIC_ASSET_URL)
  }
  if (apiUrl.includes('server.tokriii.com')) {
    return 'https://tokriii.com'
  }
  return apiUrl
}

const publicAssetUrl = resolvePublicAssetUrl()

const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((origin) => stripTrailingSlash(origin.trim())).filter(Boolean)
  : [clientUrl, appUrl].filter((value, index, list) => value && list.indexOf(value) === index)

export const env = {
  port,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl,
  appUrl,
  apiUrl,
  publicAssetUrl,
  corsOrigins,
  trustProxy: process.env.TRUST_PROXY === 'true' || process.env.NODE_ENV === 'production',
  adminPath: adminPath.startsWith('/') ? adminPath : `/${adminPath}`,
  adminEmail: process.env.ADMIN_EMAIL || 'admin@tokriii.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
  sessionSecret: process.env.SESSION_SECRET || 'dev-session-secret',
  jwtSecret: process.env.JWT_SECRET || process.env.SESSION_SECRET || 'dev-session-secret',
  jwtExpiresInSeconds: Number(process.env.JWT_EXPIRES_IN_SECONDS) || 60 * 60 * 24 * 30,
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || 'Tokriii <noreply@tokriii.com>',
  },
}
