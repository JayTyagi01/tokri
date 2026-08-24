import { useEffect, useState } from 'react'
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import LoadingView from '../components/LoadingView'
import CouponBox from '../components/CouponBox'
import { useTheme, useThemedStyles } from '../context/ThemeContext'
import { authPost, fetchJson, formatPrice } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useAddress } from '../context/AddressContext'

export default function CheckoutScreen({ navigation }) {
  const { colors } = useTheme()
  const styles = useThemedStyles(createStyles)
  const { token } = useAuth()
  const { grandTotal, items, discount, coupon, refreshCart, clearCart } = useCart()
  const { addresses, selectedId, selectAddress, openPicker, refresh } = useAddress()
  const [razorpayEnabled, setRazorpayEnabled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    Promise.all([fetchJson('/checkout/config'), refresh()])
      .then(([config]) => {
        setRazorpayEnabled(Boolean(config?.razorpay?.enabled))
      })
      .catch((error) => Alert.alert('Error', error.message))
      .finally(() => setLoading(false))
  }, [token, refresh])

  const placeOrder = async () => {
    if (!selectedId) {
      Alert.alert('Select address', 'Please add a delivery address first.')
      return
    }
    setPaying(true)
    try {
      const paymentMode = razorpayEnabled ? 'online' : 'cod'
      const checkout = await authPost('/checkout/create-order', token, {
        addressId: selectedId,
        paymentMode,
        items: items.map((item) => ({ slug: item.slug, quantity: item.quantity })),
        couponCode: coupon?.code || undefined,
      })

      if (checkout.razorpay) {
        Alert.alert(
          'Online payment',
          'Razorpay in-app payment will be added in the next build. For now, disable Razorpay in admin to use Cash on Delivery, or order on the website.',
        )
        return
      }

      await authPost('/checkout/confirm-cod', token, { orderNo: checkout.order.orderNo })
      await clearCart()
      await refreshCart()
      Alert.alert('Order placed', `Order ${checkout.order.orderNo} placed successfully.`, [
        { text: 'View orders', onPress: () => navigation.navigate('Orders') },
      ])
    } catch (error) {
      Alert.alert('Checkout failed', error.message)
    } finally {
      setPaying(false)
    }
  }

  if (loading) return <LoadingView />

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>Delivery address</Text>
      {addresses.length ? (
        addresses.map((address) => (
          <Pressable
            key={address.id}
            style={[styles.addressCard, selectedId === address.id && styles.addressSelected]}
            onPress={() => selectAddress(address.id)}
          >
            <Text style={styles.addressLabel}>{address.label}</Text>
            <Text style={styles.addressText}>{address.formatted}</Text>
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
        <Text style={styles.note}>
          {razorpayEnabled ? 'Online payment coming soon in app.' : 'Pay cash on delivery.'}
        </Text>
      </View>

      <Pressable style={[styles.button, paying && styles.buttonDisabled]} onPress={placeOrder} disabled={paying}>
        <Text style={styles.buttonText}>{paying ? 'Placing order…' : 'Place order'}</Text>
      </Pressable>
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
  button: {
    marginTop: 20,
    backgroundColor: c.brand,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#04140c', fontWeight: '800', fontSize: 16 },
})
