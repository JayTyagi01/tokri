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

  await addColumn('Setting', 'homeBannerImage', 'TEXT NULL')
  await addColumn('Setting', 'homeHighlightImage', 'TEXT NULL')
  await addColumn('Setting', 'homeFeaturedCategorySlugs', 'TEXT NULL')

  for (const column of [
    'homeBannerEnabled',
    'homeCategoriesEnabled',
    'homeBestSellersEnabled',
    'homeBestSellersTitle',
    'homeShopOurRangeEnabled',
    'homeFruitHighlightEnabled',
    'homeImportedFruitsEnabled',
    'homeReviewsEnabled',
  ]) {
    await dropColumn('Setting', column)
  }

  console.log('Homepage image and category columns are ready.')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
