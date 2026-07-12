import dotenv from 'dotenv'

dotenv.config()

const adminPath = process.env.ADMIN_PATH || '/tokri-backoffice'

export const env = {
  port: Number(process.env.PORT) || 5222,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
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
  appUrl: process.env.APP_URL || `http://localhost:${Number(process.env.PORT) || 5222}`,
}
