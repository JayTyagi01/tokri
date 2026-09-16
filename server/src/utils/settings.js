export function formatPublicSettings(settings) {
  if (!settings) {
    return { store: null, home: null, payment: null, messaging: null, charges: null }
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
