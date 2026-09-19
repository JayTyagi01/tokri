import { useEffect, useMemo, useState } from 'react'
import { Alert, Pressable, ScrollView, Text, View } from 'react-native'
import { Image } from 'expo-image'
import LoadingView from '../components/LoadingView'
import AppHeader from '../components/AppHeader'
import Icon from '../components/Icon'
import CouponBox from '../components/CouponBox'
import ProductCard from '../components/ProductCard'
import { useTheme, useThemedStyles } from '../context/ThemeContext'
import { fetchJson, formatPrice, normalizeProduct } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

function moneyValue(value) {
  if (value == null || value === '') return 0
  const amount = typeof value === 'number' ? value : Number(String(value).replace(/[^\d.]/g, ''))
  return Number.isFinite(amount) ? amount : 0
}

function cutoffPrice(item) {
  const price = moneyValue(item.priceValue)
  const oldPrice = moneyValue(item.oldPriceValue) || moneyValue(item.oldPrice)
  return oldPrice > price ? oldPrice : 0
}

export default function CartScreen({ navigation }) {
  const { colors } = useTheme()
  const styles = useThemedStyles(createStyles)
  const { isLoggedIn } = useAuth()
  const { items, grandTotal, itemsTotal, deliveryCharge, handlingCharge, discount, hydrated, updateQuantity } = useCart()
  const [suggested, setSuggested] = useState([])

  const itemSavings = useMemo(
    () =>
      items.reduce((sum, item) => {
        const oldPrice = cutoffPrice(item)
        if (!oldPrice) return sum
        return sum + (oldPrice - moneyValue(item.priceValue)) * (Number(item.quantity) || 0)
      }, 0),
    [items],
  )
  const couponSavings = Number(discount) || 0
  const totalSavings = Math.round((itemSavings + couponSavings) * 100) / 100
  const itemsOriginal = itemsTotal + itemSavings

  const changeQty = async (slug, quantity) => {
    try {
      await updateQuantity(slug, Math.max(0, quantity))
    } catch (error) {
      Alert.alert('Error', error.message)
    }
  }

  const onCheckout = () => {
    if (!isLoggedIn) {
      navigation.navigate('Login', { next: 'Checkout' })
      return
    }
    navigation.navigate('Checkout')
  }

  useEffect(() => {
    if (!items.length) {
      setSuggested([])
      return undefined
    }
    let ignore = false
    const inCart = new Set(items.map((item) => item.slug))
    fetchJson('/app/bootstrap')
      .then((data) => {
        if (ignore) return
        const list = (data.bestSellers || [])
          .map(normalizeProduct)
          .filter((product) => product.slug && !inCart.has(product.slug))
          .slice(0, 10)
        setSuggested(list)
      })
      .catch(() => {
        if (!ignore) setSuggested([])
      })
    return () => {
      ignore = true
    }
  }, [items])

  return (
    <View style={styles.screen}>
      <AppHeader navigation={navigation} />
      {!hydrated ? (
        <LoadingView />
      ) : !items.length ? (
        <View style={styles.center}>
          <Icon name="cart-outline" size={42} color={colors.muted} />
          <Text style={styles.empty}>Your cart is empty</Text>
          <Pressable style={styles.button} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.buttonText}>Shop now</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <ScrollView
            style={styles.scroller}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {items.map((item) => (
              <View key={item.slug} style={styles.row}>
                <Image source={{ uri: item.image }} style={styles.image} contentFit="cover" />
                <View style={styles.info}>
                  <Text style={styles.name}>{item.name}</Text>
                  {item.weight ? <Text style={styles.weight}>{item.weight}</Text> : null}
                  <View style={styles.priceRow}>
                    <Text style={styles.price}>{formatPrice(item.priceValue)}</Text>
                    {cutoffPrice(item) ? <Text style={styles.cutPrice}>{formatPrice(cutoffPrice(item))}</Text> : null}
                  </View>
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
            ))}

            {suggested.length ? (
              <View style={styles.likeSection}>
                <Text style={styles.likeTitle}>You may also like</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.likeRow}
                >
                  {suggested.map((product) => (
                    <View key={product.slug} style={styles.likeCard}>
                      <ProductCard
                        product={product}
                        compact
                        onPress={(slug) => navigation.navigate('Product', { slug })}
                      />
                    </View>
                  ))}
                </ScrollView>
              </View>
            ) : null}

            <CouponBox />

            <View style={styles.billCard}>
              <Text style={styles.billTitle}>Bill details</Text>
              <BillRow
                icon="receipt-outline"
                label="Items total"
                value={formatPrice(itemsTotal)}
                oldValue={itemSavings > 0 ? formatPrice(itemsOriginal) : null}
                badge={itemSavings > 0 ? `Saved ${formatPrice(itemSavings)}` : null}
              />
              <BillRow
                icon="bag-handle-outline"
                label="Cart handling"
                value={formatPrice(handlingCharge)}
              />
              <BillRow
                icon="bicycle-outline"
                label="Delivery charges"
                value={deliveryCharge > 0 ? formatPrice(deliveryCharge) : 'FREE'}
                free={!deliveryCharge}
              />
              {couponSavings > 0 ? (
                <BillRow icon="pricetag-outline" label="Coupon" value={`-${formatPrice(couponSavings)}`} free />
              ) : null}

              <View style={styles.grandRow}>
                <Text style={styles.grandLabel}>Grand total</Text>
                <Text style={styles.grandValue}>{formatPrice(grandTotal)}</Text>
              </View>

              {totalSavings > 0 ? (
                <View style={styles.savingsWrap}>
                  <Zigzag color={colors.savingsBg} />
                  <View style={styles.savingsBar}>
                    <Text style={styles.savingsLabel}>Your total savings</Text>
                    <Text style={styles.savingsValue}>{formatPrice(totalSavings)}</Text>
                  </View>
                </View>
              ) : null}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Pressable style={styles.button} onPress={onCheckout}>
              <Text style={styles.buttonText}>{isLoggedIn ? 'Proceed to checkout' : 'Login to proceed'}</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  )
}

