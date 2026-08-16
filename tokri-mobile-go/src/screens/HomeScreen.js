import { useCallback, useEffect, useState } from 'react'
import {
  Dimensions,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { Image } from 'expo-image'
import AppHeader from '../components/AppHeader'
import ProductCard from '../components/ProductCard'
import LoadingView from '../components/LoadingView'
import { COLORS } from '../config'
import { authGet, fetchJson, normalizeProduct } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const SCREEN_WIDTH = Dimensions.get('window').width
const CAT_GAP = 10
const CAT_PAD = 16
const CAT_ITEM_WIDTH = (SCREEN_WIDTH - CAT_PAD - CAT_GAP * 3) / 3.5

function ProductSection({ title, products, onSeeAll, onProduct }) {
  const list = products.slice(0, 6)
  if (!list.length) return null

  return (
    <View style={styles.section}>
      {title ? <Text style={styles.sectionTitle}>{title}</Text> : null}
      <View style={styles.grid}>
        {list.map((product) => (
          <View key={product.slug} style={styles.cardWrap}>
            <ProductCard product={product} onPress={onProduct} compact />
          </View>
        ))}
      </View>
      {onSeeAll ? (
        <Pressable style={styles.seeAllBtn} onPress={onSeeAll}>
          <Text style={styles.seeAllText}>See all products</Text>
        </Pressable>
      ) : null}
    </View>
  )
}

export default function HomeScreen({ navigation }) {
  const { token, isLoggedIn } = useAuth()
  const { setCart } = useCart()
  const [data, setData] = useState({ categories: [], bestSellers: [] })
  const [categoryRows, setCategoryRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const openProduct = (slug) => {
    if (slug === 'login') navigation.navigate('Login')
    else navigation.navigate('Product', { slug })
  }

  const openCategory = (slug) => {
    navigation.navigate('Categories', { slug })
  }

  const load = useCallback(async () => {
    const bootstrap = await fetchJson('/app/bootstrap')

    const categories = bootstrap.categories || []
    const bestSellers = (bootstrap.bestSellers || []).map(normalizeProduct)

    setData({ categories, bestSellers })
    setError('')

    if (isLoggedIn && token) {
      try {
        const cartData = await authGet('/account/cart', token)
        if (cartData.cart) setCart(cartData.cart)
      } catch {
        // Cart API can fail independently; still show the store.
      }
    }

    const rows = await Promise.all(
      categories.map(async (category) => {
        try {
          const result = await fetchJson(
            `/products?category=${encodeURIComponent(category.slug)}&limit=6`,
          )
          const products = (Array.isArray(result) ? result : result.products || []).map(normalizeProduct)
          return { category, products }
        } catch {
          return { category, products: [] }
        }
      }),
    )
    setCategoryRows(rows.filter((row) => row.products.length))
  }, [isLoggedIn, token, setCart])

  useEffect(() => {
    load()
      .catch((err) => setError(err.message || 'Could not load store data.'))
      .finally(() => setLoading(false))
  }, [load])

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
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.brand} />}
      >
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catSlider}
        >
          {data.categories.map((category) => (
            <Pressable
              key={category.slug}
              style={styles.catItem}
              onPress={() => openCategory(category.slug)}
            >
              <Image source={{ uri: category.image }} style={styles.catImage} contentFit="cover" />
              <Text style={styles.catLabel} numberOfLines={2}>
                {category.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <ProductSection
          title="Bestsellers"
          products={data.bestSellers}
          onProduct={openProduct}
        />

        {categoryRows.map((row) => (
          <ProductSection
            key={row.category.slug}
            title={row.category.label}
            products={row.products}
            onProduct={openProduct}
            onSeeAll={() => openCategory(row.category.slug)}
          />
        ))}

        <View style={{ height: 28 }} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.canvas },
  container: { flex: 1 },
  error: { color: COLORS.danger, marginHorizontal: 16, marginTop: 12 },
  catSlider: {
    paddingLeft: CAT_PAD,
    paddingRight: CAT_PAD,
    paddingTop: 16,
    paddingBottom: 8,
  },
  catItem: {
    width: CAT_ITEM_WIDTH,
    marginRight: CAT_GAP,
    alignItems: 'center',
  },
  catImage: {
    width: CAT_ITEM_WIDTH - 8,
    height: CAT_ITEM_WIDTH - 8,
    borderRadius: 14,
    backgroundColor: COLORS.panel2,
  },
  catLabel: {
    marginTop: 6,
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
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
  seeAllBtn: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.brand,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  seeAllText: { color: COLORS.brand, fontWeight: '800', fontSize: 14 },
})
