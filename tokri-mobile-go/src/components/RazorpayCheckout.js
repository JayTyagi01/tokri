import { useEffect, useRef } from 'react'
import { Modal, Pressable, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { WebView } from 'react-native-webview'

function checkoutHtml(config) {
  const options = JSON.stringify({
    key: config.keyId,
    amount: config.amount,
    currency: config.currency || 'INR',
    name: config.name || 'Tokriii',
    description: config.description || 'Tokriii order',
    order_id: config.orderId,
    prefill: config.prefill || {},
    theme: { color: '#047857' },
  })

  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
  <style>html, body { margin: 0; height: 100%; background: #f8fafc; }</style>
</head>
<body>
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
<script>
  var options = ${options};
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

  return (
    <Modal visible animationType="slide" onRequestClose={() => finish({ ok: false, cancelled: true })}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#0f172a' }}>Pay online</Text>
          <Pressable onPress={() => finish({ ok: false, cancelled: true })} hitSlop={12}>
            <Text style={{ color: '#047857', fontWeight: '800' }}>Close</Text>
          </Pressable>
        </View>
        <WebView
          originWhitelist={['*']}
          source={{ html: checkoutHtml(config), baseUrl: 'https://checkout.razorpay.com' }}
          javaScriptEnabled
          domStorageEnabled
          thirdPartyCookiesEnabled
          setSupportMultipleWindows={false}
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
