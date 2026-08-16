import { useCallback, useEffect, useState } from 'react'
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { Image } from 'expo-image'
import LoadingView from '../components/LoadingView'
import AppHeader from '../components/AppHeader'
import Icon from '../components/Icon'
import { COLORS } from '../config'
import { formatPrice } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function CartScreen({ navigation }) {
  const { isLoggedIn } = useAuth()
  const { items, grandTotal, itemsTotal, deliveryCharge, handlingCharge, smallCartCharge, refreshCart, updateQuantity, loading } = useCart()
  const [ready, setReady] = useState(false)

  const load = useCallback(async () => {
    if (isLoggedIn) await refreshCart()
    setReady(true)
  }, [isLoggedIn, refreshCart])

  useEffect(() => {
    load()
  }, [load])

  const changeQty = async (slug, quantity) => {
    try {
      await updateQuantity(slug, Math.max(0, quantity))
    } catch (error) {
      Alert.alert('Error', error.message)
    }
  }

  return (
    <View style={styles.screen}>
      <AppHeader navigation={navigation} />
      {!ready || loading ? (
        <LoadingView />
      ) : !isLoggedIn ? (
        <View style={styles.center}>
          <Icon name="cart-outline" size={42} color={COLORS.muted} />
          <Text style={styles.empty}>Login to view your cart</Text>
          <Pressable style={styles.button} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>
        </View>
      ) : !items.length ? (
        <View style={styles.center}>
          <Icon name="cart-outline" size={42} color={COLORS.muted} />
          <Text style={styles.empty}>Your cart is empty</Text>
          <Pressable style={styles.button} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.buttonText}>Shop now</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.slug}
            contentContainerStyle={{ padding: 16 }}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Image source={{ uri: item.image }} style={styles.image} contentFit="cover" />
                <View style={styles.info}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.price}>{formatPrice(item.priceValue)}</Text>
                  <View style={styles.qtyRow}>
                    <Pressable style={styles.qtyBtn} onPress={() => changeQty(item.slug, item.quantity - 1)}>
                      <Text style={styles.qtyBtnText}>-</Text>
                    </Pressable>
                    <Text style={styles.qty}>{item.quantity}</Text>
                    <Pressable style={styles.qtyBtn} onPress={() => changeQty(item.slug, item.quantity + 1)}>
                      <Text style={styles.qtyBtnText}>+</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            )}
          />
          <View style={styles.summary}>
            <SummaryRow label="Items" value={formatPrice(itemsTotal)} />
            <SummaryRow label="Delivery" value={formatPrice(deliveryCharge)} />
            <SummaryRow label="Handling" value={formatPrice(handlingCharge)} />
            <SummaryRow label="Small cart" value={formatPrice(smallCartCharge)} />
            <SummaryRow label="Total" value={formatPrice(grandTotal)} bold />
            <Pressable style={styles.button} onPress={() => navigation.navigate('Checkout')}>
              <Text style={styles.buttonText}>Proceed to checkout</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  )
}

function SummaryRow({ label, value, bold }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={[styles.summaryLabel, bold && styles.bold]}>{label}</Text>
      <Text style={[styles.summaryValue, bold && styles.bold]}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.canvas },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  empty: { color: COLORS.muted, marginTop: 12, marginBottom: 16 },
  row: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: COLORS.panel,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  image: { width: 72, height: 72, borderRadius: 12, backgroundColor: COLORS.panel2 },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  price: { color: COLORS.brand, fontWeight: '700', marginTop: 4 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: COLORS.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: { fontSize: 16, fontWeight: '800', color: '#04140c' },
  qty: { fontSize: 16, fontWeight: '800', color: COLORS.text, minWidth: 18, textAlign: 'center' },
  summary: {
    borderTopWidth: 1,
    borderColor: COLORS.line,
    padding: 16,
    backgroundColor: COLORS.panel,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { color: COLORS.muted },
  summaryValue: { color: COLORS.text },
  bold: { fontWeight: '800', color: COLORS.text, fontSize: 16 },
  button: {
    backgroundColor: COLORS.brand,
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 32,
    minWidth: 160,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: { color: '#04140c', fontWeight: '800', fontSize: 16 },
})
