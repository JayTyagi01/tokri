import { useState } from 'react'
import { Modal, Pressable, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { WebView } from 'react-native-webview'
import { useTheme, useThemedStyles } from '../context/ThemeContext'
import { useSystemBottomInset } from '../lib/safeArea'

function digits(value) {
  return String(value || '').replace(/\D/g, '')
}

function cardHtml({ keyId, payment }) {
  const options = JSON.stringify(payment)
  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
  <style>html, body { margin: 0; background: #fff; font-family: sans-serif; color: #0f172a; }</style>
</head>
<body>
  <p style="padding:24px">Connecting to your bank…</p>
  <script src="https://checkout.razorpay.com/v1/razorpay.js"></script>
  <script>
    function send(payload) {
      if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(JSON.stringify(payload));
    }
    if (!window.Razorpay) {
      send({ ok: false, message: 'Card payment could not be started.' });
    } else {
      var rzp = new Razorpay({ key: ${JSON.stringify(keyId)}, redirect: false });
      rzp.on('payment.success', function (response) {
        send({ ok: true, response: response });
      });
      rzp.on('payment.error', function (result) {
        var message = (result && result.error && result.error.description) || 'Card payment failed. Please try again.';
        send({ ok: false, message: message });
      });
      rzp.createPayment(${options});
    }
  </script>
</body>
</html>`
}

export default function CardPaySheet({ formVisible, bank, onClose, onSubmit, onBankResult }) {
  const { colors } = useTheme()
  const styles = useThemedStyles(createStyles)
  const bottomInset = useSystemBottomInset()
  const [number, setNumber] = useState('')
  const [name, setName] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [error, setError] = useState('')

  const closeForm = () => {
    setNumber('')
    setName('')
    setExpiry('')
    setCvv('')
    setError('')
    onClose()
  }

  const submit = () => {
    const cardNumber = digits(number)
    const [monthRaw, yearRaw] = String(expiry).split('/')
    const month = digits(monthRaw)
    const year = digits(yearRaw)
    const code = digits(cvv)
    if (cardNumber.length < 12 || cardNumber.length > 19) {
      setError('Enter the card number.')
      return
    }
    if (!name.trim()) {
      setError('Enter the name on the card.')
      return
    }
    const monthNumber = Number(month)
    if (month.length !== 2 || monthNumber < 1 || monthNumber > 12 || year.length < 2) {
      setError('Enter the expiry as MM/YY.')
      return
    }
    if (code.length < 3) {
      setError('Enter the CVV.')
      return
    }
    setNumber('')
    setCvv('')
    setError('')
    onSubmit({
      number: cardNumber,
      name: name.trim(),
      expiry_month: month,
      expiry_year: year.slice(-2),
      cvv: code,
    })
  }

  return (
    <>
      <Modal visible={formVisible} animationType="slide" transparent onRequestClose={closeForm}>
        <View style={styles.formRoot}>
        <Pressable style={styles.backdrop} onPress={closeForm} />
        <View style={[styles.sheet, { paddingBottom: bottomInset + 20 }]}>
          <Text style={styles.title}>Debit / credit card</Text>
          <TextInput
            value={number}
            onChangeText={setNumber}
            keyboardType="number-pad"
            placeholder="Card number"
            placeholderTextColor={colors.muted}
            style={styles.input}
          />
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Name on card"
            placeholderTextColor={colors.muted}
            autoCapitalize="words"
            style={styles.input}
          />
          <View style={styles.row}>
            <TextInput
              value={expiry}
              onChangeText={setExpiry}
              keyboardType="number-pad"
              placeholder="MM/YY"
              placeholderTextColor={colors.muted}
              style={[styles.input, styles.half]}
            />
            <TextInput
              value={cvv}
              onChangeText={setCvv}
              keyboardType="number-pad"
              placeholder="CVV"
              placeholderTextColor={colors.muted}
              secureTextEntry
              style={[styles.input, styles.half]}
            />
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Pressable style={styles.button} onPress={submit}>
            <Text style={styles.buttonText}>Continue</Text>
          </Pressable>
        </View>
        </View>
      </Modal>
      <Modal visible={Boolean(bank)} animationType="slide" onRequestClose={() => onBankResult({ ok: false, cancelled: true })}>
        <SafeAreaView style={styles.bank}>
          <View style={styles.bankBar}>
            <Text style={styles.title}>Verify with your bank</Text>
            <Pressable onPress={() => onBankResult({ ok: false, cancelled: true })} hitSlop={12}>
              <Text style={styles.close}>Close</Text>
            </Pressable>
          </View>
          {bank ? (
            <WebView
              originWhitelist={['*']}
              source={{ html: cardHtml(bank), baseUrl: 'https://tokriii.com' }}
              javaScriptEnabled
              domStorageEnabled
              thirdPartyCookiesEnabled
              setSupportMultipleWindows={false}
              onMessage={(event) => {
                try {
                  onBankResult(JSON.parse(event.nativeEvent.data))
                } catch {
                  onBankResult({ ok: false, message: 'Card payment could not be completed.' })
                }
              }}
            />
          ) : null}
        </SafeAreaView>
      </Modal>
    </>
  )
}

const createStyles = (c) => ({
  formRoot: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: c.overlay },
  sheet: {
    backgroundColor: c.panel,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  title: { fontSize: 18, fontWeight: '800', color: c.text, marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: c.line,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: c.text,
    marginBottom: 10,
    backgroundColor: c.canvas,
  },
  row: { flexDirection: 'row', gap: 10 },
  half: { flex: 1 },
  error: { color: '#b91c1c', fontWeight: '700', marginBottom: 8 },
  button: {
    backgroundColor: c.brand,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: { color: c.onBrand, fontWeight: '800', fontSize: 16 },
  bank: { flex: 1, backgroundColor: '#fff' },
  bankBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  close: { color: '#047857', fontWeight: '800' },
})
