const { withAndroidManifest } = require('@expo/config-plugins')

const PACKAGES = [
  'com.google.android.apps.nbu.paisa.user',
  'com.phonepe.app',
  'net.one97.paytm',
  'com.dreamplug.androidapp',
  'in.amazon.mShop.android.shopping',
  'in.org.npci.upiapp',
]

function withUpiApps(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest
    const queries = manifest.queries?.[0] || {}
    queries.package = queries.package || []
    for (const name of PACKAGES) {
      const listed = queries.package.some((item) => item.$?.['android:name'] === name)
      if (!listed) queries.package.push({ $: { 'android:name': name } })
    }
    queries.intent = queries.intent || []
    const hasUpi = queries.intent.some((item) =>
      (item.data || []).some((data) => data.$?.['android:scheme'] === 'upi'),
    )
    if (!hasUpi) {
      queries.intent.push({
        action: [{ $: { 'android:name': 'android.intent.action.VIEW' } }],
        data: [{ $: { 'android:scheme': 'upi', 'android:host': 'pay' } }],
      })
    }
    manifest.queries = [queries]
    return config
  })
}

module.exports = withUpiApps
