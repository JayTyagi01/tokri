import * as AdminJSPrisma from '@adminjs/prisma'
import { prisma } from '../lib/prisma.js'
import { env } from '../config/env.js'
import { canManage } from './permissions.js'
import { settingsEditHandler } from './settings-handlers.js'

const SETTING_RECORD_ID = '1'

export function getSettingResource(SettingsEditComponent) {
  return {
    resource: { model: AdminJSPrisma.getModelByName('Setting'), client: prisma },
    options: {
      name: 'General',
      navigation: { name: 'Settings', icon: 'Settings' },
      href: ({ h }) =>
        h.recordActionUrl({
          resourceId: 'Setting',
          recordId: SETTING_RECORD_ID,
          actionName: 'edit',
        }),
      editProperties: [
        'storeName',
        'storeTagline',
        'storeEmail',
        'storePhone1',
        'storePhone2',
        'storeAddress',
        'promoBanner',
        'earlyDelivery',
        'shippingFee',
        'handlingFee',
        'homeBannerImage',
        'homeHighlightImage',
        'homeFeaturedCategorySlugs',
        'razorpayEnabled',
        'razorpayKeyId',
        'razorpayKeySecret',
        'codEnabled',
        'msg91Enabled',
        'msg91AuthKey',
        'msg91SenderId',
        'msg91OtpTemplateId',
        'msg91OrderTemplateId',
        'msg91WhatsappEnabled',
        'msg91WhatsappNumber',
        'msg91WhatsappOtpTemplate',
        'msg91WhatsappOrderTemplate',
        'msg91WhatsappLanguage',
        'msg91WhatsappNamespace',
        'msg91WhatsappOtpButton',
      ],
      actions: {
        list: {
          isVisible: false,
          isAccessible: canManage('manageSettings'),
          handler: async (_request, _response, context) => ({
            redirectUrl: context.h.recordActionUrl({
              resourceId: 'Setting',
              recordId: SETTING_RECORD_ID,
              actionName: 'edit',
            }),
          }),
        },
        show: { isVisible: false, isAccessible: () => false },
        new: { isVisible: false, isAccessible: () => false },
        delete: { isVisible: false, isAccessible: () => false },
        search: { isVisible: false, isAccessible: () => false },
        edit: {
          isVisible: true,
          isAccessible: canManage('manageSettings'),
          component: SettingsEditComponent,
          handler: settingsEditHandler,
          before: async (request) => {
            request.params = { ...request.params, recordId: SETTING_RECORD_ID }
            return request
          },
        },
      },
      properties: {
        id: { isVisible: false },
        updatedAt: { isVisible: false },
        store: { isVisible: false },
        theme: { isVisible: false },
        home: { isVisible: false },
        payment: { isVisible: false },
        messaging: { isVisible: false },
        storeName: { label: 'Site title' },
        storeTagline: { label: 'Tagline' },
        storeEmail: { label: 'Support email' },
        storePhone1: { label: 'Phone 1' },
        storePhone2: { label: 'Phone 2' },
        storeAddress: { type: 'textarea', label: 'Store address' },
        promoBanner: { type: 'richtext', label: 'Top promo banner' },
        earlyDelivery: { label: 'Early delivery message' },
        shippingFee: {
          type: 'number',
          label: 'Shipping fee (₹)',
          description: 'Delivery charge added to every order',
        },
        handlingFee: {
          type: 'number',
          label: 'Handling charge (₹)',
          description: 'Cart handling fee added to every order',
        },
        homeBannerImage: { label: 'Home banner image' },
        homeHighlightImage: { label: 'Fruit highlight image' },
        homeFeaturedCategorySlugs: { label: 'Homepage categories' },
        razorpayEnabled: { label: 'Enable Razorpay checkout' },
        razorpayKeyId: { label: 'Razorpay Key ID' },
        razorpayKeySecret: {
          type: 'password',
          label: 'Razorpay Key Secret',
          description: 'Leave blank to keep current secret',
        },
        codEnabled: {
          label: 'Enable cash on delivery',
          description: 'Customers can place unpaid orders and pay cash or scan a QR at the door',
        },
        msg91Enabled: { label: 'Enable MSG91 SMS' },
        msg91AuthKey: {
          type: 'password',
          label: 'MSG91 Auth Key',
          description: 'Leave blank to keep the current key',
        },
        msg91SenderId: {
          label: 'Sender ID',
          description: '6-character DLT approved header, e.g. TOKRII',
        },
        msg91OtpTemplateId: {
          label: 'Login OTP template ID',
          description:
            'MSG91 Template ID from the copy icon, e.g. 6aae9748a337d718910d31f3. Do not paste the 19-digit Airtel DLT ID.',
        },
        msg91OrderTemplateId: {
          label: 'Order confirmation template ID',
          description:
            'MSG91 Template ID from the copy icon, e.g. 6aae978b1d0d6a12170b93f4. Do not paste the 19-digit Airtel DLT ID.',
        },
        msg91WhatsappEnabled: {
          label: 'Enable MSG91 WhatsApp',
          description: 'Used when SMS is off or the SMS gateway rejects a message',
        },
        msg91WhatsappNumber: {
          label: 'WhatsApp business number',
          description: 'The integrated number on your MSG91 WhatsApp account, e.g. 919580280280',
        },
        msg91WhatsappOtpTemplate: {
          label: 'WhatsApp OTP template name',
          description: 'Approved template with 1 body variable: the OTP code',
        },
        msg91WhatsappOrderTemplate: {
          label: 'WhatsApp order template name',
          description: 'Approved template with 3 body variables: name, order number, amount',
        },
        msg91WhatsappLanguage: {
          label: 'WhatsApp template language',
          description: 'Language code of the approved templates, e.g. en or en_US',
        },
        msg91WhatsappNamespace: {
          label: 'WhatsApp template namespace',
          description: 'Optional. Only needed if your MSG91 account requires it',
        },
        msg91WhatsappOtpButton: {
          label: 'OTP template has a copy-code button',
          description: 'Turn on only if your WhatsApp OTP template includes the copy-code button',
        },
      },
      custom: {
        apiBaseUrl: `${env.apiUrl}/api/v1`,
        appUrl: env.apiUrl,
      },
    },
  }
}

export async function ensureSettingsRecord() {
  await prisma.setting.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  })
}
