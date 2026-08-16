import { Image } from 'expo-image'
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import { COLORS } from '../config'
import { formatPrice } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

function discountPercent(product) {
  const price = Number(product.priceValue)
  const oldPrice = Number(product.oldPriceValue)
  if (!oldPrice || !price || oldPrice <= price) return 0
  return Math.round((1 - price / oldPrice) * 100)
}

export default function ProductCard({ product, onPress, compact = false }) {
  const { isLoggedIn } = useAuth()
  const { addItem, updateQuantity, items } = useCart()
  const qty = items.find((item) => item.slug === product.slug)?.quantity || 0
  const off = discountPercent(product)

  const onAdd = async (event) => {
    event?.stopPropagation?.()
    if (!isLoggedIn) {
      onPress?.('login')
      return
    }
    try {
      if (qty) await updateQuantity(product.slug, qty + 1)
      else await addItem(product.slug, 1, product)
    } catch (error) {
      Alert.alert('Cart', error.message)
    }
  }

  const onMinus = async (event) => {
    event?.stopPropagation?.()
    if (!qty) return
    try {
      await updateQuantity(product.slug, qty - 1)
    } catch (error) {
      Alert.alert('Cart', error.message)
    }
  }

  return (
    <Pressable style={[styles.card, compact && styles.compact]} onPress={() => onPress?.(product.slug)}>
      <View style={styles.imageWrap}>
        {off > 0 ? <Text style={styles.off}>{off}% OFF</Text> : null}
        <Image source={{ uri: product.image }} style={styles.image} contentFit="cover" />
      </View>
      <Text style={[styles.name, compact && styles.nameCompact]} numberOfLines={2}>
        {product.name}
      </Text>
      {product.weight ? <Text style={styles.weight}>{product.weight}</Text> : null}
      <View style={styles.footer}>
        <View style={{ flex: 1, paddingRight: 4 }}>
          <Text style={[styles.price, compact && styles.priceCompact]}>
            {product.price || formatPrice(product.priceValue)}
          </Text>
          {off > 0 && product.oldPrice ? <Text style={styles.old}>{product.oldPrice}</Text> : null}
        </View>
        {qty > 0 ? (
          <View style={[styles.qtyBox, compact && styles.qtyBoxCompact]}>
            <Pressable onPress={onMinus} hitSlop={6}>
              <Text style={styles.qtyBtn}>-</Text>
            </Pressable>
            <Text style={styles.qty}>{qty}</Text>
            <Pressable onPress={onAdd} hitSlop={6}>
              <Text style={styles.qtyBtn}>+</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable style={[styles.add, compact && styles.addCompact]} onPress={onAdd}>
            <Text style={[styles.addText, compact && styles.addTextCompact]}>ADD</Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 8,
    margin: 5,
  },
  compact: { margin: 3, padding: 6 },
  nameCompact: { fontSize: 11, minHeight: 28, lineHeight: 14 },
  priceCompact: { fontSize: 12 },
  addCompact: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  addTextCompact: { fontSize: 10 },
  qtyBoxCompact: { paddingHorizontal: 4, paddingVertical: 3, gap: 4 },
  imageWrap: {
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f8fafc',
    marginBottom: 6,
  },
  image: { width: '100%', height: '100%' },
  off: {
    position: 'absolute',
    left: 0,
    top: 6,
    zIndex: 2,
    backgroundColor: '#2563eb',
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    overflow: 'hidden',
  },
  name: { fontSize: 12, fontWeight: '700', color: COLORS.cardText, minHeight: 32, lineHeight: 16 },
  weight: { fontSize: 11, color: COLORS.cardMuted, marginTop: 2 },
  footer: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  price: { fontSize: 13, fontWeight: '800', color: COLORS.cardText },
  old: { fontSize: 11, color: COLORS.cardMuted, textDecorationLine: 'line-through' },
  add: {
    borderWidth: 1,
    borderColor: COLORS.brand,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: '#edf8f1',
  },
  addText: { color: COLORS.brandDeep, fontWeight: '800', fontSize: 12 },
  qtyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.brand,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 4,
    gap: 8,
  },
  qtyBtn: { color: '#fff', fontWeight: '800', fontSize: 16, width: 16, textAlign: 'center' },
  qty: { color: '#fff', fontWeight: '800', minWidth: 14, textAlign: 'center' },
})
