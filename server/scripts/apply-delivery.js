import dotenv from 'dotenv'
import { prisma } from '../src/lib/prisma.js'
import { INDIA_STATES } from '../src/data/indiaStates.js'

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

async function addColumn(table, column, definition) {
  if (await columnExists(table, column)) {
    console.log(`skip ${table}.${column}`)
    return
  }
  await prisma.$executeRawUnsafe(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`)
  console.log(`added ${table}.${column}`)
}

async function createTable(name, sql) {
  if (await tableExists(name)) {
    console.log(`skip table ${name}`)
    return
  }
  await prisma.$executeRawUnsafe(sql)
  console.log(`created table ${name}`)
}

async function addIndex(table, indexName, columnsSql) {
  const rows = await prisma.$queryRaw`
    SELECT 1 AS ok FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ${table} AND INDEX_NAME = ${indexName}
    LIMIT 1
  `
  if (rows[0]) {
    console.log(`skip index ${indexName}`)
    return
  }
  await prisma.$executeRawUnsafe(`CREATE INDEX \`${indexName}\` ON \`${table}\`(${columnsSql})`)
  console.log(`added index ${indexName}`)
}

async function main() {
  if (!(await tableExists('Setting'))) {
    throw new Error('Setting table is missing.')
  }
  if (!(await tableExists('Order'))) {
    throw new Error('Order table is missing.')
  }

  await addColumn('Setting', 'codEnabled', 'BOOLEAN NOT NULL DEFAULT true')

  await createTable(
    'DeliveryPartner',
    `CREATE TABLE \`DeliveryPartner\` (
      \`id\` VARCHAR(191) NOT NULL,
      \`name\` VARCHAR(191) NOT NULL,
      \`email\` VARCHAR(191) NOT NULL,
      \`phone\` VARCHAR(191) NOT NULL,
      \`password\` VARCHAR(191) NULL,
      \`address\` TEXT NULL,
      \`isActive\` BOOLEAN NOT NULL DEFAULT false,
      \`notes\` TEXT NULL,
      \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updatedAt\` DATETIME(3) NOT NULL,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`DeliveryPartner_email_key\` (\`email\`),
      UNIQUE KEY \`DeliveryPartner_phone_key\` (\`phone\`)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  )

  await addColumn('DeliveryPartner', 'address', 'TEXT NULL')

  await createTable(
    'IndiaState',
    `CREATE TABLE \`IndiaState\` (
      \`code\` VARCHAR(8) NOT NULL,
      \`name\` VARCHAR(191) NOT NULL,
      PRIMARY KEY (\`code\`)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  )

  for (const state of INDIA_STATES) {
    await prisma.$executeRaw`
      INSERT INTO \`IndiaState\` (\`code\`, \`name\`) VALUES (${state.code}, ${state.name})
      ON DUPLICATE KEY UPDATE \`name\` = ${state.name}
    `
  }
  console.log(`seeded ${INDIA_STATES.length} India states`)

  await createTable(
    'ServiceablePincode',
    `CREATE TABLE \`ServiceablePincode\` (
      \`id\` VARCHAR(191) NOT NULL,
      \`pincode\` VARCHAR(191) NOT NULL,
      \`areaLabel\` VARCHAR(191) NULL,
      \`city\` VARCHAR(191) NULL,
      \`stateCode\` VARCHAR(8) NULL,
      \`isActive\` BOOLEAN NOT NULL DEFAULT true,
      \`partnerId\` VARCHAR(191) NULL,
      \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updatedAt\` DATETIME(3) NOT NULL,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`ServiceablePincode_pincode_key\` (\`pincode\`),
      KEY \`ServiceablePincode_partnerId_idx\` (\`partnerId\`),
      KEY \`ServiceablePincode_stateCode_idx\` (\`stateCode\`),
      CONSTRAINT \`ServiceablePincode_partnerId_fkey\`
        FOREIGN KEY (\`partnerId\`) REFERENCES \`DeliveryPartner\`(\`id\`)
        ON DELETE SET NULL ON UPDATE CASCADE,
      CONSTRAINT \`ServiceablePincode_stateCode_fkey\`
        FOREIGN KEY (\`stateCode\`) REFERENCES \`IndiaState\`(\`code\`)
        ON DELETE SET NULL ON UPDATE CASCADE
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  )

  await addColumn('ServiceablePincode', 'city', 'VARCHAR(191) NULL')
  await addColumn('ServiceablePincode', 'stateCode', 'VARCHAR(8) NULL')
  await addIndex('ServiceablePincode', 'ServiceablePincode_stateCode_idx', '`stateCode`')

  const pincodeStateFk = await prisma.$queryRaw`
    SELECT CONSTRAINT_NAME AS name FROM information_schema.TABLE_CONSTRAINTS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ServiceablePincode'
      AND CONSTRAINT_NAME = 'ServiceablePincode_stateCode_fkey'
  `
  if (!pincodeStateFk[0]) {
    await prisma.$executeRawUnsafe(`
      ALTER TABLE \`ServiceablePincode\`
      ADD CONSTRAINT \`ServiceablePincode_stateCode_fkey\`
      FOREIGN KEY (\`stateCode\`) REFERENCES \`IndiaState\`(\`code\`)
      ON DELETE SET NULL ON UPDATE CASCADE
    `)
    console.log('added ServiceablePincode.stateCode foreign key')
  }

  await createTable(
    'PartnerPasswordToken',
    `CREATE TABLE \`PartnerPasswordToken\` (
      \`id\` VARCHAR(191) NOT NULL,
      \`partnerId\` VARCHAR(191) NOT NULL,
      \`tokenHash\` VARCHAR(191) NOT NULL,
      \`expiresAt\` DATETIME(3) NOT NULL,
      \`usedAt\` DATETIME(3) NULL,
      \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      PRIMARY KEY (\`id\`),
      KEY \`PartnerPasswordToken_partnerId_idx\` (\`partnerId\`),
      CONSTRAINT \`PartnerPasswordToken_partnerId_fkey\`
        FOREIGN KEY (\`partnerId\`) REFERENCES \`DeliveryPartner\`(\`id\`)
        ON DELETE CASCADE ON UPDATE CASCADE
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  )

  await createTable(
    'PartnerDeviceToken',
    `CREATE TABLE \`PartnerDeviceToken\` (
      \`id\` VARCHAR(191) NOT NULL,
      \`partnerId\` VARCHAR(191) NOT NULL,
      \`token\` VARCHAR(191) NOT NULL,
      \`platform\` VARCHAR(191) NOT NULL,
      \`provider\` VARCHAR(191) NOT NULL DEFAULT 'expo',
      \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updatedAt\` DATETIME(3) NOT NULL,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`PartnerDeviceToken_token_key\` (\`token\`),
      KEY \`PartnerDeviceToken_partnerId_idx\` (\`partnerId\`),
      CONSTRAINT \`PartnerDeviceToken_partnerId_fkey\`
        FOREIGN KEY (\`partnerId\`) REFERENCES \`DeliveryPartner\`(\`id\`)
        ON DELETE CASCADE ON UPDATE CASCADE
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  )

  await addColumn('Order', 'paymentMode', "ENUM('online', 'cod') NOT NULL DEFAULT 'cod'")
  await addColumn('Order', 'paymentCollectedAs', 'VARCHAR(191) NULL')
  await addColumn('Order', 'razorpayPaymentLinkId', 'VARCHAR(191) NULL')
  await addColumn('Order', 'razorpayQrUrl', 'TEXT NULL')
  await addColumn('Order', 'deliveryPartnerId', 'VARCHAR(191) NULL')
  await addColumn('Order', 'deliveryPartnerName', 'VARCHAR(191) NULL')
  await addColumn('Order', 'deliveryPartnerPhone', 'VARCHAR(191) NULL')
  await addColumn('Order', 'deliveryPincode', 'VARCHAR(191) NULL')
  await addColumn('Order', 'deliveryAssignedAt', 'DATETIME(3) NULL')

  await addIndex('Order', 'Order_deliveryPartnerId_idx', '`deliveryPartnerId`')
  await addIndex('Order', 'Order_deliveryPincode_idx', '`deliveryPincode`')

  const fkRows = await prisma.$queryRaw`
    SELECT CONSTRAINT_NAME AS name FROM information_schema.TABLE_CONSTRAINTS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Order'
      AND CONSTRAINT_NAME = 'Order_deliveryPartnerId_fkey'
  `
  if (!fkRows[0]) {
    await prisma.$executeRawUnsafe(`
      ALTER TABLE \`Order\`
      ADD CONSTRAINT \`Order_deliveryPartnerId_fkey\`
      FOREIGN KEY (\`deliveryPartnerId\`) REFERENCES \`DeliveryPartner\`(\`id\`)
      ON DELETE SET NULL ON UPDATE CASCADE
    `)
    console.log('added Order.deliveryPartnerId foreign key')
  }

  console.log('Delivery partner, pincode, and COD columns are ready.')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
