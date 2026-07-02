export function formatPublicSettings(settings) {
  if (!settings) {
    return { store: null, theme: null, home: null, payment: null, messaging: null }
  }

  const homeSections = [
    { type: 'banner', enabled: settings.homeBannerEnabled !== false },
    { type: 'categories', enabled: settings.homeCategoriesEnabled !== false },
    {
      type: 'bestSellers',
      enabled: settings.homeBestSellersEnabled !== false,
      title: settings.homeBestSellersTitle || 'Shop Our Bestsellers',
    },
    { type: 'shopOurRange', enabled: settings.homeShopOurRangeEnabled !== false },
    { type: 'fruitHighlight', enabled: settings.homeFruitHighlightEnabled !== false },
    { type: 'importedFruits', enabled: settings.homeImportedFruitsEnabled !== false },
    { type: 'reviews', enabled: settings.homeReviewsEnabled !== false },
  ]

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
    theme: {
      colors: {
        primary: settings.colorPrimary,
        primaryLight: settings.colorPrimaryLight,
        accent: settings.colorAccent,
        background: settings.colorBackground,
        footerFrom: settings.colorFooterFrom,
        footerVia: settings.colorFooterVia,
      },
      fontFamily: settings.fontFamily,
    },
    home: {
      sections: homeSections,
    },
    payment: {
      razorpay: {
        enabled: Boolean(settings.razorpayEnabled),
        keyId: settings.razorpayKeyId || '',
      },
    },
    messaging: {
      twilio: {
        enabled: Boolean(settings.twilioEnabled),
        smsFrom: settings.twilioSmsFrom || '',
        whatsappFrom: settings.twilioWhatsappFrom || '',
      },
    },
  }
}
