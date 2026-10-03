import { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Modal, Pressable, Text, View } from 'react-native'
import { Image } from 'expo-image'
import { SafeAreaView } from 'react-native-safe-area-context'
import { WebView } from 'react-native-webview'
import { openUpiApp, upiAppById } from '../lib/upiApps'
import Icon from './Icon'

const CHECKOUT_UPI_APPS = {
  gpay: 'google_pay',
  phonepe: 'phonepe',
  paytm: 'paytm',
  cred: 'cred',
  amazon: 'amazon',
  upi: 'any',
}

const UPI_URL = /^(upi:|intent:|tez:|phonepe:|paytmmp:|gpay:|credpay:|amazonpay:)/i

function formatAmount(paise) {
  const value = Number(paise) / 100
  if (!Number.isFinite(value)) return '₹0'
  return `₹${value % 1 === 0 ? value.toFixed(0) : value.toFixed(2)}`
}

function checkoutHtml(config) {
  const upiKey = CHECKOUT_UPI_APPS[config.upiApp]
  const options = {
    key: config.keyId,
    amount: config.amount,
    currency: config.currency || 'INR',
    name: config.name || 'Tokriii',
    description: config.description || 'Tokriii order',
    order_id: config.orderId,
    prefill: config.prefill || {},
    theme: { color: '#047857' },
    webview_intent: true,
  }

  if (config.onlyMethod) {
    const labels = {
      card: 'Cards',
      netbanking: 'Netbanking',
      wallet: 'Wallets',
    }
    options.method = config.onlyMethod
    options.config = {
      display: {
        blocks: {
          only: {
            name: labels[config.onlyMethod] || 'Pay',
            instruments: [{ method: config.onlyMethod }],
          },
        },
        sequence: ['block.only'],
        preferences: { show_default_blocks: false },
      },
    }
  } else if (upiKey) {
    options.method = 'upi'
    options.config = {
      display: {
        blocks: {
          upi: {
            name: 'Pay by UPI',
            instruments: [{ method: 'upi', flows: ['intent'], apps: [upiKey] }],
          },
        },
        sequence: ['block.upi'],
        preferences: { show_default_blocks: false },
      },
    }
  }

  const encoded = JSON.stringify(options)

  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
  <style>html, body { margin: 0; height: 100%; background: #f8fafc; }</style>
</head>
<body>
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
<script>
  var options = ${encoded};
  options.handler = function (response) {
    window.ReactNativeWebView.postMessage(JSON.stringify({ ok: true, response: response }));
  };
  options.modal = {
    ondismiss: function () {
      window.ReactNativeWebView.postMessage(JSON.stringify({ ok: false, cancelled: true }));
    }
  };
  var checkout = new Razorpay(options);
  checkout.on('payment.failed', function (result) {
    var message = (result && result.error && result.error.description) || 'Payment failed. Please try again.';
    window.ReactNativeWebView.postMessage(JSON.stringify({ ok: false, message: message }));
  });
  checkout.open();
</script>
</body>
</html>`
}

function UpiPayScreen({ config, onResult }) {
  const app = upiAppById(config.upiApp)
  const appName = app?.id === 'upi' ? 'UPI app' : app?.label || 'UPI'
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const started = useRef(false)

  const startPay = async () => {
    if (busy) return
    setError('')
    setBusy(true)
    try {
      if (!config.intentUrl) {
        throw new Error('Payment link is missing. Close and try Place Order again.')
      }
      await openUpiApp(config.upiApp, config.intentUrl)
      if (started.current) return
      started.current = true
      onResult({ ok: true, intentStarted: true, paymentId: config.paymentId })
    } catch (err) {
      setError(err.message || `Could not open ${appName}.`)
      setBusy(false)
    }
  }

  return (
    <Modal visible animationType="slide" onRequestClose={() => onResult({ ok: false, cancelled: true })}>
      <SafeAreaView style={upiStyles.screen}>
        <View style={upiStyles.topBar}>
          <Text style={upiStyles.topTitle}>Pay online</Text>
          <Pressable onPress={() => onResult({ ok: false, cancelled: true })} hitSlop={12}>
            <Text style={upiStyles.close}>Close</Text>
          </Pressable>
        </View>

        <View style={upiStyles.brandBar}>
          <View style={upiStyles.brandMark}>
            <Text style={upiStyles.brandMarkText}>T</Text>
          </View>
          <Text style={upiStyles.brandName}>Tokriii</Text>
        </View>

        <View style={upiStyles.body}>
          <Text style={upiStyles.heading}>Payment Options</Text>
          <Text style={upiStyles.subheading}>Pay by UPI</Text>

          <Pressable style={upiStyles.methodRow} onPress={startPay} disabled={busy}>
            {app?.icon ? (
              <Image source={app.icon} style={upiStyles.methodIcon} contentFit="cover" />
            ) : (
              <View style={[upiStyles.methodIcon, { backgroundColor: app?.color || '#0f766e' }]} />
            )}
            <Text style={upiStyles.methodLabel}>UPI - {appName}</Text>
            <Icon name="chevron-forward" size={18} color="#94a3b8" />
          </Pressable>

          {error ? <Text style={upiStyles.error}>{error}</Text> : null}
          <Text style={upiStyles.hint}>Tap Continue to open {appName} and pay.</Text>
        </View>

        <View style={upiStyles.footer}>
          <View>
            <Text style={upiStyles.amount}>{formatAmount(config.amount)}</Text>
            <Text style={upiStyles.viewDetails}>View Details</Text>
          </View>
          <Pressable style={[upiStyles.continueBtn, busy && upiStyles.continueBusy]} onPress={startPay} disabled={busy}>
            {busy ? <ActivityIndicator color="#fff" /> : <Text style={upiStyles.continueText}>Continue</Text>}
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  )
}

const upiStyles = {
  screen: { flex: 1, backgroundColor: '#fff' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  topTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  close: { color: '#047857', fontWeight: '800' },
  brandBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#047857',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  brandMark: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandMarkText: { color: '#047857', fontWeight: '900', fontSize: 16 },
  brandName: { color: '#fff', fontWeight: '800', fontSize: 16 },
  body: { flex: 1, paddingHorizontal: 16, paddingTop: 20 },
  heading: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  subheading: { marginTop: 18, marginBottom: 10, color: '#64748b', fontWeight: '600' },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: '#fff',
  },
  methodIcon: { width: 36, height: 36, borderRadius: 8 },
  methodLabel: { flex: 1, color: '#0f172a', fontWeight: '700', fontSize: 15 },
  hint: { marginTop: 14, color: '#94a3b8', fontSize: 13 },
  error: { marginTop: 12, color: '#b91c1c', fontWeight: '700' },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  amount: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  viewDetails: { marginTop: 2, color: '#64748b', fontSize: 12, fontWeight: '600' },
  continueBtn: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  continueBusy: { opacity: 0.85 },
  continueText: { color: '#fff', fontWeight: '800', fontSize: 16 },
}

export default function RazorpayCheckout({ config, onResult }) {
  const handled = useRef(false)

  useEffect(() => {
    handled.current = false
  }, [config])

  if (!config) return null

  const finish = (result) => {
    if (handled.current) return
    handled.current = true
    onResult(result)
  }

  // UPI with a payment link: our screen — Continue opens the app.
  if (config.upiApp && upiAppById(config.upiApp) && config.intentUrl) {
    return <UpiPayScreen config={config} onResult={finish} />
  }

  // UPI without a payment link: Razorpay page (tap the UPI row to pay).
  // Card / netbanking / wallets also use this WebView.
  return (
    <Modal visible animationType="slide" onRequestClose={() => finish({ ok: false, cancelled: true })}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#0f172a' }}>Pay online</Text>
          <Pressable onPress={() => finish({ ok: false, cancelled: true })} hitSlop={12}>
            <Text style={{ color: '#047857', fontWeight: '800' }}>Close</Text>
          </Pressable>
        </View>
        {config.upiApp && upiAppById(config.upiApp) ? (
          <View style={{ marginHorizontal: 16, marginBottom: 8, padding: 12, borderRadius: 12, backgroundColor: '#ecfdf5' }}>
            <Text style={{ color: '#065f46', fontWeight: '700', lineHeight: 19 }}>
              Tap UPI - {upiAppById(config.upiApp)?.label || 'app'} below to open the app and pay.
            </Text>
          </View>
        ) : null}
        <WebView
          originWhitelist={['*']}
          source={{ html: checkoutHtml(config), baseUrl: 'https://checkout.razorpay.com' }}
          javaScriptEnabled
          domStorageEnabled
          thirdPartyCookiesEnabled
          sharedCookiesEnabled
          setSupportMultipleWindows={false}
          mixedContentMode="always"
          onShouldStartLoadWithRequest={(request) => {
            const url = request?.url || ''
            if (UPI_URL.test(url)) {
              openUpiApp(config?.upiApp || 'upi', url).catch(() => {})
              return false
            }
            return true
          }}
          onMessage={(event) => {
            try {
              finish(JSON.parse(event.nativeEvent.data))
            } catch {
              finish({ ok: false, message: 'Payment could not be completed.' })
            }
          }}
        />
      </SafeAreaView>
    </Modal>
  )
}
