import { prisma } from '../lib/prisma.js'
import { calcCartTotals } from '../config/charges.js'
import { formatProduct } from '../utils/formatters.js'

function cartItemInclude() {
  return {
    items: {
      orderBy: { id: 'asc' },
      include: { product: { include: { category: true } } },
    },
  }
}

function httpError(message, status = 400) {
  return Object.assign(new Error(message), { status })
}

function normalizeQuantity(value, { allowZero = false } = {}) {
  const quantity = Number(value)
  if (!Number.isInteger(quantity)) throw httpError('Quantity must be a whole number.')
  if (allowZero && quantity === 0) return 0
  if (quantity < 1) throw httpError('Quantity must be at least 1.')
  if (quantity > 99) throw httpError('Quantity cannot be more than 99.')
  return quantity
}

function readSlug(raw) {
  const slug = String(raw?.slug || raw?.id || raw?.productId || '').trim()
  if (!slug) throw httpError('Product is required.')
  return slug
}

async function loadProduct(slug) {
  const product = await prisma.product.findFirst({
    where: { slug, isActive: true },
    include: { category: true },
  })
  if (!product) throw httpError('This product is no longer available.', 404)
  return product
}

export async function getOrCreateCart(userId) {
  return prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
    include: cartItemInclude(),
  })
}

function formatCartItem(item) {
  const product = formatProduct(item.product)
  return {
    ...product,
    quantity: item.quantity,
    lineTotal: Number(item.product.priceValue) * item.quantity,
  }
}

export function formatCart(cart) {
  const activeItems = (cart?.items || []).filter((item) => item.product?.isActive)
  const items = activeItems.map((item) => ({
    ...formatCartItem(item),
    priceValue: Number(item.product.priceValue),
  }))
  const totals = calcCartTotals(items)

  return {
    items: items.map(({ id, slug, name, price, priceValue, image, weight, quantity, lineTotal, category, stock }) => ({
      id,
      slug,
      name,
      price,
      priceValue,
      image,
      weight,
      quantity,
      lineTotal,
      category,
      stock,
    })),
    ...totals,
  }
}

export async function getCart(userId) {
  const cart = await getOrCreateCart(userId)
  return formatCart(cart)
}

export async function getCartCheckoutItems(userId) {
  const cart = await getCart(userId)
  if (!cart.items.length) throw httpError('Your cart is empty.')
  return cart.items.map((item) => ({ id: item.slug, quantity: item.quantity }))
}

export async function replaceCart(userId, rawItems) {
  if (!Array.isArray(rawItems)) throw httpError('Cart items are required.')

  const normalized = rawItems.map((item) => ({
    slug: readSlug(item),
    quantity: normalizeQuantity(item.quantity),
  }))

  const products = await prisma.product.findMany({
    where: { slug: { in: normalized.map((item) => item.slug) }, isActive: true },
  })
  const productMap = new Map(products.map((product) => [product.slug, product]))

  for (const entry of normalized) {
    if (!productMap.has(entry.slug)) {
      throw httpError(`Product "${entry.slug}" is no longer available.`)
    }
  }

  const cart = await getOrCreateCart(userId)

  await prisma.$transaction([
    prisma.cartItem.deleteMany({ where: { cartId: cart.id } }),
    ...normalized.map((entry) =>
      prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: productMap.get(entry.slug).id,
          quantity: entry.quantity,
        },
      }),
    ),
  ])

  return getCart(userId)
}

export async function addCartItem(userId, rawItem) {
  const slug = readSlug(rawItem)
  const addBy = normalizeQuantity(rawItem.quantity ?? 1)
  const product = await loadProduct(slug)
  const cart = await getOrCreateCart(userId)

  const existing = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId: product.id } },
  })

  const nextQuantity = Math.min(99, (existing?.quantity || 0) + addBy)

  await prisma.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId: product.id } },
    update: { quantity: nextQuantity },
    create: { cartId: cart.id, productId: product.id, quantity: nextQuantity },
  })

  return getCart(userId)
}

export async function updateCartItem(userId, slug, quantity) {
  const nextQuantity = normalizeQuantity(quantity, { allowZero: true })
  if (nextQuantity === 0) return removeCartItem(userId, slug)

  const product = await loadProduct(slug)
  const cart = await getOrCreateCart(userId)
  const existing = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId: product.id } },
  })
  if (!existing) throw httpError('Item is not in your cart.', 404)

  await prisma.cartItem.update({
    where: { id: existing.id },
    data: { quantity: nextQuantity },
  })

  return getCart(userId)
}

export async function removeCartItem(userId, slug) {
  const product = await prisma.product.findFirst({ where: { slug } })
  if (!product) throw httpError('Item is not in your cart.', 404)

  const cart = await prisma.cart.findUnique({ where: { userId } })
  if (!cart) throw httpError('Item is not in your cart.', 404)

  const deleted = await prisma.cartItem.deleteMany({
    where: { cartId: cart.id, productId: product.id },
  })
  if (!deleted.count) throw httpError('Item is not in your cart.', 404)

  return getCart(userId)
}

export async function clearCart(userId) {
  const cart = await prisma.cart.findUnique({ where: { userId } })
  if (cart) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })
  }
  return getCart(userId)
}
