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

async function main() {
  const idMeta =
    (await columnMeta('Product', 'id')) ||
    (await columnMeta('Category', 'id')) || {
      columnType: 'VARCHAR(191)',
      charsetName: 'utf8mb4',
      collationName: 'utf8mb4_unicode_ci',
    }

  if (!(await tableExists('ProductCategory'))) {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE \`ProductCategory\` (
        \`productId\` ${columnSql(idMeta, false)},
        \`categoryId\` ${columnSql(idMeta, false)},
        PRIMARY KEY (\`productId\`, \`categoryId\`)
      )
    `)
    console.log('created ProductCategory')
  }

  if (!(await indexExists('ProductCategory', 'ProductCategory_categoryId_idx'))) {
    await prisma.$executeRawUnsafe(
      'CREATE INDEX `ProductCategory_categoryId_idx` ON `ProductCategory` (`categoryId`)',
    )
  }

  if (!(await fkExists('ProductCategory', 'ProductCategory_productId_fkey'))) {
    await prisma.$executeRawUnsafe(`
      ALTER TABLE \`ProductCategory\`
      ADD CONSTRAINT \`ProductCategory_productId_fkey\`
      FOREIGN KEY (\`productId\`) REFERENCES \`Product\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
    `)
  }

  if (!(await fkExists('ProductCategory', 'ProductCategory_categoryId_fkey'))) {
    await prisma.$executeRawUnsafe(`
      ALTER TABLE \`ProductCategory\`
      ADD CONSTRAINT \`ProductCategory_categoryId_fkey\`
      FOREIGN KEY (\`categoryId\`) REFERENCES \`Category\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
    `)
  }

  const copied = await prisma.$executeRawUnsafe(`
    INSERT IGNORE INTO \`ProductCategory\` (\`productId\`, \`categoryId\`)
    SELECT \`id\`, \`categoryId\` FROM \`Product\`
    WHERE \`categoryId\` IS NOT NULL AND \`categoryId\` <> ''
  `)
  console.log(`copied existing product categories (${copied})`)
  console.log('Product categories are ready.')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
