import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import * as AdminJSPrisma from '@adminjs/prisma'
import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma.js'
import { env } from '../config/env.js'
import componentLoader, { Components } from './componentLoader.js'
import {
  canManage,
  hasPermission,
  resourceActions,
  serializeAdminUser,
  PERMISSION_KEYS,
  defaultStaffPermissions,
} from './permissions.js'
import { getSettingResource, ensureSettingsRecord } from './settings.js'
import { prepareProductPayload } from './product-handlers.js'
import { prepareCategoryPayload } from './category-handlers.js'
import { adminLocale } from './locale.js'

AdminJS.registerAdapter({
  Database: AdminJSPrisma.Database,
  Resource: AdminJSPrisma.Resource,
})

const hashPassword = async (request) => {
  const password = request.payload?.password?.trim()
  if (password) {
    request.payload.password = await bcrypt.hash(password, 10)
  } else {
    delete request.payload?.password
  }
  return request
}

const permissionFields = Object.fromEntries(
  Object.entries(PERMISSION_KEYS).map(([key, label]) => [
    `permissions.${key}`,
    {
      label,
      type: 'boolean',
      isVisible: { list: false, show: false, edit: true, filter: false },
    },
  ]),
)

const cmsListView = (manageKey) => ({
  isAccessible: canManage(manageKey),
  component: Components.CmsList,
})

const teamListHandler = {
  isAccessible: canManage('manageUsers'),
  handler: async (request, _response, context) => {
    const { query } = request
    const perPage = Math.min(Number(query.perPage) || 10, 50)
    const page = Number(query.page) || 1
    const searchTerm = String(
      query['filters.name'] || query['filters.email'] || query['filters.username'] || '',
    ).trim()

    const where = {
      role: { in: ['staff', 'admin', 'super_admin'] },
      ...(searchTerm
        ? {
            OR: [
              { name: { contains: searchTerm } },
              { email: { contains: searchTerm } },
              { username: { contains: searchTerm } },
            ],
          }
        : {}),
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { createdAt: 'desc' },
        include: { permissions: true },
      }),
      prisma.user.count({ where }),
    ])

    const records = users.map((user) => {
      const flat = {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      }

      if (user.permissions) {
        for (const key of Object.keys(PERMISSION_KEYS)) {
          flat[`permissions.${key}`] = user.permissions[key]
        }
      }

      return context.resource.build(flat).toJSON(context.currentAdmin)
    })

    return {
      meta: { total, perPage, page, direction: 'desc', sortBy: 'createdAt' },
      records,
    }
  },
}

