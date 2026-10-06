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
  console.log('--- Applying Tax Schema Alterations ---')
  // Product
  await addColumn('Product', 'hsnCode', "VARCHAR(20) DEFAULT '0808'")
  await addColumn('Product', 'gstRate', 'DECIMAL(5, 2) NOT NULL DEFAULT 0.00')
  await addColumn('Product', 'isTaxable', 'TINYINT(1) NOT NULL DEFAULT 0')

  // Order
  await addColumn('Order', 'taxTotal', 'DECIMAL(10, 2) NOT NULL DEFAULT 0.00')
  await addColumn('Order', 'cgstTotal', 'DECIMAL(10, 2) NOT NULL DEFAULT 0.00')
  await addColumn('Order', 'sgstTotal', 'DECIMAL(10, 2) NOT NULL DEFAULT 0.00')
  await addColumn('Order', 'igstTotal', 'DECIMAL(10, 2) NOT NULL DEFAULT 0.00')
  await addColumn('Order', 'isInterState', 'TINYINT(1) NOT NULL DEFAULT 0')

  // OrderItem
  await addColumn('OrderItem', 'hsnCode', "VARCHAR(20) DEFAULT '0808'")
  await addColumn('OrderItem', 'isTaxable', 'TINYINT(1) NOT NULL DEFAULT 0')
  await addColumn('OrderItem', 'gstRate', 'DECIMAL(5, 2) NOT NULL DEFAULT 0.00')
  await addColumn('OrderItem', 'taxAmount', 'DECIMAL(10, 2) NOT NULL DEFAULT 0.00')
  await addColumn('OrderItem', 'cgstAmount', 'DECIMAL(10, 2) NOT NULL DEFAULT 0.00')
  await addColumn('OrderItem', 'sgstAmount', 'DECIMAL(10, 2) NOT NULL DEFAULT 0.00')
  await addColumn('OrderItem', 'igstAmount', 'DECIMAL(10, 2) NOT NULL DEFAULT 0.00')

  // ProductTax Table
  console.log('--- Creating ProductTax table if missing ---')
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS \`ProductTax\` (
      \`id\` VARCHAR(191) NOT NULL,
      \`productId\` VARCHAR(191) NOT NULL,
      \`productName\` VARCHAR(255) NOT NULL,
      \`categoryName\` VARCHAR(255) NULL,
      \`hsnCode\` VARCHAR(20) NOT NULL DEFAULT '0808',
      \`gstRate\` DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
      \`isTaxable\` TINYINT(1) NOT NULL DEFAULT 0,
      \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`ProductTax_productId_key\` (\`productId\`),
      INDEX \`ProductTax_productId_idx\` (\`productId\`),
      CONSTRAINT \`ProductTax_productId_fkey\` FOREIGN KEY (\`productId\`) REFERENCES \`Product\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  `)
  console.log('ProductTax table confirmed.')

  // Category: Dry Fruits
  console.log('--- Ensuring Dry Fruits category exists ---')
  let dryCategory = await prisma.category.findUnique({ where: { slug: 'dry-fruits' } })
  if (!dryCategory) {
    dryCategory = await prisma.category.create({
      data: {
        slug: 'dry-fruits',
        label: 'Dry Fruits',
        title: 'Premium Dry Fruits & Nuts',
        subtitle: 'Finest handpicked dry fruits and nuts for wholesome health',
        description: 'Selected premium quality almonds, cashews, pistachios, and raisins.',
        sortOrder: 10,
        isActive: true,
      },
    })
    console.log('Created Dry Fruits category:', dryCategory.id)
  } else {
    console.log('Dry Fruits category already exists:', dryCategory.id)
  }

  // Seed sample Dry Fruit products
  const dryFruitSeed = [
    {
      name: 'Almond (Badam) - 500g',
      slug: 'almond-badam-500g',
      priceValue: 499.00,
      oldPriceValue: 599.00,
      weight: '500 g',
      hsnCode: '0802',
      gstRate: 5.00,
      isTaxable: true,
      description: 'Rich, crunchy Californian almonds packed with vitamin E and protein.',
      image: '/images/dry-fruits/almonds.jpg',
    },
    {
      name: 'Cashew (Kaju) - 500g',
      slug: 'cashew-kaju-500g',
      priceValue: 549.00,
      oldPriceValue: 649.00,
      weight: '500 g',
      hsnCode: '0802',
      gstRate: 5.00,
      isTaxable: true,
      description: 'Hand-picked whole cashew nuts with rich creamy texture.',
      image: '/images/dry-fruits/cashews.jpg',
    },
    {
      name: 'Pistachio (Pista) - 250g',
      slug: 'pistachio-pista-250g',
      priceValue: 399.00,
      oldPriceValue: 450.00,
      weight: '250 g',
      hsnCode: '0802',
      gstRate: 5.00,
      isTaxable: true,
      description: 'Roasted and lightly salted Iranian pistachios with natural shell crack.',
      image: '/images/dry-fruits/pistachios.jpg',
    },
    {
      name: 'Raisin (Kishmish) - 500g',
      slug: 'raisin-kishmish-500g',
      priceValue: 199.00,
      oldPriceValue: 249.00,
      weight: '500 g',
      hsnCode: '0806',
      gstRate: 5.00,
      isTaxable: true,
      description: 'Sweet golden Indian raisins packed with natural sweetness and fiber.',
      image: '/images/dry-fruits/raisins.jpg',
    },
  ]

  for (const item of dryFruitSeed) {
    let p = await prisma.product.findUnique({ where: { slug: item.slug } })
    if (!p) {
      p = await prisma.product.create({
        data: {
          slug: item.slug,
          name: item.name,
          priceValue: item.priceValue,
          oldPriceValue: item.oldPriceValue,
          weight: item.weight,
          description: item.description,
          hsnCode: item.hsnCode,
          gstRate: item.gstRate,
          isTaxable: item.isTaxable,
          categoryId: dryCategory.id,
          isActive: true,
          stock: 100,
          categoryLinks: {
            create: { categoryId: dryCategory.id },
          },
        },
      })
      console.log(`Created product: ${item.name}`)
    } else {
      await prisma.product.update({
        where: { id: p.id },
        data: {
          hsnCode: item.hsnCode,
          gstRate: item.gstRate,
          isTaxable: item.isTaxable,
          categoryId: dryCategory.id,
        },
      })
      console.log(`Updated product tax: ${item.name}`)
    }
  }

  // Populate/Sync ProductTax records for ALL products
  console.log('--- Syncing ProductTax for all products in database ---')
  const allProducts = await prisma.product.findMany({
    include: { category: true },
  })

  let count = 0
  for (const product of allProducts) {
    const isDryFruit =
      product.categoryId === dryCategory.id ||
      /almond|cashew|pistachio|raisin|kaju|badam|pista|kishmish|walnut|dry fruit/i.test(product.name)

    const defaultHsn = isDryFruit ? (product.hsnCode || '0802') : (product.hsnCode || '0808')
    const defaultGst = isDryFruit ? (Number(product.gstRate) || 5.00) : (Number(product.gstRate) || 0.00)
    const defaultTaxable = isDryFruit ? (product.isTaxable ?? true) : (product.isTaxable ?? false)

    // Ensure product row has the values
    await prisma.product.update({
      where: { id: product.id },
      data: {
        hsnCode: defaultHsn,
        gstRate: defaultGst,
        isTaxable: Boolean(defaultTaxable),
      },
    })

    const catName = product.category?.label || (isDryFruit ? 'Dry Fruits' : 'Fresh Fruits')

    await prisma.$executeRawUnsafe(`
      INSERT INTO \`ProductTax\` (\`id\`, \`productId\`, \`productName\`, \`categoryName\`, \`hsnCode\`, \`gstRate\`, \`isTaxable\`, \`createdAt\`, \`updatedAt\`)
      VALUES (
        UUID(),
        ${JSON.stringify(product.id)},
        ${JSON.stringify(product.name)},
        ${JSON.stringify(catName)},
        ${JSON.stringify(defaultHsn)},
        ${defaultGst},
        ${defaultTaxable ? 1 : 0},
        NOW(3),
        NOW(3)
      )
      ON DUPLICATE KEY UPDATE
        \`productName\` = VALUES(\`productName\`),
        \`categoryName\` = VALUES(\`categoryName\`),
        \`hsnCode\` = VALUES(\`hsnCode\`),
        \`gstRate\` = VALUES(\`gstRate\`),
        \`isTaxable\` = VALUES(\`isTaxable\`),
        \`updatedAt\` = NOW(3);
    `)
    count++
  }

  console.log(`Successfully synced ${count} products into ProductTax table.`)
  console.log('Migration complete.')
}

main()
  .catch((error) => {
    console.error('Migration failed:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
