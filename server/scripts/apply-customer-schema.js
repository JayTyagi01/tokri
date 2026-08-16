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

function columnSql(meta, nullable) {
  let sql = meta.columnType
  if (meta.charsetName) sql += ` CHARACTER SET ${meta.charsetName}`
  if (meta.collationName) sql += ` COLLATE ${meta.collationName}`
  sql += nullable ? ' NULL' : ' NOT NULL'
  return sql
}

async function idMeta() {
  for (const [table, column] of [
    ['Product', 'id'],
    ['User', 'id'],
    ['Customer', 'id'],
  ]) {
    if ((await tableExists(table)) && (await columnExists(table, column))) {
      const meta = await columnMeta(table, column)
      if (meta?.columnType) return meta
    }
  }
  return {
    columnType: 'VARCHAR(191)',
    charsetName: 'utf8mb4',
    collationName: 'utf8mb4_unicode_ci',
  }
}

async function alignColumn(table, column, meta, nullable) {
  await prisma.$executeRawUnsafe(
    `ALTER TABLE \`${table}\` MODIFY \`${column}\` ${columnSql(meta, nullable)}`,
  )
}

async function dropForeignKeys(table, column) {
  const rows = await prisma.$queryRaw`
    SELECT CONSTRAINT_NAME AS name FROM information_schema.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = ${table}
      AND COLUMN_NAME = ${column}
      AND REFERENCED_TABLE_NAME IS NOT NULL
  `
  for (const row of rows) {
    await prisma.$executeRawUnsafe(`ALTER TABLE \`${table}\` DROP FOREIGN KEY \`${row.name}\``)
  }
}

async function dropIndexIfExists(table, indexName) {
  const rows = await prisma.$queryRaw`
    SELECT 1 AS ok FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ${table} AND INDEX_NAME = ${indexName} LIMIT 1
  `
  if (rows[0]) {
    await prisma.$executeRawUnsafe(`ALTER TABLE \`${table}\` DROP INDEX \`${indexName}\``)
  }
}

async function addCustomerFk(table, column, { unique = false, nullable = false, onDelete = 'CASCADE' } = {}) {
  const ids = await idMeta()
  await alignColumn('Customer', 'id', ids, false)
  await alignColumn(table, column, ids, nullable)

  if (nullable) {
    await prisma.$executeRawUnsafe(`
      UPDATE \`${table}\` t
      LEFT JOIN \`Customer\` c ON c.id = t.\`${column}\`
      SET t.\`${column}\` = NULL
      WHERE t.\`${column}\` IS NOT NULL AND c.id IS NULL
    `)
  } else {
    await prisma.$executeRawUnsafe(
      `DELETE FROM \`${table}\` WHERE \`${column}\` NOT IN (SELECT \`id\` FROM \`Customer\`)`,
    )
  }

  const fkName = `${table}_${column}_fkey`
  if (await fkExists(table, fkName)) return

  const indexName = unique ? `${table}_${column}_key` : `${table}_${column}_idx`
  const hasIndex = await prisma.$queryRaw`
    SELECT 1 AS ok FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ${table} AND INDEX_NAME = ${indexName} LIMIT 1
  `
  if (!hasIndex[0]) {
    if (unique) {
      await prisma.$executeRawUnsafe(
        `ALTER TABLE \`${table}\` ADD UNIQUE KEY \`${indexName}\` (\`${column}\`)`,
      )
    } else {
      await prisma.$executeRawUnsafe(
        `CREATE INDEX \`${indexName}\` ON \`${table}\`(\`${column}\`)`,
      )
    }
  }

  await prisma.$executeRawUnsafe(`
    ALTER TABLE \`${table}\`
    ADD CONSTRAINT \`${fkName}\`
    FOREIGN KEY (\`${column}\`) REFERENCES \`Customer\`(\`id\`) ON DELETE ${onDelete} ON UPDATE CASCADE
  `)
}

