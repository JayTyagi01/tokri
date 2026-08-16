import { useEffect, useState } from 'react'
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native'
import ProductCard from '../components/ProductCard'
import LoadingView from '../components/LoadingView'
import { COLORS } from '../config'
import { fetchJson, normalizeProduct } from '../lib/api'

export default function CategoryScreen({ route, navigation }) {
  const { slug, label } = route.params
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    navigation.setOptions({ title: label || 'Category' })
    fetchJson(`/categories/${slug}`)
      .then((data) => setProducts((data.products || []).map(normalizeProduct)))
      .catch((error) => Alert.alert('Error', error.message))
      .finally(() => setLoading(false))
  }, [slug, label, navigation])

  if (loading) return <LoadingView />

  return (
    <FlatList
      style={styles.container}
      data={products}
      numColumns={2}
      keyExtractor={(item) => item.slug}
      contentContainerStyle={styles.list}
      ListEmptyComponent={<Text style={styles.empty}>No products in this category.</Text>}
      renderItem={({ item }) => (
        <ProductCard product={item} onPress={() => navigation.navigate('Product', { slug: item.slug })} />
      )}
    />
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: 10 },
  empty: { textAlign: 'center', color: COLORS.muted, marginTop: 40 },
})
