import { toPublicAssetUrl } from './formatters.js'

export function parseFeaturedCategorySlugs(value) {
  if (!value) return []
  if (Array.isArray(value)) {
    return [...new Set(value.map((item) => String(item).trim()).filter(Boolean))]
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) return parseFeaturedCategorySlugs(parsed)
    } catch {
      // comma-separated fallback
    }
    return [...new Set(value.split(',').map((item) => item.trim()).filter(Boolean))]
  }
  return []
}

export function formatPublicSettings(settings) {
  if (!settings) {
    return { store: null, home: null, payment: null, messaging: null, charges: null }
  }

  return {
    store: {
      name: settings.storeName,
      tagline: settings.storeTagline,
      email: settings.storeEmail,
      phones: [settings.storePhone1, settings.storePhone2].filter(Boolean),
      address: settings.storeAddress,
      promoBanner: settings.promoBanner,
      earlyDelivery: settings.earlyDelivery,
    },
    home: {
      bannerImage: toPublicAssetUrl(settings.homeBannerImage),
      highlightImage: toPublicAssetUrl(settings.homeHighlightImage),
      featuredCategorySlugs: parseFeaturedCategorySlugs(settings.homeFeaturedCategorySlugs),
    },
    payment: {
      razorpay: {
        enabled: Boolean(settings.razorpayEnabled),
        keyId: settings.razorpayKeyId || '',
      },
    },
    messaging: {
      msg91: {
        enabled: Boolean(settings.msg91Enabled),
        senderId: settings.msg91SenderId || '',
        whatsappEnabled: Boolean(settings.msg91WhatsappEnabled),
      },
    },
    charges: {
      shippingFee: Number(settings.shippingFee ?? 25),
      handlingFee: Number(settings.handlingFee ?? 2),
    },
  }
}