async function main() {
  console.log('Applying customer / cart schema...')
  const ids = await idMeta()
  const idSql = columnSql(ids, false)
  const idSqlNull = columnSql(ids, true)
  const phoneSql = columnSql({ ...ids, columnType: 'VARCHAR(191)' }, false)
  const nameSql = columnSql({ ...ids, columnType: 'VARCHAR(191)' }, true)

  if (!(await tableExists('Customer'))) {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE \`Customer\` (
        \`id\` ${idSql},
        \`name\` ${nameSql},
        \`phone\` ${phoneSql},
        \`dateOfBirth\` DATE NULL,
        \`addresses\` JSON NULL,
        \`isActive\` BOOLEAN NOT NULL DEFAULT true,
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`updatedAt\` DATETIME(3) NOT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`Customer_phone_key\` (\`phone\`)
      )
    `)
    console.log('Created Customer table')
  } else {
    await alignColumn('Customer', 'id', ids, false)
    if (!(await columnExists('Customer', 'dateOfBirth'))) {
      await prisma.$executeRawUnsafe(`ALTER TABLE \`Customer\` ADD COLUMN \`dateOfBirth\` DATE NULL`)
      console.log('Added Customer.dateOfBirth')
    }
  }

  if (await tableExists('User') && (await columnExists('User', 'phone'))) {
    await prisma.$executeRawUnsafe(`
      INSERT IGNORE INTO \`Customer\` (\`id\`, \`name\`, \`phone\`, \`addresses\`, \`isActive\`, \`createdAt\`, \`updatedAt\`)
      SELECT \`id\`, \`name\`, \`phone\`, \`addresses\`, \`isActive\`, \`createdAt\`, \`updatedAt\`
      FROM \`User\`
      WHERE \`role\` = 'customer' AND \`phone\` IS NOT NULL AND \`phone\` <> ''
    `)
    console.log('Copied shoppers from User into Customer')
  }

  if (await tableExists('Order')) {
    if (!(await columnExists('Order', 'customerId'))) {
      await prisma.$executeRawUnsafe(`ALTER TABLE \`Order\` ADD COLUMN \`customerId\` ${idSqlNull}`)
    }
    if (await columnExists('Order', 'userId')) {
      await prisma.$executeRawUnsafe(
        `UPDATE \`Order\` SET \`customerId\` = \`userId\` WHERE \`customerId\` IS NULL AND \`userId\` IS NOT NULL`,
      )
      await dropForeignKeys('Order', 'userId')
      await dropIndexIfExists('Order', 'Order_userId_idx')
      await prisma.$executeRawUnsafe(`ALTER TABLE \`Order\` DROP COLUMN \`userId\``)
      console.log('Moved Order.userId to Order.customerId')
    }
    await dropForeignKeys('Order', 'customerId')
    await addCustomerFk('Order', 'customerId', { unique: false, nullable: true, onDelete: 'SET NULL' })
    console.log('Linked Order.customerId to Customer')
  }

  if (await tableExists('User')) {
    await prisma.$executeRawUnsafe(`DELETE FROM \`User\` WHERE \`role\` = 'customer'`)
    if (await columnExists('User', 'phone')) {
      await dropIndexIfExists('User', 'User_phone_key')
      await prisma.$executeRawUnsafe(`ALTER TABLE \`User\` DROP COLUMN \`phone\``)
    }
    if (await columnExists('User', 'addresses')) {
      await prisma.$executeRawUnsafe(`ALTER TABLE \`User\` DROP COLUMN \`addresses\``)
    }
    await prisma.$executeRawUnsafe(`
      ALTER TABLE \`User\`
      MODIFY \`role\` ENUM('staff', 'admin', 'super_admin') NOT NULL DEFAULT 'staff'
    `)
    console.log('User table is now dashboard-only')
  }

  async function renameUserIdToCustomerId(table, unique = false) {
    if (!(await tableExists(table))) return
    if (await columnExists(table, 'customerId')) {
      await addCustomerFk(table, 'customerId', { unique, nullable: false, onDelete: 'CASCADE' })
      return
    }
    if (!(await columnExists(table, 'userId'))) return

    await dropForeignKeys(table, 'userId')
    await dropIndexIfExists(table, `${table}_userId_key`)
    await dropIndexIfExists(table, `${table}_userId_idx`)
    await prisma.$executeRawUnsafe(
      `DELETE FROM \`${table}\` WHERE \`userId\` NOT IN (SELECT \`id\` FROM \`Customer\`)`,
    )
    await prisma.$executeRawUnsafe(
      `ALTER TABLE \`${table}\` CHANGE \`userId\` \`customerId\` ${columnSql(ids, false)}`,
    )
    await addCustomerFk(table, 'customerId', { unique, nullable: false, onDelete: 'CASCADE' })
    console.log(`Renamed ${table}.userId to customerId`)
  }

  await renameUserIdToCustomerId('Cart', true)
  await renameUserIdToCustomerId('DeviceToken', false)

  if (!(await tableExists('Cart'))) {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE \`Cart\` (
        \`id\` ${idSql},
        \`customerId\` ${idSql},
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`updatedAt\` DATETIME(3) NOT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`Cart_customerId_key\` (\`customerId\`),
        CONSTRAINT \`Cart_customerId_fkey\` FOREIGN KEY (\`customerId\`) REFERENCES \`Customer\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      )
    `)
    console.log('Created Cart table')
  }

  if (!(await tableExists('CartItem'))) {
    const productId = (await columnMeta('Product', 'id')) || ids
    await prisma.$executeRawUnsafe(`
      CREATE TABLE \`CartItem\` (
        \`id\` ${idSql},
        \`cartId\` ${idSql},
        \`productId\` ${columnSql(productId, false)},
        \`quantity\` INT NOT NULL DEFAULT 1,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`CartItem_cartId_productId_key\` (\`cartId\`, \`productId\`),
        CONSTRAINT \`CartItem_cartId_fkey\` FOREIGN KEY (\`cartId\`) REFERENCES \`Cart\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT \`CartItem_productId_fkey\` FOREIGN KEY (\`productId\`) REFERENCES \`Product\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      )
    `)
    console.log('Created CartItem table')
  }

  if (!(await tableExists('DeviceToken'))) {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE \`DeviceToken\` (
        \`id\` ${idSql},
        \`customerId\` ${idSql},
        \`token\` VARCHAR(191) NOT NULL,
        \`platform\` VARCHAR(191) NOT NULL,
        \`provider\` VARCHAR(191) NOT NULL DEFAULT 'expo',
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`updatedAt\` DATETIME(3) NOT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`DeviceToken_token_key\` (\`token\`),
        INDEX \`DeviceToken_customerId_idx\` (\`customerId\`),
        CONSTRAINT \`DeviceToken_customerId_fkey\` FOREIGN KEY (\`customerId\`) REFERENCES \`Customer\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      )
    `)
    console.log('Created DeviceToken table')
  }

  console.log('Customer schema apply finished.')
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
