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

async function main() {
  console.log('Applying customer / cart schema...')

  if (!(await tableExists('Customer'))) {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE \`Customer\` (
        \`id\` VARCHAR(191) NOT NULL,
        \`name\` VARCHAR(191) NULL,
        \`phone\` VARCHAR(191) NOT NULL,
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
  } else if (!(await columnExists('Customer', 'dateOfBirth'))) {
    await prisma.$executeRawUnsafe(`ALTER TABLE \`Customer\` ADD COLUMN \`dateOfBirth\` DATE NULL`)
    console.log('Added Customer.dateOfBirth')
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
      await prisma.$executeRawUnsafe(`ALTER TABLE \`Order\` ADD COLUMN \`customerId\` VARCHAR(191) NULL`)
    }
    if (await columnExists('Order', 'userId')) {
      await prisma.$executeRawUnsafe(`UPDATE \`Order\` SET \`customerId\` = \`userId\` WHERE \`customerId\` IS NULL AND \`userId\` IS NOT NULL`)
      await dropForeignKeys('Order', 'userId')
      await dropIndexIfExists('Order', 'Order_userId_idx')
      await prisma.$executeRawUnsafe(`ALTER TABLE \`Order\` DROP COLUMN \`userId\``)
      console.log('Moved Order.userId to Order.customerId')
    }
    try {
      await dropForeignKeys('Order', 'customerId')
      await prisma.$executeRawUnsafe(`
        ALTER TABLE \`Order\`
        ADD CONSTRAINT \`Order_customerId_fkey\`
        FOREIGN KEY (\`customerId\`) REFERENCES \`Customer\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
      `)
    } catch (error) {
      if (!String(error.message || '').includes('Duplicate')) throw error
    }
    const hasIndex = await prisma.$queryRaw`
      SELECT 1 AS ok FROM information_schema.STATISTICS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Order' AND INDEX_NAME = 'Order_customerId_idx' LIMIT 1
    `
    if (!hasIndex[0]) {
      await prisma.$executeRawUnsafe(`CREATE INDEX \`Order_customerId_idx\` ON \`Order\`(\`customerId\`)`)
    }
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
    if (await columnExists(table, 'customerId')) return
    if (!(await columnExists(table, 'userId'))) return

    await dropForeignKeys(table, 'userId')
    await dropIndexIfExists(table, `${table}_userId_key`)
    await dropIndexIfExists(table, `${table}_userId_idx`)
    await prisma.$executeRawUnsafe(
      `DELETE FROM \`${table}\` WHERE \`userId\` NOT IN (SELECT \`id\` FROM \`Customer\`)`,
    )
    await prisma.$executeRawUnsafe(`ALTER TABLE \`${table}\` CHANGE \`userId\` \`customerId\` VARCHAR(191) NOT NULL`)
    if (unique) {
      await prisma.$executeRawUnsafe(`ALTER TABLE \`${table}\` ADD UNIQUE KEY \`${table}_customerId_key\` (\`customerId\`)`)
    } else {
      await prisma.$executeRawUnsafe(`CREATE INDEX \`${table}_customerId_idx\` ON \`${table}\`(\`customerId\`)`)
    }
    try {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE \`${table}\`
        ADD CONSTRAINT \`${table}_customerId_fkey\`
        FOREIGN KEY (\`customerId\`) REFERENCES \`Customer\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      `)
    } catch (error) {
      if (!String(error.message || '').includes('Duplicate')) throw error
    }
    console.log(`Renamed ${table}.userId to customerId`)
  }

  await renameUserIdToCustomerId('Cart', true)
  await renameUserIdToCustomerId('DeviceToken', false)

  if (!(await tableExists('Cart'))) {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE \`Cart\` (
        \`id\` VARCHAR(191) NOT NULL,
        \`customerId\` VARCHAR(191) NOT NULL,
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
    await prisma.$executeRawUnsafe(`
      CREATE TABLE \`CartItem\` (
        \`id\` VARCHAR(191) NOT NULL,
        \`cartId\` VARCHAR(191) NOT NULL,
        \`productId\` VARCHAR(191) NOT NULL,
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
        \`id\` VARCHAR(191) NOT NULL,
        \`customerId\` VARCHAR(191) NOT NULL,
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
