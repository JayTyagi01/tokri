import { useEffect, useRef, useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import LoadingView from '../components/LoadingView'
import CouponBox from '../components/CouponBox'
import RazorpayCheckout from '../components/RazorpayCheckout'
import { useTheme, useThemedStyles } from '../context/ThemeContext'
import { authPost, fetchJson, formatPrice } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useAddress } from '../context/AddressContext'

export default function CheckoutScreen({ navigation }) {
  const { colors } = useTheme()
  const styles = useThemedStyles(createStyles)
  const insets = useSafeAreaInsets()
  const { token } = useAuth()
  const { grandTotal, items, discount, coupon, refreshCart, clearCart } = useCart()
  const { addresses, selectedId, selectAddress, openPicker, refresh } = useAddress()
  const [razorpayEnabled, setRazorpayEnabled] = useState(false)
  const [codEnabled, setCodEnabled] = useState(true)
  const [paymentMode, setPaymentMode] = useState('online')
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [notice, setNotice] = useState('')
  const [razorpayConfig, setRazorpayConfig] = useState(null)
  const paymentWait = useRef(null)

  useEffect(() => {
    Promise.all([fetchJson('/checkout/config'), refresh()])
      .then(([config]) => {
        setRazorpayEnabled(Boolean(config?.razorpay?.enabled))
        const allowCod = config?.codEnabled !== false
        setCodEnabled(allowCod)
        if (config?.razorpay?.enabled) setPaymentMode('online')
        else if (allowCod) setPaymentMode('cod')
      })
      .catch((error) => setNotice(error.message))
      .finally(() => setLoading(false))
  }, [token, refresh])

  const openRazorpay = (config) => new Promise((resolve, reject) => {
    paymentWait.current = { resolve, reject }
    setRazorpayConfig(config)
  })

  const finishRazorpay = (result) => {
    const wait = paymentWait.current
    paymentWait.current = null
    setRazorpayConfig(null)
    if (!wait) return
    if (result?.ok && result.response) {
      wait.resolve(result.response)
      return
    }
    if (result?.cancelled) {
      wait.reject(new Error('Payment cancelled.'))
      return
    }
    wait.reject(new Error(result?.message || 'Payment failed. Please try again.'))
  }

  const selectedAddress = addresses.find((item) => item.id === selectedId) || null

  const placeOrder = async () => {
    if (!selectedAddress) {
      setNotice('Please add a delivery address first.')
      return
    }
    if (selectedAddress.serviceable === false) {
      setNotice("We don't deliver to this pincode yet.")
      return
    }
    setNotice('')
    setPaying(true)
    try {
      const checkout = await authPost('/checkout/create-order', token, {
        addressId: selectedId,
        paymentMode,
        items: items.map((item) => ({ slug: item.slug, quantity: item.quantity })),
        couponCode: coupon?.code || undefined,
      })

      if (checkout.razorpay) {
        const payment = await openRazorpay(checkout.razorpay)
        await authPost('/checkout/verify-payment', token, {
          orderNo: checkout.order.orderNo,
          razorpayOrderId: payment.razorpay_order_id,
          razorpayPaymentId: payment.razorpay_payment_id,
          razorpaySignature: payment.razorpay_signature,
        })
      } else {
        await authPost('/checkout/confirm-cod', token, { orderNo: checkout.order.orderNo })
      }

      await clearCart()
      await refreshCart()
      navigation.navigate('Orders')
    } catch (error) {
      setNotice(error.message || 'Could not complete checkout.')
    } finally {
      setPaying(false)
    }
  }

  if (loading) return <LoadingView />

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingBottom: 16 + insets.bottom }}>
      <Text style={styles.title}>Delivery address</Text>
      {addresses.length ? (
        addresses.map((address) => (
          <Pressable
            key={address.id}
            style={[styles.addressCard, selectedId === address.id && styles.addressSelected]}
            onPress={() => {
              if (address.serviceable === false) {
                setNotice("We don't deliver to this pincode yet.")
                return
              }
              setNotice('')
              selectAddress(address.id)
            }}
          >
            <Text style={styles.addressLabel}>{address.label}</Text>
            <Text style={styles.addressText}>{address.formatted}</Text>
            {address.serviceable === false ? (
              <Text style={styles.unavailable}>We don't deliver to this pincode yet.</Text>
            ) : null}
          </Pressable>
        ))
      ) : (
        <Text style={styles.empty}>No saved address yet.</Text>
      )}
      <Pressable style={styles.addLink} onPress={openPicker}>
        <Text style={styles.addLinkText}>+ Add new address</Text>
      </Pressable>

      <View style={styles.summary}>
        <CouponBox />
        <Text style={styles.title}>Order total</Text>
        {Number(discount) > 0 ? (
          <Text style={styles.note}>Coupon {coupon?.code} saved {formatPrice(discount)}</Text>
        ) : null}
        <Text style={styles.total}>{formatPrice(grandTotal)}</Text>
        {notice ? <Text style={styles.error}>{notice}</Text> : null}
        {razorpayEnabled ? (
          <Pressable
            style={[styles.payOption, paymentMode === 'online' && styles.payOptionOn]}
            onPress={() => setPaymentMode('online')}
          >
            <Text style={styles.payOptionText}>Pay online</Text>
          </Pressable>
        ) : null}
        {codEnabled ? (
          <Pressable
            style={[styles.payOption, paymentMode === 'cod' && styles.payOptionOn]}
            onPress={() => setPaymentMode('cod')}
          >
            <Text style={styles.payOptionText}>Cash on delivery</Text>
          </Pressable>
        ) : null}
      </View>

      <Pressable style={[styles.button, paying && styles.buttonDisabled]} onPress={placeOrder} disabled={paying}>
        <Text style={styles.buttonText}>
          {paying ? 'Placing order…' : paymentMode === 'online' ? `Pay ${formatPrice(grandTotal)}` : 'Place order'}
        </Text>
      </Pressable>
      <RazorpayCheckout config={razorpayConfig} onResult={finishRazorpay} />
    </ScrollView>
  )
}

const createStyles = (c) => ({
  container: { flex: 1, backgroundColor: c.canvas },
  title: { fontSize: 18, fontWeight: '700', color: c.text, marginBottom: 12 },
  addressCard: {
    backgroundColor: c.panel,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: c.line,
  },
  addressSelected: { borderColor: c.brand, borderWidth: 2 },
  addressLabel: { fontWeight: '700', color: c.text, marginBottom: 4 },
  addressText: { color: c.mint, lineHeight: 20 },
  unavailable: { color: '#b91c1c', marginTop: 6, fontWeight: '700' },
  empty: { color: c.muted, marginBottom: 8 },
  addLink: { marginBottom: 12, paddingVertical: 8 },
  addLinkText: { color: c.brand, fontWeight: '800' },
  summary: {
    marginTop: 20,
    backgroundColor: c.panel,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: c.line,
  },
  total: { fontSize: 24, fontWeight: '800', color: c.brand, marginTop: 4 },
  note: { color: c.muted, marginTop: 8 },
  error: { color: '#b91c1c', marginTop: 10, fontWeight: '700' },
  payOption: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: c.line,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  payOptionOn: { borderColor: c.brand, borderWidth: 2 },
  payOptionText: { color: c.text, fontWeight: '700' },
  button: {
    marginTop: 20,
    backgroundColor: c.brand,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: c.onBrand, fontWeight: '800', fontSize: 16 },
})
