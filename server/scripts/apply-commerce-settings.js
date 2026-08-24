import dotenv from 'dotenv'
import { prisma } from '../src/lib/prisma.js'

dotenv.config()

async function tableExists(name) {
  const rows = await prisma.$queryRaw`
    SELECT 1 AS ok FROM information_schema.TABLES
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ${name} LIMIT 1
  `
  return Boolean(rows[0])
}

async function columnExists(table, column) {
  const rows = await prisma.$queryRaw`
    SELECT 1 AS ok FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ${table} AND COLUMN_NAME = ${column} LIMIT 1
  `
  return Boolean(rows[0])
}

async function fkExists(table, name) {
  const rows = await prisma.$queryRaw`
    SELECT 1 AS ok FROM information_schema.TABLE_CONSTRAINTS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = ${table}
      AND CONSTRAINT_NAME = ${name}
      AND CONSTRAINT_TYPE = 'FOREIGN KEY'
    LIMIT 1
  `
  return Boolean(rows[0])
}

async function indexExists(table, name) {
  const rows = await prisma.$queryRaw`
    SELECT 1 AS ok FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ${table} AND INDEX_NAME = ${name}
    LIMIT 1
  `
  return Boolean(rows[0])
}

async function columnMeta(table, column) {
  const rows = await prisma.$queryRaw`
    SELECT
      COLUMN_TYPE AS columnType,
      CHARACTER_SET_NAME AS charsetName,
      COLLATION_NAME AS collationName
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ${table} AND COLUMN_NAME = ${column}
    LIMIT 1
  `
  return rows[0] || null
}

function columnSql(meta, nullable) {
  let sql = meta.columnType
  if (meta.charsetName) sql += ` CHARACTER SET ${meta.charsetName}`
  if (meta.collationName) sql += ` COLLATE ${meta.collationName}`
  sql += nullable ? ' NULL' : ' NOT NULL'
  return sql
}

async function addColumn(table, column, definition) {
  if (await columnExists(table, column)) {
    console.log(`skip ${table}.${column}`)
    return
  }
  await prisma.$executeRawUnsafe(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`)
  console.log(`added ${table}.${column}`)
}

async function dropColumn(table, column) {
  if (!(await columnExists(table, column))) {
    console.log(`skip drop ${table}.${column}`)
    return
  }
  await prisma.$executeRawUnsafe(`ALTER TABLE \`${table}\` DROP COLUMN \`${column}\``)
  console.log(`dropped ${table}.${column}`)
}

async function main() {
  if (!(await tableExists('Setting'))) {
    throw new Error('Setting table is missing. Run the customer schema script first.')
  }

  await addColumn('Setting', 'shippingFee', 'DECIMAL(10,2) NOT NULL DEFAULT 25.00')
  await addColumn('Setting', 'handlingFee', 'DECIMAL(10,2) NOT NULL DEFAULT 2.00')

  for (const column of [
    'colorPrimary',
    'colorPrimaryLight',
    'colorAccent',
    'colorBackground',
    'colorFooterFrom',
    'colorFooterVia',
    'fontFamily',
  ]) {
    await dropColumn('Setting', column)
  }

  if (await tableExists('Coupon')) {
    await addColumn('Coupon', 'applyOn', "VARCHAR(32) NOT NULL DEFAULT 'cart'")
    await addColumn('Coupon', 'targetType', "VARCHAR(32) NOT NULL DEFAULT 'all'")
    await addColumn('Coupon', 'targetSlugs', 'JSON NULL')
    await addColumn('Coupon', 'usageType', "VARCHAR(32) NOT NULL DEFAULT 'unlimited'")
  }

  const idMeta =
    (await columnMeta('Customer', 'id')) ||
    (await columnMeta('Coupon', 'id')) || {
      columnType: 'VARCHAR(191)',
      charsetName: 'utf8mb4',
      collationName: 'utf8mb4_unicode_ci',
    }

  if (!(await tableExists('CouponRedemption'))) {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE \`CouponRedemption\` (
        \`id\` ${columnSql(idMeta, false)},
        \`couponId\` ${columnSql(idMeta, false)},
        \`customerId\` ${columnSql(idMeta, false)},
        \`orderId\` ${columnSql(idMeta, true)},
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        PRIMARY KEY (\`id\`)
      )
    `)
    console.log('created CouponRedemption')
  }

  if (!(await indexExists('CouponRedemption', 'CouponRedemption_couponId_customerId_idx'))) {
    await prisma.$executeRawUnsafe(
      'CREATE INDEX `CouponRedemption_couponId_customerId_idx` ON `CouponRedemption` (`couponId`, `customerId`)',
    )
  }
  if (!(await indexExists('CouponRedemption', 'CouponRedemption_customerId_idx'))) {
    await prisma.$executeRawUnsafe(
      'CREATE INDEX `CouponRedemption_customerId_idx` ON `CouponRedemption` (`customerId`)',
    )
  }

  if (!(await fkExists('CouponRedemption', 'CouponRedemption_couponId_fkey'))) {
    await prisma.$executeRawUnsafe(`
      ALTER TABLE \`CouponRedemption\`
      ADD CONSTRAINT \`CouponRedemption_couponId_fkey\`
      FOREIGN KEY (\`couponId\`) REFERENCES \`Coupon\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
    `)
  }
  if (!(await fkExists('CouponRedemption', 'CouponRedemption_customerId_fkey'))) {
    await prisma.$executeRawUnsafe(`
      ALTER TABLE \`CouponRedemption\`
      ADD CONSTRAINT \`CouponRedemption_customerId_fkey\`
      FOREIGN KEY (\`customerId\`) REFERENCES \`Customer\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
    `)
  }

  console.log('Commerce settings and coupon columns are ready.')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
