import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Image as RNImage,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import AppHeader from '../components/AppHeader'
import ProductCard from '../components/ProductCard'
import LoadingView from '../components/LoadingView'
import { COLORS } from '../config'
import { authGet, fetchJson, normalizeProduct } from '../lib/api'
import { uniqueOrderedProducts } from '../lib/orders'
import { useAuth } from '../context/AuthContext'

const HERO = require('../../assets/reorder-hero.png')

function ProductGrid({ title, products, onProduct }) {
  const list = products.filter((item) => item.slug).slice(0, 12)
  if (!list.length) return null
  return (
    <View style={styles.section}>
      {title ? <Text style={styles.sectionTitle}>{title}</Text> : null}
      <View style={styles.grid}>
        {list.map((product) => (
          <View key={product.slug} style={styles.cardWrap}>
            <ProductCard product={normalizeProduct(product)} onPress={onProduct} compact />
          </View>
        ))}
      </View>
    </View>
  )
}

export default function ReorderScreen({ navigation }) {
  const { token, isLoggedIn } = useAuth()
  const [orders, setOrders] = useState([])
  const [bestSellers, setBestSellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const openProduct = (slug) => {
    if (slug === 'login') navigation.navigate('Login')
    else navigation.navigate('Product', { slug })
  }

  const load = useCallback(async () => {
    const bootstrap = await fetchJson('/app/bootstrap')
    setBestSellers((bootstrap.bestSellers || []).map(normalizeProduct))

    if (!isLoggedIn || !token) {
      setOrders([])
      return
    }
    try {
      const data = await authGet('/account/orders?perPage=20', token)
      setOrders(data.orders || [])
    } catch {
      setOrders([])
    }
  }, [isLoggedIn, token])

  useEffect(() => {
    load()
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [load])

  const previousItems = useMemo(() => uniqueOrderedProducts(orders), [orders])
  const previousSlugs = useMemo(() => new Set(previousItems.map((item) => item.slug)), [previousItems])
  const extraBestsellers = useMemo(
    () => bestSellers.filter((item) => item.slug && !previousSlugs.has(item.slug)),
    [bestSellers, previousSlugs],
  )

  const onRefresh = async () => {
    setRefreshing(true)
    try {
      await load()
    } finally {
      setRefreshing(false)
    }
  }

  if (loading) return <LoadingView />

  return (
    <View style={styles.screen}>
      <AppHeader navigation={navigation} />
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.brand} />}
        contentContainerStyle={styles.content}
      >
        <View style={styles.hero}>
          <RNImage source={HERO} style={styles.heroImage} resizeMode="contain" />
          <Text style={styles.heroTitle}>Reordering will be easy</Text>
          <Text style={styles.heroSubtitle}>
            Items you order will show up here so you can buy them again easily
          </Text>
          {!isLoggedIn ? (
            <Pressable style={styles.loginBtn} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginText}>Login to see your items</Text>
            </Pressable>
          ) : null}
        </View>

        <ProductGrid title="Buy again" products={previousItems} onProduct={openProduct} />
        <ProductGrid title="Bestsellers" products={extraBestsellers} onProduct={openProduct} />
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.canvas },
  content: { paddingBottom: 16 },
  hero: { alignItems: 'center', paddingHorizontal: 28, paddingTop: 18, paddingBottom: 8 },
  heroImage: { width: 168, height: 168, marginBottom: 12 },
  heroTitle: { color: COLORS.text, fontSize: 22, fontWeight: '800', textAlign: 'center' },
  heroSubtitle: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 8,
  },
  loginBtn: {
    marginTop: 16,
    borderWidth: 1.5,
    borderColor: COLORS.brand,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  loginText: { color: COLORS.brand, fontWeight: '800' },
  section: { marginTop: 8 },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '800',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 10,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8 },
  cardWrap: { width: '33.333%' },
})
