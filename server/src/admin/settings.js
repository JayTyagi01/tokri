import * as AdminJSPrisma from '@adminjs/prisma'
import { prisma } from '../lib/prisma.js'
import { canManage } from './permissions.js'
import { settingsEditHandler } from './settings-handlers.js'

const SETTING_RECORD_ID = '1'

const colorField = (label) => ({
  label,
  description: 'Hex color e.g. #022c22',
  props: { placeholder: '#000000' },
})

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
        'colorPrimary',
        'colorPrimaryLight',
        'colorAccent',
        'colorBackground',
        'colorFooterFrom',
        'colorFooterVia',
        'fontFamily',
        'homeBannerEnabled',
        'homeCategoriesEnabled',
        'homeBestSellersEnabled',
        'homeBestSellersTitle',
        'homeShopOurRangeEnabled',
        'homeFruitHighlightEnabled',
        'homeImportedFruitsEnabled',
        'homeReviewsEnabled',
        'razorpayEnabled',
        'razorpayKeyId',
        'razorpayKeySecret',
        'twilioEnabled',
        'twilioAccountSid',
        'twilioAuthToken',
        'twilioSmsFrom',
        'twilioWhatsappFrom',
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
        colorPrimary: colorField('Primary color'),
        colorPrimaryLight: colorField('Primary light'),
        colorAccent: colorField('Accent color'),
        colorBackground: colorField('Page background'),
        colorFooterFrom: colorField('Footer gradient start'),
        colorFooterVia: colorField('Footer gradient middle'),
        fontFamily: { label: 'Font family' },
        homeBannerEnabled: { label: 'Show hero banner' },
        homeCategoriesEnabled: { label: 'Show categories section' },
        homeBestSellersEnabled: { label: 'Show bestsellers section' },
        homeBestSellersTitle: { label: 'Bestsellers heading' },
        homeShopOurRangeEnabled: { label: 'Show shop our range section' },
        homeFruitHighlightEnabled: { label: 'Show fruit highlight section' },
        homeImportedFruitsEnabled: { label: 'Show imported fruits section' },
        homeReviewsEnabled: { label: 'Show customer reviews section' },
        razorpayEnabled: { label: 'Enable Razorpay checkout' },
        razorpayKeyId: { label: 'Razorpay Key ID' },
        razorpayKeySecret: {
          type: 'password',
          label: 'Razorpay Key Secret',
          description: 'Leave blank to keep current secret',
        },
        twilioEnabled: { label: 'Enable Twilio SMS / WhatsApp' },
        twilioAccountSid: { label: 'Twilio Account SID' },
        twilioAuthToken: {
          type: 'password',
          label: 'Twilio Auth Token',
          description: 'Leave blank to keep current token',
        },
        twilioSmsFrom: { label: 'SMS sender number' },
        twilioWhatsappFrom: { label: 'WhatsApp sender number' },
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