export async function buildAdminRouter() {
  await ensureSettingsRecord()

  const admin = new AdminJS({
    rootPath: env.adminPath,
    loginPath: `${env.adminPath}/login`,
    componentLoader,
    dashboard: {
      component: Components.Dashboard,
      handler: async () => {
        const [productCount, orderCount, pageCount, reviewCount, recentOrders] =
          await Promise.all([
            prisma.product.count(),
            prisma.order.count(),
            prisma.page.count(),
            prisma.review.count(),
            prisma.order.findMany({
              take: 5,
              orderBy: { createdAt: 'desc' },
              select: {
                orderNo: true,
                status: true,
                grandTotal: true,
                createdAt: true,
              },
            }),
          ])

        return {
          productCount,
          orderCount,
          pageCount,
          reviewCount,
          recentOrders: recentOrders.map((order) => ({
            ...order,
            grandTotal: String(order.grandTotal),
          })),
        }
      },
    },
    assets: {
      styles: [`${env.adminPath}/assets/cms-theme.css`],
    },
    branding: {
      companyName: 'Tokriii Dashboard',
      logo: false,
      withMadeWithLove: false,
      favicon: '/favicon.ico',
    },
    locale: adminLocale,
    resources: [
      {
        resource: { model: AdminJSPrisma.getModelByName('Product'), client: prisma },
        options: {
          name: 'Products',
          navigation: { name: 'Catalog', icon: 'ShoppingCart' },
          listProperties: ['name', 'slug', 'priceValue', 'category', 'isBestSeller', 'isActive'],
          editProperties: [
            'name',
            'slug',
            'description',
            'image',
            'mediaId',
            'priceValue',
            'oldPriceValue',
            'currency',
            'weight',
            'category',
            'badge',
            'isBestSeller',
            'isImported',
            'isFeatured',
            'stock',
            'sortOrder',
            'isActive',
          ],
          actions: {
            ...resourceActions('manageProducts'),
            list: cmsListView('manageProducts'),
            new: {
              isAccessible: canManage('manageProducts'),
              isVisible: true,
              component: Components.ProductEdit,
              before: prepareProductPayload,
            },
            edit: {
              isAccessible: canManage('manageProducts'),
              isVisible: true,
              component: Components.ProductEdit,
              before: prepareProductPayload,
            },
          },
          custom: {
            apiBaseUrl: `${env.appUrl}/api/v1`,
            appUrl: env.appUrl,
            productUrlBase: `${env.appUrl}/product`,
          },
          properties: {
            description: { type: 'richtext', label: 'Description' },
            image: { isVisible: false },
            mediaId: { isVisible: false },
            slug: {
              label: 'Slug',
              description: 'The public product URL updates below this field.',
            },
          },
        },
      },
      {
        resource: { model: AdminJSPrisma.getModelByName('Category'), client: prisma },
        options: {
          name: 'Categories',
          navigation: { name: 'Catalog', icon: 'ShoppingCart' },
          listProperties: ['label', 'slug', 'sortOrder', 'isActive'],
          editProperties: [
            'label',
            'slug',
            'title',
            'subtitle',
            'description',
            'image',
            'bannerImage',
            'sortOrder',
            'isActive',
          ],
          actions: {
            ...resourceActions('manageCatalog'),
            list: cmsListView('manageCatalog'),
            // Keep show hidden in the UI, but accessible so reference
            // dropdowns (e.g. Product -> Category) can resolve the label.
            show: { isVisible: false, isAccessible: canManage('manageCatalog') },
            new: {
              isAccessible: canManage('manageCatalog'),
              isVisible: true,
              component: Components.CategoryEdit,
              before: prepareCategoryPayload,
            },
            edit: {
              isAccessible: canManage('manageCatalog'),
              isVisible: true,
              component: Components.CategoryEdit,
              before: prepareCategoryPayload,
            },
          },
          custom: {
            apiBaseUrl: `${env.appUrl}/api/v1`,
            appUrl: env.appUrl,
            categoryUrlBase: `${env.clientUrl}/category`,
          },
          properties: {
            label: { isTitle: true },
            title: { label: 'Page heading' },
            subtitle: { type: 'textarea', label: 'Subtitle' },
            description: { type: 'richtext', label: 'Description' },
            image: {
              isVisible: { list: false, show: false, edit: true, filter: false },
              type: 'string',
            },
            bannerImage: {
              isVisible: { list: false, show: false, edit: true, filter: false },
              type: 'string',
            },
          },
        },
      },
      {
        resource: { model: AdminJSPrisma.getModelByName('Media'), client: prisma },
        options: {
          name: 'Media Library',
          navigation: { name: 'Catalog', icon: 'Image' },
          listProperties: ['originalName', 'folder', 'path', 'size', 'createdAt'],
          actions: {
            ...resourceActions('manageMedia'),
            list: cmsListView('manageMedia'),
          },
          properties: {
            originalName: { isTitle: true },
            path: { label: 'File path' },
          },
        },
      },
      {
        resource: { model: AdminJSPrisma.getModelByName('Page'), client: prisma },
        options: {
          name: 'Pages',
          navigation: { name: 'Content', icon: 'Document' },
          listProperties: ['title', 'slug', 'isPublished', 'updatedAt'],
          editProperties: ['title', 'slug', 'body', 'isPublished'],
          actions: {
            ...resourceActions('manageContent'),
            list: cmsListView('manageContent'),
          },
          properties: {
            title: { label: 'Page title', isTitle: true },
            slug: { label: 'URL slug' },
            body: { type: 'richtext', label: 'Page content' },
            isPublished: { label: 'Published' },
          },
        },
      },
      {
        resource: { model: AdminJSPrisma.getModelByName('Review'), client: prisma },
        options: {
          name: 'Reviews',
          navigation: { name: 'Content', icon: 'Star' },
          listProperties: ['title', 'name', 'rating', 'isApproved', 'createdAt'],
          editProperties: ['title', 'name', 'content', 'rating', 'image', 'isApproved'],
          actions: {
            ...resourceActions('manageContent'),
            list: cmsListView('manageContent'),
            new: {
              isAccessible: canManage('manageContent'),
              isVisible: true,
              component: Components.ReviewEdit,
            },
            edit: {
              isAccessible: canManage('manageContent'),
              isVisible: true,
              component: Components.ReviewEdit,
            },
          },
          custom: {
            apiBaseUrl: `${env.appUrl}/api/v1`,
            appUrl: env.appUrl,
          },
          properties: {
            title: { isTitle: true, label: 'Review title' },
            name: { label: 'Reviewer name' },
            content: { type: 'textarea', label: 'Review content' },
            rating: { label: 'Rating (1-5)' },
            image: { isVisible: false },
            isApproved: { label: 'Approved' },
            product: { isVisible: false },
            productId: { isVisible: false },
          },
        },
      },
      {
        resource: { model: AdminJSPrisma.getModelByName('Order'), client: prisma },
        options: {
          name: 'Orders',
          navigation: { name: null, icon: 'ShoppingBag' },
          listProperties: ['orderNo', 'status', 'paymentStatus', 'grandTotal', 'createdAt'],
          showProperties: [
            'orderNo',
            'status',
            'paymentStatus',
            'itemsTotal',
            'deliveryCharge',
            'handlingCharge',
            'smallCartCharge',
            'discount',
            'grandTotal',
            'couponCode',
            'address',
            'items',
            'createdAt',
            'updatedAt',
          ],
          actions: {
            ...resourceActions('manageOrders'),
            list: cmsListView('manageOrders'),
            new: () => false,
            delete: () => false,
          },
          properties: {
            orderNo: { isTitle: true },
            items: { isVisible: { list: false, show: true, edit: false, filter: false } },
          },
        },
      },
      {
        resource: { model: AdminJSPrisma.getModelByName('OrderItem'), client: prisma },
        options: {
          navigation: false,
          actions: {
            list: () => false,
            show: { isVisible: false, isAccessible: canManage('manageOrders') },
            new: () => false,
            edit: () => false,
            delete: () => false,
            search: () => false,
          },
        },
      },
      {
        resource: { model: AdminJSPrisma.getModelByName('Coupon'), client: prisma },
        options: {
          name: 'Coupons',
          navigation: { name: null, icon: 'Tag' },
          listProperties: ['code', 'type', 'value', 'isActive', 'usedCount'],
          actions: {
            ...resourceActions('manageCoupons'),
            list: cmsListView('manageCoupons'),
          },
          properties: {
            code: { isTitle: true },
          },
        },
      },
      getSettingResource(Components.SettingsEdit),
      {
        resource: { model: AdminJSPrisma.getModelByName('AdminPermission'), client: prisma },
        options: {
          navigation: false,
          actions: {
            list: () => false,
            show: () => false,
            new: () => false,
            edit: () => false,
            delete: () => false,
            search: () => false,
          },
        },
      },
      {
        resource: { model: AdminJSPrisma.getModelByName('User'), client: prisma },
        options: {
          name: 'Team',
          navigation: { name: null, icon: 'Users' },
          listProperties: ['name', 'username', 'email', 'role', 'isActive'],
          editProperties: [
            'name',
            'username',
            'email',
            'role',
            'isActive',
            'password',
            ...Object.keys(PERMISSION_KEYS).map((key) => `permissions.${key}`),
          ],
          sections: [
            {
              label: 'Account',
              properties: ['name', 'username', 'email', 'role', 'isActive', 'password'],
            },
            {
              label: 'Permissions',
              properties: Object.keys(PERMISSION_KEYS).map((key) => `permissions.${key}`),
            },
          ],
          properties: {
            name: { isTitle: true },
            password: {
              type: 'password',
              isVisible: { list: false, show: false, edit: true, filter: false },
              description: 'Leave blank when editing to keep current password',
            },
            username: { description: 'Sign in with username or email' },
            role: {
              availableValues: [
                { value: 'staff', label: 'Staff (permission-based)' },
                { value: 'admin', label: 'Admin (full access)' },
                { value: 'super_admin', label: 'Super Admin (full access)' },
              ],
            },
            phone: { isVisible: false },
            addresses: { isVisible: false },
            orders: { isVisible: false },
            passwordResetTokens: { isVisible: false },
            permissions: { isVisible: false },
            ...permissionFields,
          },
          actions: {
            ...resourceActions('manageUsers'),
            list: {
              ...teamListHandler,
              component: Components.CmsList,
            },
            new: {
              isAccessible: canManage('manageUsers'),
              before: [hashPassword],
              after: async (response) => {
                const userId = response.record?.params?.id
                const role = response.record?.params?.role
                if (userId && role === 'staff') {
                  const exists = await prisma.adminPermission.findUnique({ where: { userId } })
                  if (!exists) {
                    await prisma.adminPermission.create({
                      data: { userId, ...defaultStaffPermissions },
                    })
                  }
                }
                return response
              },
            },
            edit: {
              isAccessible: canManage('manageUsers'),
              before: [
                hashPassword,
                async (request) => {
                  const userId = request.params?.recordId
                  const role = request.payload?.role
                  if (userId && role === 'staff') {
                    const exists = await prisma.adminPermission.findUnique({ where: { userId } })
                    if (!exists) {
                      await prisma.adminPermission.create({
                        data: { userId, ...defaultStaffPermissions },
                      })
                    }
                  }
                  return request
                },
              ],
            },
            delete: {
              isAccessible: ({ currentAdmin, record }) =>
                hasPermission(currentAdmin, 'manageUsers') &&
                !['admin', 'super_admin'].includes(record?.params?.role),
            },
          },
        },
      },
    ],
  })

  if (env.nodeEnv !== 'production') {
    admin.watch()
  }

  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate: async (identifier, password) => {
        const login = String(identifier || '').trim()
        const pass = String(password || '')
        if (!login || !pass) return null

        const user = await prisma.user.findFirst({
          where: {
            isActive: true,
            role: { in: ['staff', 'admin', 'super_admin'] },
            OR: [{ email: login }, { username: login }],
          },
          include: { permissions: true },
        })

        if (!user?.password) return null

        const valid = await bcrypt.compare(pass, user.password)
        if (!valid) return null

        return serializeAdminUser(user)
      },
      cookieName: 'tokri_admin',
      cookiePassword: env.sessionSecret,
    },
    null,
    {
      resave: false,
      saveUninitialized: false,
      secret: env.sessionSecret,
      cookie: {
        httpOnly: true,
        secure: env.nodeEnv === 'production',
        sameSite: 'lax',
      },
    },
  )

  return { admin, adminRouter }
}
