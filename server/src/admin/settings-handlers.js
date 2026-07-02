import { prisma } from '../lib/prisma.js'

const SETTING_ID = 1

export const ALLOWED_SETTING_FIELDS = new Set([
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
])

const BOOLEAN_FIELDS = new Set([
  'homeBannerEnabled',
  'homeCategoriesEnabled',
  'homeBestSellersEnabled',
  'homeShopOurRangeEnabled',
  'homeFruitHighlightEnabled',
  'homeImportedFruitsEnabled',
  'homeReviewsEnabled',
  'razorpayEnabled',
  'twilioEnabled',
])

function toBoolean(value) {
  return value === true || value === 'true' || value === 'on' || value === 1 || value === '1'
}

export function cleanSettingsPayload(payload = {}) {
  const cleaned = {}

  for (const [key, value] of Object.entries(payload)) {
    if (!ALLOWED_SETTING_FIELDS.has(key)) continue
    cleaned[key] = value
  }

  delete cleaned.id
  delete cleaned.updatedAt
  if (!cleaned.razorpayKeySecret) delete cleaned.razorpayKeySecret
  if (!cleaned.twilioAuthToken) delete cleaned.twilioAuthToken

  return cleaned
}

export function payloadToSettingData(payload) {
  const data = {}

  for (const [key, value] of Object.entries(cleanSettingsPayload(payload))) {
    if (BOOLEAN_FIELDS.has(key)) {
      data[key] = toBoolean(value)
      continue
    }

    if (value === undefined || value === null || value === '') continue
    data[key] = value
  }

  return data
}

export async function saveSettingsFromPayload(payload) {
  const data = payloadToSettingData(payload)

  return prisma.setting.update({
    where: { id: SETTING_ID },
    data: {
      ...data,
      store: null,
      theme: null,
      home: null,
      payment: null,
      messaging: null,
    },
  })
}

export function settingToRecordParams(setting) {
  if (!setting) return {}

  const params = { id: String(setting.id) }

  for (const key of ALLOWED_SETTING_FIELDS) {
    const value = setting[key]
    if (value === null || value === undefined) continue

    if (typeof value === 'boolean') {
      params[key] = value
    } else if (value instanceof Date) {
      params[key] = value.toISOString()
    } else {
      params[key] = String(value)
    }
  }

  return params
}

export function cleanRecordParams(params = {}) {
  const cleaned = {}

  for (const [key, value] of Object.entries(params)) {
    if (!ALLOWED_SETTING_FIELDS.has(key)) continue
    cleaned[key] = value
  }

  if (params.id !== undefined) cleaned.id = params.id

  return cleaned
}

export async function settingsEditHandler(request, _response, context) {
  const { record, resource, currentAdmin } = context

  if (!record) {
    throw new Error('Settings record could not be found')
  }

  if (request.method === 'get') {
    const json = record.toJSON(currentAdmin)
    json.params = cleanRecordParams(json.params)
    return { record: json }
  }

  const payload = request.payload ?? request.fields ?? {}
  const updated = await saveSettingsFromPayload(payload)
  const rebuilt = resource.build(settingToRecordParams(updated))

  return {
    record: rebuilt.toJSON(currentAdmin),
    notice: {
      message: 'Settings saved successfully',
      type: 'success',
    },
  }
}
