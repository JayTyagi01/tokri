import { Router } from 'express'
import { prisma } from '../lib/prisma.js'
import { formatPublicSettings } from '../utils/settings.js'
import { formatCategory, formatProduct, formatPage } from '../utils/formatters.js'

const router = Router()

router.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'tokri-api',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  })
})

router.get('/settings/public', async (_req, res, next) => {
  try {
    const settings = await prisma.setting.findUnique({ where: { id: 1 } })
    res.json(formatPublicSettings(settings))
  } catch (error) {
    next(error)
  }
})

router.get('/categories', async (_req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { products: true } } },
    })

    res.json(categories.map((c) => formatCategory(c)))
  } catch (error) {
    next(error)
  }
})

router.get('/categories/:slug', async (req, res, next) => {
  try {
    const category = await prisma.category.findFirst({
      where: { slug: req.params.slug, isActive: true },
      include: {
        products: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
          include: { category: true },
        },
      },
    })

    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }

    res.json(formatCategory(category, { includeProducts: true }))
  } catch (error) {
    next(error)
  }
})

router.get('/products', async (req, res, next) => {
  try {
    const { flag, category, limit } = req.query
    const take = limit ? Math.min(Number(limit) || 20, 100) : undefined

    const where = { isActive: true }

    if (flag === 'bestSeller') where.isBestSeller = true
    if (flag === 'imported') where.isImported = true
    if (flag === 'featured') where.isFeatured = true

    if (category) {
      const cat = await prisma.category.findUnique({ where: { slug: String(category) } })
      if (cat) where.categoryId = cat.id
    }

    const products = await prisma.product.findMany({
      where,
      take,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      include: { category: true },
    })

    res.json(products.map(formatProduct))
  } catch (error) {
    next(error)
  }
})

router.get('/search', async (req, res, next) => {
  try {
    const term = String(req.query.q || '').trim()
    const page = Math.max(1, Number(req.query.page) || 1)
    const pageSize = Math.min(Math.max(Number(req.query.limit) || 12, 1), 48)

    if (!term) {
      return res.json({
        query: '',
        total: 0,
        page: 1,
        pageSize,
        hasMore: false,
        products: [],
        suggestions: [],
      })
    }

    const where = {
      isActive: true,
      OR: [
        { name: { contains: term } },
        { description: { contains: term } },
        { badge: { contains: term } },
        { category: { is: { label: { contains: term } } } },
      ],
    }

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: [{ isBestSeller: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
        include: { category: true },
      }),
    ])

    let suggestions = []
    if (page === 1) {
      const suggested = await prisma.product.findMany({
        where: { isActive: true, name: { contains: term } },
        take: 5,
        orderBy: [{ isBestSeller: 'desc' }, { name: 'asc' }],
        include: { category: true },
      })
      suggestions = suggested.map(formatProduct)
    }

    res.json({
      query: term,
      total,
      page,
      pageSize,
      hasMore: page * pageSize < total,
      products: products.map(formatProduct),
      suggestions,
    })
  } catch (error) {
    next(error)
  }
})

router.get('/products/:slug', async (req, res, next) => {
  try {
    const product = await prisma.product.findFirst({
      where: { slug: req.params.slug, isActive: true },
      include: { category: true },
    })

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.json(formatProduct(product))
  } catch (error) {
    next(error)
  }
})

router.get('/reviews', async (_req, res, next) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })

    res.json(reviews)
  } catch (error) {
    next(error)
  }
})

router.get('/pages/:slug', async (req, res, next) => {
  try {
    const page = await prisma.page.findFirst({
      where: {
        slug: String(req.params.slug || '').trim(),
        isPublished: true,
      },
    })

    if (!page) {
      return res.status(404).json({ message: 'Page not found' })
    }

    res.json(formatPage(page))
  } catch (error) {
    next(error)
  }
})

export default router
