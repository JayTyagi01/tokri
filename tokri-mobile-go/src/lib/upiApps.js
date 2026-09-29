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
  },
]

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

function iosUrl(app, intentUrl) {
  const query = String(intentUrl).split('?')[1] || ''
  if (app?.iosScheme && query) return `${app.iosScheme}?${query}`
  return intentUrl
}

export async function openUpiApp(appId, intentUrl) {
  const app = upiAppById(appId)
  let url = String(intentUrl || '').trim()
  if (!url) throw new Error('Could not start this payment.')

  if (/^intent:/i.test(url)) {
    const schemeMatch = url.match(/;scheme=([^;]+)/i)
    const dataMatch = url.match(/^intent:\/\/([^#]+)/i)
    if (schemeMatch && dataMatch) {
      url = `${schemeMatch[1]}://${dataMatch[1]}`
    }
  }

  if (!/^(upi:|tez:|phonepe:|paytmmp:|gpay:|credpay:|amazonpay:|bhim:)/i.test(url)) {
    throw new Error('Could not start this payment.')
  }

  if (Platform.OS === 'android') {
    if (app?.packageName) {
      try {
        await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
          data: url,
          packageName: app.packageName,
        })
        return
      } catch {
        // Fall through.
      }
    }
    try {
      await Linking.openURL(url)
      return
    } catch {
      // Fall through.
    }
    try {
      await IntentLauncher.startActivityAsync('android.intent.action.VIEW', { data: url })
      return
    } catch {
      throw new Error(`${app?.label || 'This UPI app'} is not installed on this phone.`)
    }
  }

  const target = iosUrl(app, url)
  const canOpen = await Linking.canOpenURL(target).catch(() => false)
  if (!canOpen) {
    throw new Error(`${app?.label || 'This UPI app'} is not installed on this phone.`)
  }
  await Linking.openURL(target)
}
