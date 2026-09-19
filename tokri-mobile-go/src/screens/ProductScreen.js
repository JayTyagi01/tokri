import { useEffect, useRef, useState } from 'react'
import { Alert, Pressable, ScrollView, Text, View } from 'react-native'
import { Image } from 'expo-image'
import LoadingView from '../components/LoadingView'
import ProductCard from '../components/ProductCard'
import { useThemedStyles } from '../context/ThemeContext'
import { fetchJson, formatPrice, normalizeProduct } from '../lib/api'
import { useCart } from '../context/CartContext'

export default function ProductScreen({ route, navigation }) {
  const styles = useThemedStyles(createStyles)
  const { slug } = route.params
  const { addItem, items } = useCart()
  const scrollRef = useRef(null)
  const [product, setProduct] = useState(null)
  const [similar, setSimilar] = useState([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)

  const cartQty = items.find((item) => item.slug === slug)?.quantity || 0
  const categorySlug = product?.categoryId || product?.category?.slug

  useEffect(() => {
    let ignore = false
    setLoading(true)
    setSimilar([])
    scrollRef.current?.scrollTo({ y: 0, animated: false })

    fetchJson(`/products/${slug}`)
      .then(async (data) => {
        const normalized = normalizeProduct(data)
        if (ignore) return
        setProduct(normalized)
        navigation.setOptions({ headerTitle: normalized.name || '' })

        const cat = normalized.categoryId || normalized.category?.slug
        try {
          const path = cat
            ? `/products?category=${encodeURIComponent(cat)}&limit=12`
            : '/products?limit=12'
          const result = await fetchJson(path)
          const list = (Array.isArray(result) ? result : result.products || [])
            .map(normalizeProduct)
            .filter((item) => item.slug && item.slug !== slug)
            .slice(0, 6)
          if (!ignore) setSimilar(list)
        } catch {
          if (!ignore) setSimilar([])
        }
      })
      .catch((error) => Alert.alert('Error', error.message))
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [slug, navigation])

  const handleAdd = async () => {
    setAdding(true)
    try {
      await addItem(slug, 1, product)
      Alert.alert('Added to cart', `${product.name} added to your cart.`)
    } catch (error) {
      Alert.alert('Could not add', error.message)
    } finally {
      setAdding(false)
    }
  }

  if (loading && !product) return <LoadingView />
  if (!product) return null

  return (
    <ScrollView ref={scrollRef} style={styles.container} contentContainerStyle={styles.content}>
      <Image source={{ uri: product.image }} style={styles.image} contentFit="cover" />
      <View style={styles.body}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.weight}>{product.weight}</Text>
        <Text style={styles.price}>{product.price || formatPrice(product.priceValue)}</Text>
        {product.description ? (
          <Text style={styles.description}>{product.description.replace(/<[^>]+>/g, ' ')}</Text>
        ) : null}

        <Pressable style={[styles.button, adding && styles.buttonDisabled]} onPress={handleAdd} disabled={adding}>
          <Text style={styles.buttonText}>
            {adding ? 'Adding…' : cartQty > 0 ? `Add more (${cartQty} in cart)` : 'Add to cart'}
          </Text>
        </Pressable>
      </View>

      {similar.length ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Similar products</Text>
          <View style={styles.grid}>
            {similar.map((item) => (
              <View key={item.slug} style={styles.cardWrap}>
                <ProductCard
                  product={item}
                  compact
                  onPress={(nextSlug) => navigation.navigate('Product', { slug: nextSlug })}
                />
              </View>
            ))}
          </View>
          <Pressable
            style={styles.seeAllBtn}
            onPress={() =>
              navigation.navigate('Main', {
                screen: 'Categories',
                params: categorySlug ? { slug: categorySlug } : undefined,
              })
            }
          >
            <Text style={styles.seeAllText}>See all products</Text>
          </Pressable>
        </View>
      ) : null}
    </ScrollView>
  )
}

const createStyles = (c) => ({
  container: { flex: 1, backgroundColor: c.canvas },
  content: { paddingBottom: 28 },
  image: { width: '100%', aspectRatio: 1, backgroundColor: c.panel2 },
  body: { padding: 20, gap: 8 },
  name: { fontSize: 24, fontWeight: '800', color: c.text },
  weight: { fontSize: 14, color: c.muted },
  price: { fontSize: 22, fontWeight: '800', color: c.brand, marginTop: 4 },
  description: { fontSize: 14, lineHeight: 22, color: c.muted, marginTop: 8 },
  button: {
    marginTop: 20,
    backgroundColor: c.brand,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: {
    color: c.onBrand,
    fontWeight: '800',
    fontSize: 16,
  },
  section: { marginTop: 8 },
  sectionTitle: {
    color: c.text,
    fontSize: 20,
    fontWeight: '800',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 10,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 3 },
  cardWrap: { width: '33.333%', paddingHorizontal: 3, marginBottom: 5 },
  seeAllBtn: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: c.brand,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  seeAllText: { color: c.brand, fontWeight: '800', fontSize: 14 },
})
