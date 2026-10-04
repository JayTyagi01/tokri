import dotenv from 'dotenv'
import { prisma } from '../src/lib/prisma.js'

dotenv.config()

async function columnExists(table, column) {
  const rows = await prisma.$queryRaw`
    SELECT 1 AS ok FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ${table} AND COLUMN_NAME = ${column} LIMIT 1
  `
  return Boolean(rows[0])
}

async function main() {
  if (await columnExists('Category', 'productDisplayLimit')) {
    console.log('skip Category.productDisplayLimit')
  } else {
    await prisma.$executeRawUnsafe(
      'ALTER TABLE `Category` ADD COLUMN `productDisplayLimit` INT NOT NULL DEFAULT 12',
    )
    console.log('added Category.productDisplayLimit')
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
