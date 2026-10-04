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

async function addColumn(table, column, definition) {
  if (await columnExists(table, column)) {
    console.log(`skip ${table}.${column}`)
    return
  }
  await prisma.$executeRawUnsafe(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`)
  console.log(`added ${table}.${column}`)
}

async function main() {
  const columns = [
    ['dateOfBirth', 'DATETIME(3) NULL'],
    ['fatherName', 'VARCHAR(191) NULL'],
    ['panNumber', 'VARCHAR(20) NULL'],
    ['aadhaarNumber', 'VARCHAR(20) NULL'],
    ['addressLine1', 'VARCHAR(191) NULL'],
    ['addressLine2', 'VARCHAR(191) NULL'],
    ['city', 'VARCHAR(191) NULL'],
    ['state', 'VARCHAR(191) NULL'],
    ['pincode', 'VARCHAR(10) NULL'],
    ['permanentAddress', 'TEXT NULL'],
    ['emergencyName', 'VARCHAR(191) NULL'],
    ['emergencyPhone', 'VARCHAR(20) NULL'],
    ['vehicleType', 'VARCHAR(64) NULL'],
    ['vehicleNumber', 'VARCHAR(32) NULL'],
    ['accountHolderName', 'VARCHAR(191) NULL'],
    ['accountNumber', 'VARCHAR(64) NULL'],
    ['ifscCode', 'VARCHAR(20) NULL'],
  ]

  for (const [column, definition] of columns) {
    await addColumn('DeliveryPartner', column, definition)
  }

  // Move legacy `address` values into addressLine1 when needed.
  if (await columnExists('DeliveryPartner', 'address')) {
    await prisma.$executeRawUnsafe(`
      UPDATE \`DeliveryPartner\`
      SET \`addressLine1\` = LEFT(\`address\`, 191)
      WHERE (\`addressLine1\` IS NULL OR \`addressLine1\` = '')
        AND \`address\` IS NOT NULL
        AND \`address\` <> ''
    `)
    console.log('copied DeliveryPartner.address → addressLine1')
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
