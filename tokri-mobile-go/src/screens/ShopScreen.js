import { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native'
import { Image } from 'expo-image'
import { useRoute } from '@react-navigation/native'
import ProductCard from '../components/ProductCard'
import LoadingView from '../components/LoadingView'
import AppHeader from '../components/AppHeader'
import { useTheme, useThemedStyles } from '../context/ThemeContext'
import { fetchJson, normalizeProduct } from '../lib/api'

const PAGE_SIZE = 24
const RAIL_WIDTH = 82
const BOX_MARGIN = 10

export default function ShopScreen({ navigation }) {
  const { colors } = useTheme()
  const styles = useThemedStyles(createStyles)
  const route = useRoute()
  const initialSlug = route.params?.slug || ''
  const [categories, setCategories] = useState([])
  const [activeSlug, setActiveSlug] = useState(initialSlug)
  const [products, setProducts] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loadingCats, setLoadingCats] = useState(true)
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const openProduct = (slug) => {
    navigation.navigate('Product', { slug })
  }

  useEffect(() => {
    fetchJson('/categories')
      .then((items) => {
        const list = Array.isArray(items) ? items : []
        setCategories(list)
        setActiveSlug((current) => current || list[0]?.slug || '')
      })
      .catch(() => setCategories([]))
      .finally(() => setLoadingCats(false))
  }, [])

  useEffect(() => {
    if (route.params?.slug) setActiveSlug(route.params.slug)
  }, [route.params?.slug])

  useEffect(() => {
    if (!activeSlug) return
    let ignore = false
    setLoadingProducts(true)
    setProducts([])
    fetchJson(`/products?category=${encodeURIComponent(activeSlug)}&page=1&limit=${PAGE_SIZE}`)
      .then((data) => {
        if (ignore) return
        const list = (data.products || []).map(normalizeProduct)
        setProducts(list)
        setHasMore(Boolean(data.hasMore))
        setPage(1)
      })
      .catch(() => {
        if (!ignore) setProducts([])
      })
      .finally(() => {
        if (!ignore) setLoadingProducts(false)
      })
    return () => {
      ignore = true
    }
  }, [activeSlug])

  const loadMore = () => {
    if (!hasMore || loadingMore || loadingProducts || !activeSlug) return
    setLoadingMore(true)
    const next = page + 1
    fetchJson(`/products?category=${encodeURIComponent(activeSlug)}&page=${next}&limit=${PAGE_SIZE}`)
      .then((data) => {
        const list = (data.products || []).map(normalizeProduct)
        setProducts((prev) => [...prev, ...list])
        setHasMore(Boolean(data.hasMore))
        setPage(next)
      })
      .catch(() => setHasMore(false))
      .finally(() => setLoadingMore(false))
  }

  if (loadingCats) return <LoadingView />

  return (
    <View style={styles.screen}>
      <AppHeader navigation={navigation} />
      <View style={styles.box}>
        <View style={styles.rail}>
          <FlatList
            data={categories}
            keyExtractor={(item) => item.slug}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const active = item.slug === activeSlug
              return (
                <Pressable style={[styles.railItem, active && styles.railActive]} onPress={() => setActiveSlug(item.slug)}>
                  {active ? <View style={styles.railBar} /> : null}
                  <View style={[styles.railImageWrap, active && styles.railImageActive]}>
                    <Image source={{ uri: item.image }} style={styles.railImage} contentFit="cover" />
                  </View>
                  <Text style={[styles.railLabel, active && styles.railLabelActive]} numberOfLines={2}>
                    {item.label}
                  </Text>
                </Pressable>
              )
            }}
          />
        </View>

        <View style={styles.products}>
          {loadingProducts ? (
            <View style={styles.center}>
              <ActivityIndicator color={colors.brand} />
            </View>
          ) : (
            <FlatList
              data={products}
              numColumns={2}
              keyExtractor={(item) => item.slug}
              contentContainerStyle={styles.productList}
              columnWrapperStyle={styles.productRow}
              onEndReached={loadMore}
              onEndReachedThreshold={0.4}
              ListEmptyComponent={<Text style={styles.empty}>No products yet in this category.</Text>}
              ListFooterComponent={loadingMore ? <ActivityIndicator color={colors.brand} style={{ margin: 12 }} /> : null}
              renderItem={({ item }) => (
                <View style={styles.cardWrap}>
                  <ProductCard product={item} onPress={openProduct} compact />
                </View>
              )}
            />
          )}
        </View>
      </View>
    </View>
  )
}

const createStyles = (c) => ({
  screen: { flex: 1, backgroundColor: c.canvas },
  box: {
    flex: 1,
    flexDirection: 'row',
    margin: BOX_MARGIN,
    borderWidth: 1,
    borderColor: c.line,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: c.panel,
  },
  rail: {
    width: RAIL_WIDTH,
    borderRightWidth: 1,
    borderRightColor: c.line,
    backgroundColor: c.panel,
  },
  railItem: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  railActive: { backgroundColor: c.panel2 },
  railBar: {
    position: 'absolute',
    right: 0,
    top: 10,
    bottom: 10,
    width: 3,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    backgroundColor: c.brand,
  },
  railImageWrap: {
    width: 42,
    height: 42,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: c.white,
    borderWidth: 1,
    borderColor: c.line,
  },
  railImageActive: { borderColor: c.brand },
  railImage: { width: '100%', height: '100%' },
  railLabel: {
    marginTop: 4,
    fontSize: 9,
    color: c.muted,
    textAlign: 'center',
    fontWeight: '600',
  },
  railLabelActive: { color: c.mint, fontWeight: '800' },
  products: { flex: 1, backgroundColor: c.canvas },
  productList: { paddingHorizontal: 3, paddingTop: 5, paddingBottom: 24 },
  productRow: { marginBottom: 5 },
  cardWrap: { flex: 1, paddingHorizontal: 3 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty: { color: c.muted, textAlign: 'center', marginTop: 40, paddingHorizontal: 16 },
})
