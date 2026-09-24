import { useEffect, useState } from 'react'
import { Alert, FlatList, Text, View } from 'react-native'
import ProductCard from '../components/ProductCard'
import LoadingView from '../components/LoadingView'
import { useTheme, useThemedStyles } from '../context/ThemeContext'
import { fetchJson, normalizeProduct } from '../lib/api'

export default function CategoryScreen({ route, navigation }) {
  const { colors } = useTheme()
  const styles = useThemedStyles(createStyles)
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
      columnWrapperStyle={styles.row}
      ListEmptyComponent={<Text style={styles.empty}>No products in this category.</Text>}
      renderItem={({ item }) => (
        <View style={styles.cardWrap}>
          <ProductCard product={item} onPress={(slug, origin) => navigation.navigate('Product', { slug, origin })} />
        </View>
      )}
    />
  )
}

const createStyles = (c) => ({
  container: { flex: 1, backgroundColor: c.background },
  list: { paddingHorizontal: 3, paddingTop: 5, paddingBottom: 16 },
  row: { marginBottom: 5 },
  cardWrap: { flex: 1, paddingHorizontal: 3 },
  empty: { textAlign: 'center', color: c.muted, marginTop: 40 },
})
