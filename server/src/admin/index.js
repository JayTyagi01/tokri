import AdminJS, { ValidationError } from 'adminjs'
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
import { prepareProductPayload, afterProductForm } from './product-handlers.js'
import { prepareCouponPayload } from './coupon-handlers.js'
import { prepareCategoryPayload } from './category-handlers.js'
import { orderEditHandler, orderListHandler, orderShowHandler } from './order-handlers.js'
import {
  preparePartnerPayload,
  afterPartnerSave,
  sanitizePartnerRecord,
  sendPartnerPasswordAction,
  togglePartnerActiveAction,
  preparePincodePayload,
  togglePincodeActiveAction,
  collectCashAction,
  generateQrAction,
} from './partner-handlers.js'
import { prepareCustomerPayload, attachCustomerAddresses, toggleCustomerActiveAction } from './customer-handlers.js'
import { buildCatalogRoutes } from './catalogRoutes.js'
import { adminLocale } from './locale.js'
import { INDIA_STATES } from '../data/indiaStates.js'
import { buildDashboardAnalytics } from '../services/dashboardAnalytics.js'

AdminJS.registerAdapter({
  Database: AdminJSPrisma.Database,
  Resource: AdminJSPrisma.Resource,
})

const hashNewPassword = async (request) => {
  if (request.method !== 'post') return request

  const password = String(request.payload?.password || '').trim()
  const confirmPassword = String(request.payload?.confirmPassword || '').trim()

  if (!password) {
    throw new ValidationError({ password: { message: 'Password is required.' } })
  }
  if (password.length < 6) {
    throw new ValidationError({ password: { message: 'Password must be at least 6 characters.' } })
  }
  if (password !== confirmPassword) {
    throw new ValidationError({
      confirmPassword: { message: 'New password and confirm password must be the same.' },
    })
  }

  request.payload.password = await bcrypt.hash(password, 10)
  delete request.payload.confirmPassword
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
      handler: async (request) => {
        const query = request?.query || request?.params?.query || {}
        return buildDashboardAnalytics({
          widget: query.widget ? String(query.widget) : '',
          range: String(query.range || '7d'),
          page: query.page,
        })
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
      theme: {
        colors: {
          primary100: '#047857',
          primary80: '#059669',
          primary60: '#34d399',
          primary40: '#6ee7b7',
          primary20: '#d1fae5',
          accent: '#065f46',
          infoDark: '#047857',
          info: '#059669',
          infoLight: '#d1fae5',
          love: '#047857',
          successDark: '#047857',
          success: '#059669',
        },
      },
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
              component: Components.ProductEdit,
              before: prepareProductPayload,
              after: afterProductForm,
            },
            edit: {
              isAccessible: canManage('manageProducts'),
              isVisible: true,
              component: Components.ProductEdit,
              before: prepareProductPayload,
              after: afterProductForm,
            },
          },
          custom: {
            apiBaseUrl: `${env.apiUrl}/api/v1`,
            appUrl: env.apiUrl,
            productUrlBase: `${env.clientUrl}/product`,
          },
          properties: {
            description: { type: 'richtext', label: 'Description' },
            image: { isVisible: false },
            mediaId: { isVisible: false },
            media: { isVisible: false },
            category: { isVisible: { list: true, filter: true, show: true, edit: false } },
            categoryLinks: { isVisible: false },
            reviews: { isVisible: false },
            orderItems: { isVisible: false },
            cartItems: { isVisible: false },
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
          navigation: { name: 'Catalog', icon: 'Grid' },
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
            apiBaseUrl: `${env.apiUrl}/api/v1`,
            appUrl: env.apiUrl,
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
            products: { isVisible: false },
            productLinks: { isVisible: false },
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
          navigation: { name: 'Content', icon: 'FileText' },
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
            apiBaseUrl: `${env.apiUrl}/api/v1`,
            appUrl: env.apiUrl,
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
          listProperties: ['orderNo', 'customerName', 'customerPhone', 'status', 'paymentStatus', 'grandTotal', 'createdAt'],
          showProperties: [
            'orderNo',
            'customerName',
            'customerPhone',
            'status',
            'paymentStatus',
            'paymentMethod',
            'deliveryPartnerName',
            'addressFormatted',
            'itemsJson',
            'itemsTotal',
            'deliveryCharge',
            'handlingCharge',
            'smallCartCharge',
            'discount',
            'grandTotal',
            'createdAt',
          ],
          editProperties: ['status', 'paymentStatus', 'deliveryPartnerId'],
          actions: {
            ...resourceActions('manageOrders'),
            list: {
              ...cmsListView('manageOrders'),
              handler: orderListHandler.handler,
            },
            show: {
              isAccessible: canManage('manageOrders'),
              isVisible: false,
              component: Components.OrderDetail,
              handler: orderShowHandler.handler,
            },
            edit: {
              ...orderEditHandler,
              label: 'Open',
              hideActionHeader: true,
              component: Components.OrderDetail,
            },
            new: () => false,
            delete: () => false,
            collectCash: {
              actionType: 'record',
              icon: 'CreditCard',
              label: 'Mark cash collected',
              isVisible: false,
              isAccessible: canManage('manageOrders'),
              component: false,
              handler: collectCashAction,
            },
            generateQr: {
              actionType: 'record',
              icon: 'Camera',
              label: 'Generate payment QR',
              isVisible: false,
              isAccessible: canManage('manageOrders'),
              component: false,
              handler: generateQrAction,
            },
          },
          properties: {
            orderNo: { isTitle: true, label: 'Order number' },
            customerName: {
              label: 'Customer',
              isVisible: { list: true, show: true, edit: false, filter: true },
            },
            customerPhone: {
              label: 'Phone',
              isVisible: { list: true, show: true, edit: false, filter: false },
            },
            customerEmail: { isVisible: false },
            addressFormatted: { isVisible: false },
            addressJson: { isVisible: false },
            addressLabel: { isVisible: false },
            itemsJson: { isVisible: false },
            paymentMethod: { isVisible: false },
            customerId: { isVisible: false },
            customer: { isVisible: false },
            address: { isVisible: false },
            items: { isVisible: false },
            razorpayOrderId: { isVisible: false },
            razorpayPaymentId: { isVisible: false },
            razorpayPaymentLinkId: { isVisible: false },
            razorpayQrUrl: { isVisible: { list: false, show: true, edit: false, filter: false } },
            couponCode: { isVisible: false },
            updatedAt: { isVisible: false },
            deliveryPartner: { isVisible: false },
            deliveryPartnerName: { label: 'Delivery partner' },
            paymentMode: { label: 'Checkout method' },
            paymentCollectedAs: { label: 'Collected as' },
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
          listProperties: ['code', 'type', 'value', 'applyOn', 'targetType', 'usageType', 'isActive', 'usedCount'],
          editProperties: [
            'code',
            'type',
            'value',
            'minCart',
            'maxDiscount',
            'applyOn',
            'targetType',
            'targetSlugs',
            'usageType',
            'usageLimit',
            'startsAt',
            'expiresAt',
            'isActive',
          ],
          actions: {
            ...resourceActions('manageCoupons'),
            list: cmsListView('manageCoupons'),
            new: {
              isAccessible: canManage('manageCoupons'),
              component: Components.CouponEdit,
              before: prepareCouponPayload,
            },
            edit: {
              isAccessible: canManage('manageCoupons'),
              isVisible: true,
              component: Components.CouponEdit,
              before: prepareCouponPayload,
            },
          },
          custom: {
            apiBaseUrl: `${env.apiUrl}/api/v1`,
          },
          properties: {
            code: { isTitle: true, label: 'Code' },
            type: { label: 'Discount type' },
            value: { label: 'Value' },
            applyOn: { label: 'Applies to' },
            targetType: { label: 'Target' },
            usageType: { label: 'Usage' },
            usedCount: { isVisible: { list: true, filter: true, show: true, edit: false } },
            targetSlugs: { isVisible: false },
          },
        },
      },
      getSettingResource(Components.SettingsEdit),
      {
        resource: { model: AdminJSPrisma.getModelByName('DeliveryPartner'), client: prisma },
        options: {
          name: 'Delivery partners',
          navigation: { name: 'Settings', icon: 'Truck' },
          listProperties: ['name', 'email', 'phone', 'address', 'isActive'],
          editProperties: ['name', 'email', 'phone', 'address', 'isActive', 'notes'],
          filterProperties: ['name', 'email', 'phone', 'isActive'],
          properties: {
            name: { isTitle: true, label: 'Partner' },
            email: { type: 'email', label: 'Email' },
            phone: { label: 'Mobile' },
            address: { label: 'Address' },
            notes: { type: 'textarea', label: 'Notes' },
            isActive: {
              label: 'Status',
              components: {
                list: Components.StatusToggle,
                show: Components.StatusToggle,
              },
            },
            password: { isVisible: false },
            pincodes: { isVisible: false },
            orders: { isVisible: false },
            devices: { isVisible: false },
            passwordTokens: { isVisible: false },
          },
          actions: {
            ...resourceActions('manageSettings'),
            list: {
              ...cmsListView('manageSettings'),
              after: sanitizePartnerRecord,
            },
            new: {
              isAccessible: canManage('manageSettings'),
              component: Components.PartnerEdit,
              before: preparePartnerPayload,
              after: afterPartnerSave,
            },
            edit: {
              isAccessible: canManage('manageSettings'),
              isVisible: true,
              component: Components.PartnerEdit,
              before: preparePartnerPayload,
              after: sanitizePartnerRecord,
            },
            sendPasswordEmail: {
              actionType: 'record',
              icon: 'Mail',
              label: 'Send password email',
              guard: 'Send a set/reset password link to this partner’s email?',
              isAccessible: canManage('manageSettings'),
              component: false,
              handler: sendPartnerPasswordAction,
            },
            toggleActive: {
              actionType: 'record',
              isVisible: false,
              isAccessible: canManage('manageSettings'),
              component: false,
              handler: togglePartnerActiveAction,
            },
          },
        },
      },
      {
        resource: { model: AdminJSPrisma.getModelByName('IndiaState'), client: prisma },
        options: {
          name: 'Indian states',
          navigation: false,
          listProperties: ['code', 'name'],
          properties: {
            name: { isTitle: true },
            code: { isId: true },
          },
          actions: {
            list: { isAccessible: canManage('manageSettings') },
            search: { isAccessible: canManage('manageSettings') },
            show: () => false,
            new: () => false,
            edit: () => false,
            delete: () => false,
            bulkDelete: () => false,
          },
        },
      },
      {
        resource: { model: AdminJSPrisma.getModelByName('ServiceablePincode'), client: prisma },
        options: {
          name: 'Serviceable pincodes',
          navigation: { name: 'Settings', icon: 'MapPin' },
          listProperties: ['pincode', 'city', 'state', 'areaLabel', 'partner', 'isActive'],
          editProperties: ['pincode', 'city', 'state', 'areaLabel', 'isActive', 'partner'],
          filterProperties: ['pincode', 'city', 'state', 'areaLabel', 'isActive', 'partner'],
          custom: {
            states: INDIA_STATES,
          },
          properties: {
            pincode: { isTitle: true, label: 'Pincode' },
            areaLabel: { label: 'Area' },
            city: { label: 'City' },
            isActive: {
              label: 'Status',
              components: {
                list: Components.StatusToggle,
                show: Components.StatusToggle,
              },
            },
            partner: { reference: 'DeliveryPartner', label: 'Partner' },
            partnerId: { isVisible: false },
            state: { reference: 'IndiaState', label: 'State' },
            stateCode: { isVisible: false },
          },
          actions: {
            ...resourceActions('manageSettings'),
            list: cmsListView('manageSettings'),
            new: {
              isAccessible: canManage('manageSettings'),
              component: Components.PincodeEdit,
              before: preparePincodePayload,
            },
            edit: {
              isAccessible: canManage('manageSettings'),
              isVisible: true,
              component: Components.PincodeEdit,
              before: preparePincodePayload,
            },
            toggleActive: {
              actionType: 'record',
              isVisible: false,
              isAccessible: canManage('manageSettings'),
              component: false,
              handler: togglePincodeActiveAction,
            },
          },
        },
      },
      {
        resource: { model: AdminJSPrisma.getModelByName('PartnerPasswordToken'), client: prisma },
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
        resource: { model: AdminJSPrisma.getModelByName('PartnerDeviceToken'), client: prisma },
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
        resource: { model: AdminJSPrisma.getModelByName('Customer'), client: prisma },
        options: {
          name: 'Customers',
          navigation: { name: null, icon: 'User' },
          listProperties: ['name', 'phone', 'dateOfBirth', 'isActive', 'createdAt'],
          editProperties: ['name', 'phone', 'dateOfBirth', 'isActive'],
          properties: {
            name: { isTitle: true, label: 'Customer' },
            phone: { isDisabled: true, label: 'Mobile' },
            dateOfBirth: { type: 'date', label: 'Date of birth' },
            isActive: {
              label: 'Status',
              components: {
                list: Components.StatusToggle,
              },
            },
            addresses: {
              type: 'mixed',
              isVisible: { list: false, filter: false, show: true, edit: true },
            },
            orders: { isVisible: false },
            cart: { isVisible: false },
            devices: { isVisible: false },
            couponUses: { isVisible: false },
          },
          actions: {
            ...resourceActions('manageUsers'),
            list: cmsListView('manageUsers'),
            edit: {
              isAccessible: canManage('manageUsers'),
              isVisible: true,
              component: Components.CustomerEdit,
              before: prepareCustomerPayload,
              after: attachCustomerAddresses,
            },
            new: () => false,
            delete: () => false,
            toggleActive: {
              actionType: 'record',
              isVisible: false,
              isAccessible: canManage('manageUsers'),
              component: false,
              handler: toggleCustomerActiveAction,
            },
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
            ...Object.keys(PERMISSION_KEYS).map((key) => `permissions.${key}`),
          ],
          newProperties: ['name', 'username', 'email', 'role', 'isActive', 'password', 'confirmPassword'],
          sections: [
            {
              label: 'Account',
              properties: ['name', 'username', 'email', 'role', 'isActive'],
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
              isVisible: { list: false, show: false, edit: false, filter: false },
            },
            confirmPassword: {
              type: 'password',
              label: 'Confirm password',
              isVisible: { list: false, show: false, edit: false, filter: false },
            },
            username: { description: 'Sign in with username or email' },
            role: {
              availableValues: [
                { value: 'staff', label: 'Staff (permission-based)' },
                { value: 'admin', label: 'Admin (full access)' },
                { value: 'super_admin', label: 'Super Admin (full access)' },
              ],
            },
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
              before: [hashNewPassword],
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
                async (request) => {
                  if (request.payload) delete request.payload.password
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
            changePassword: {
              actionType: 'record',
              icon: 'Key',
              label: 'Change password',
              component: Components.ChangePassword,
              isAccessible: canManage('manageUsers'),
              isVisible: true,
              handler: async (request, _response, context) => {
                const recordJson = context.record.toJSON(context.currentAdmin)
                if (request.method !== 'post') {
                  return { record: recordJson }
                }

                const password = String(request.payload?.password || '').trim()
                const confirmPassword = String(request.payload?.confirmPassword || '').trim()
                if (password.length < 6) {
                  return {
                    record: recordJson,
                    notice: { message: 'Password must be at least 6 characters.', type: 'error' },
                  }
                }
                if (password !== confirmPassword) {
                  return {
                    record: recordJson,
                    notice: { message: 'New password and confirm password must be the same.', type: 'error' },
                  }
                }

                await prisma.user.update({
                  where: { id: context.record.params.id },
                  data: { password: await bcrypt.hash(password, 10) },
                })

                return {
                  record: recordJson,
                  notice: { message: 'Password updated.', type: 'success' },
                  redirectUrl: context.h.resourceUrl({ resourceId: context.resource.id() }),
                }
              },
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
    {
      maxFileSize: 50 * 1024 * 1024,
      keepExtensions: true,
    },
  )

  adminRouter.use('/catalog', buildCatalogRoutes())

  return { admin, adminRouter }
}
