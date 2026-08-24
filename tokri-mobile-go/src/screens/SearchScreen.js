import { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Text, View } from 'react-native'
import AppHeader from '../components/AppHeader'
import ProductCard from '../components/ProductCard'
import { useTheme, useThemedStyles } from '../context/ThemeContext'
import { fetchJson, normalizeProduct } from '../lib/api'

export default function SearchScreen({ navigation, route }) {
  const { colors } = useTheme()
  const styles = useThemedStyles(createStyles)
  const initial = route.params?.q || ''
  const [query, setQuery] = useState(initial)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const openProduct = (slug) => {
    navigation.navigate('Product', { slug })
  }

  const run = async (term) => {
    const q = String(term || '').trim()
    if (!q) {
      setProducts([])
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const data = await fetchJson(`/search?q=${encodeURIComponent(q)}`)
      setProducts((data.products || []).map(normalizeProduct))
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    run(initial)
  }, [initial])

  return (
    <View style={styles.screen}>
      <AppHeader
        navigation={navigation}
        onSearch={(term) => {
          setQuery(term)
          run(term)
        }}
      />
      {loading ? (
        <ActivityIndicator color={colors.brand} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={products}
          numColumns={2}
          keyExtractor={(item) => item.slug}
          contentContainerStyle={{ paddingHorizontal: 3, paddingTop: 5, paddingBottom: 16 }}
          columnWrapperStyle={{ marginBottom: 5 }}
          ListEmptyComponent={<Text style={styles.empty}>No results for “{query}”</Text>}
          renderItem={({ item }) => (
            <View style={{ flex: 1, paddingHorizontal: 3 }}>
              <ProductCard product={item} onPress={openProduct} />
            </View>
          )}
        />
      )}
    </View>
  )
}

const createStyles = (c) => ({
  screen: { flex: 1, backgroundColor: c.canvas },
  empty: { color: c.muted, textAlign: 'center', marginTop: 40 },
})
