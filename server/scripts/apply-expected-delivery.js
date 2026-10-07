import dotenv from 'dotenv'
import { prisma } from '../src/lib/prisma.js'
import { expectedDeliveryDate } from '../src/services/delivery.js'

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
  await addColumn('Order', 'expectedDeliveryDate', 'DATE NULL')

  const orders = await prisma.order.findMany({
    where: { expectedDeliveryDate: null },
    select: { id: true, deliveryOption: true, createdAt: true },
  })

  for (const order of orders) {
    await prisma.order.update({
      where: { id: order.id },
      data: {
        expectedDeliveryDate: expectedDeliveryDate(order.deliveryOption, order.createdAt),
      },
    })
  }

  if (orders.length) console.log(`backfilled ${orders.length} orders`)
  else console.log('no orders to backfill')
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