function BillRow({ icon, label, value, oldValue, badge, free }) {
  const { colors } = useTheme()
  const styles = useThemedStyles(createStyles)
  return (
    <View style={styles.billRow}>
      <View style={styles.billLeft}>
        <View style={styles.billLabelRow}>
          {icon ? <Icon name={icon} size={16} color={colors.mint} /> : null}
          <Text style={styles.billLabel}>{label}</Text>
          {badge ? (
            <View style={styles.savedBadge}>
              <Text style={styles.savedBadgeText}>{badge}</Text>
            </View>
          ) : null}
        </View>
      </View>
      <View style={styles.billRight}>
        {oldValue ? <Text style={styles.oldValue}>{oldValue}</Text> : null}
        <Text style={[styles.billValue, free && styles.freeValue]}>{value}</Text>
      </View>
    </View>
  )
}

function Zigzag({ color }) {
  return (
    <View style={{ flexDirection: 'row', height: 8, overflow: 'hidden' }}>
      {Array.from({ length: 28 }).map((_, index) => (
        <View
          key={index}
          style={{
            width: 0,
            height: 0,
            marginLeft: index ? -2 : 0,
            borderStyle: 'solid',
            borderLeftWidth: 7,
            borderRightWidth: 7,
            borderBottomWidth: 8,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: color,
          }}
        />
      ))}
    </View>
  )
}

const createStyles = (c) => ({
  screen: { flex: 1, backgroundColor: c.canvas },
  scroller: { flex: 1 },
  content: { padding: 16, paddingBottom: 8, gap: 12 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  empty: { color: c.muted, marginTop: 12, marginBottom: 16 },
  row: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: c.panel,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: c.line,
  },
  image: { width: 72, height: 72, borderRadius: 12, backgroundColor: c.panel2 },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '700', color: c.text },
  weight: { color: c.muted, fontSize: 12, marginTop: 2 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' },
  price: { color: c.text, fontWeight: '800', fontSize: 15 },
  cutPrice: { color: c.muted, textDecorationLine: 'line-through', fontSize: 13, fontWeight: '600' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: c.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: { fontSize: 16, fontWeight: '800', color: c.onBrand },
  qty: { fontSize: 16, fontWeight: '800', color: c.text, minWidth: 18, textAlign: 'center' },
  likeSection: { marginTop: 4, marginBottom: 4 },
  likeTitle: { color: c.text, fontSize: 18, fontWeight: '800', marginBottom: 10 },
  likeRow: { paddingRight: 8 },
  likeCard: { width: 148, marginRight: 8 },
  billCard: {
    backgroundColor: c.panel,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: c.line,
    paddingTop: 16,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  billTitle: { color: c.text, fontSize: 16, fontWeight: '800', marginBottom: 8 },
  billRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  billLeft: { flex: 1, minWidth: 0, paddingRight: 10 },
  billLabelRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 },
  billLabel: { color: c.muted, fontSize: 14 },
  billRight: { flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 0 },
  billValue: { color: c.text, fontWeight: '700' },
  oldValue: { color: c.muted, textDecorationLine: 'line-through', fontSize: 13, fontWeight: '600' },
  freeValue: { color: c.savingsText, fontWeight: '800' },
  savedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: c.savingsBg,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  savedBadgeText: { color: c.savingsText, fontSize: 10, fontWeight: '800' },
  grandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: c.line,
    paddingTop: 12,
    paddingBottom: 14,
    marginTop: 4,
  },
  grandLabel: { color: c.text, fontSize: 16, fontWeight: '800' },
  grandValue: { color: c.text, fontSize: 16, fontWeight: '800' },
  savingsWrap: { marginHorizontal: -16 },
  savingsBar: {
    backgroundColor: c.savingsBg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  savingsLabel: { color: c.savingsText, fontWeight: '700' },
  savingsValue: { color: c.savingsText, fontWeight: '800' },
  footer: {
    borderTopWidth: 1,
    borderColor: c.line,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: c.panel,
  },
  button: {
    backgroundColor: c.brand,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
    minWidth: 160,
    alignItems: 'center',
  },
  buttonText: { color: c.onBrand, fontWeight: '800', fontSize: 16 },
})
