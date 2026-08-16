import { useEffect, useState } from 'react'
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Image } from 'expo-image'
import LoadingView from '../components/LoadingView'
import { COLORS } from '../config'
import { fetchJson, formatPrice, normalizeProduct } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function ProductScreen({ route, navigation }) {
  const { slug } = route.params
  const { isLoggedIn } = useAuth()
  const { addItem, items } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)

  const cartQty = items.find((item) => item.slug === slug)?.quantity || 0

  useEffect(() => {
    fetchJson(`/products/${slug}`)
      .then((data) => setProduct(normalizeProduct(data)))
      .catch((error) => Alert.alert('Error', error.message))
      .finally(() => setLoading(false))
  }, [slug])

  const handleAdd = async () => {
    if (!isLoggedIn) {
      navigation.navigate('Login')
      return
    }
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

  if (loading) return <LoadingView />
  if (!product) return null

  return (
    <ScrollView style={styles.container}>
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
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.canvas },
  image: { width: '100%', aspectRatio: 1, backgroundColor: COLORS.panel2 },
  body: { padding: 20, gap: 8 },
  name: { fontSize: 24, fontWeight: '800', color: COLORS.text },
  weight: { fontSize: 14, color: COLORS.muted },
  price: { fontSize: 22, fontWeight: '800', color: COLORS.brand, marginTop: 4 },
  description: { fontSize: 14, lineHeight: 22, color: COLORS.muted, marginTop: 8 },
  button: {
    marginTop: 20,
    backgroundColor: COLORS.brand,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#04140c', fontWeight: '800', fontSize: 16 },
})
