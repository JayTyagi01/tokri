import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import { prisma } from '../src/lib/prisma.js'

dotenv.config()

const adminEmail = process.env.ADMIN_EMAIL || 'admin@tokriii.com'
const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
const passwordHash = await bcrypt.hash(adminPassword, 10)

try {
  const user = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: passwordHash,
      role: 'admin',
      name: 'Tokriii Admin',
      username: 'tokriadmin',
      isActive: true,
    },
    create: {
      email: adminEmail,
      username: 'tokriadmin',
      password: passwordHash,
      role: 'admin',
      name: 'Tokriii Admin',
      isActive: true,
    },
  })

  await prisma.adminPermission.upsert({
    where: { userId: user.id },
    update: {
      manageProducts: true,
      manageCatalog: true,
      manageMedia: true,
      manageOrders: true,
      manageCoupons: true,
      manageContent: true,
      manageSettings: true,
      manageUsers: true,
    },
    create: {
      userId: user.id,
      manageProducts: true,
      manageCatalog: true,
      manageMedia: true,
      manageOrders: true,
      manageCoupons: true,
      manageContent: true,
      manageSettings: true,
      manageUsers: true,
    },
  })

  console.log('Admin login reset successfully.')
  const adminUrl = process.env.APP_URL || `http://localhost:${process.env.PORT || 5223}`
  console.log(`  URL:      ${adminUrl}${process.env.ADMIN_PATH || '/tokri-backoffice'}`)
  console.log(`  Email:    ${adminEmail}`)
  console.log(`  Username: tokriadmin`)
  console.log(`  Password: (value of ADMIN_PASSWORD in server/.env)`)
} catch (error) {
  console.error('Could not reset admin login:', error.message?.split('\n')[0])
  process.exitCode = 1
} finally {
  await prisma.$disconnect()
}
