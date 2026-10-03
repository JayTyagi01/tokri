import { Linking, Platform } from 'react-native'
import * as IntentLauncher from 'expo-intent-launcher'

export const UPI_APPS = [
  {
    id: 'gpay',
    label: 'Google Pay',
    mark: 'G',
    color: '#1f7a3a',
    icon: require('../../assets/payments/gpay.png'),
    packageName: 'com.google.android.apps.nbu.paisa.user',
    schemes: ['tez://', 'gpay://'],
    iosScheme: 'tez://upi/pay',
    androidPayPath: 'tez://upi/pay',
  },
  {
    id: 'phonepe',
    label: 'PhonePe',
    mark: 'Pe',
    color: '#5f259f',
    icon: require('../../assets/payments/phonepe.png'),
    packageName: 'com.phonepe.app',
    schemes: ['phonepe://'],
    iosScheme: 'phonepe://pay',
    androidPayPath: 'phonepe://pay',
  },
  {
    id: 'paytm',
    label: 'Paytm',
    mark: 'Pt',
    color: '#00baf2',
    icon: require('../../assets/payments/paytm.png'),
    packageName: 'net.one97.paytm',
    schemes: ['paytmmp://', 'paytm://'],
    iosScheme: 'paytmmp://pay',
    androidPayPath: 'paytmmp://pay',
  },
  {
    id: 'cred',
    label: 'CRED',
    mark: 'Cr',
    color: '#111827',
    icon: require('../../assets/payments/cred.png'),
    packageName: 'com.dreamplug.androidapp',
    schemes: ['credpay://'],
    iosScheme: 'credpay://upi/pay',
    androidPayPath: 'credpay://upi/pay',
  },
  {
    id: 'amazon',
    label: 'Amazon Pay',
    mark: 'Az',
    color: '#e47911',
    icon: require('../../assets/payments/amazon.png'),
    packageName: 'in.amazon.mShop.android.shopping',
    schemes: ['amazonpay://'],
    iosScheme: 'amazonpay://upi/pay',
    androidPayPath: 'amazonpay://upi/pay',
  },
  {
    id: 'bhim',
    label: 'BHIM',
    mark: 'BH',
    color: '#0f766e',
    icon: require('../../assets/payments/upi.png'),
    packageName: 'in.org.npci.upiapp',
    schemes: ['bhim://'],
    iosScheme: 'bhim://upi/pay',
    androidPayPath: 'bhim://upi/pay',
  },
]

const FLAG_ACTIVITY_NEW_TASK = 0x10000000

export function upiAppById(id) {
  return UPI_APPS.find((app) => app.id === id) || null
}

async function isAppInstalled(app) {
  if (Platform.OS === 'android' && app.packageName) {
    try {
      const icon = await IntentLauncher.getApplicationIconAsync(app.packageName)
      if (icon) return true
    } catch {
      // Not installed, or Expo Go cannot query this package.
    }
  }

  const schemes = app.schemes || []
  for (const scheme of schemes) {
    try {
      if (await Linking.canOpenURL(scheme)) return true
    } catch {
      // Ignore scheme probe failures.
    }
  }
  return false
}

/** Returns UPI apps installed on this phone. Falls back to the full list if none can be detected. */
export async function detectInstalledUpiApps() {
  const checks = await Promise.all(
    UPI_APPS.map(async (app) => ({ app, installed: await isAppInstalled(app) })),
  )
  const installed = checks.filter((row) => row.installed).map((row) => row.app)
  if (installed.length) return installed
  // Expo Go / restricted builds often cannot see other apps — still show common UPI options.
  return UPI_APPS
}

function normalizeIntentUrl(raw) {
  let url = String(raw || '').trim()
  if (!url) return ''

  // intent://pay?...#Intent;scheme=upi;package=...;end
  if (/^intent:/i.test(url)) {
    const schemeMatch = url.match(/;scheme=([^;]+)/i)
    const dataMatch = url.match(/^intent:\/\/([^#]+)/i)
    if (schemeMatch && dataMatch) {
      url = `${schemeMatch[1]}://${dataMatch[1]}`
    }
  }

  return url
}

function upiQuery(url) {
  const trimmed = String(url || '')
  const qIndex = trimmed.indexOf('?')
  if (qIndex === -1) return ''
  return trimmed.slice(qIndex + 1)
}

/** Build an app-specific deep link so Android opens that app, not the system chooser. */
function appSpecificPayUrl(app, upiUrl) {
  const query = upiQuery(upiUrl)
  if (!app || !query) return upiUrl

  if (app.androidPayPath) return `${app.androidPayPath}?${query}`
  return upiUrl
}

function androidIntentWithPackage(upiUrl, packageName) {
  const query = upiQuery(upiUrl)
  if (!query || !packageName) return ''
  // Standard Android intent URI that pins the target package.
  return `intent://pay?${query}#Intent;scheme=upi;package=${packageName};end`
}

async function tryOpenAndroid(url, packageName) {
  if (packageName) {
    try {
      await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        data: url,
        packageName,
        flags: FLAG_ACTIVITY_NEW_TASK,
      })
      return true
    } catch {
      // Try next strategy.
    }
  }

  try {
    await Linking.openURL(url)
    return true
  } catch {
    return false
  }
}

function iosUrl(app, intentUrl) {
  const query = upiQuery(intentUrl)
  if (app?.iosScheme && query) return `${app.iosScheme}?${query}`
  return intentUrl
}

export async function openUpiApp(appId, intentUrl) {
  const app = upiAppById(appId)
  let url = normalizeIntentUrl(intentUrl)
  if (!url) throw new Error('Could not start this payment.')

  if (!/^(upi:|tez:|phonepe:|paytmmp:|gpay:|credpay:|amazonpay:|bhim:)/i.test(url)) {
    throw new Error('Could not start this payment.')
  }

  if (Platform.OS === 'android') {
    const packageName = app?.packageName || ''
    const specific = app ? appSpecificPayUrl(app, url) : url
    const pinnedIntent = packageName ? androidIntentWithPackage(url, packageName) : ''

    // 1) App deep link + package (best chance to skip chooser)
    if (await tryOpenAndroid(specific, packageName)) return

    // 2) Generic upi:// pinned to package via IntentLauncher
    if (packageName && (await tryOpenAndroid(url, packageName))) return

    // 3) intent://…;package=… URI (works even when IntentLauncher fails)
    if (pinnedIntent && (await tryOpenAndroid(pinnedIntent, null))) return

    // 4) App deep link without package
    if (specific !== url && (await tryOpenAndroid(specific, null))) return

    throw new Error(`${app?.label || 'This UPI app'} is not installed on this phone.`)
  }

  const target = iosUrl(app, url)
  const canOpen = await Linking.canOpenURL(target).catch(() => false)
  if (!canOpen) {
    throw new Error(`${app?.label || 'This UPI app'} is not installed on this phone.`)
  }
  await Linking.openURL(target)
}
