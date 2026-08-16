import { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import AppHeader from '../components/AppHeader'
import ProductCard from '../components/ProductCard'
import { COLORS } from '../config'
import { fetchJson, normalizeProduct } from '../lib/api'

export default function SearchScreen({ navigation, route }) {
  const initial = route.params?.q || ''
  const [query, setQuery] = useState(initial)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const openProduct = (slug) => {
    if (slug === 'login') navigation.navigate('Login')
    else navigation.navigate('Product', { slug })
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
        <ActivityIndicator color={COLORS.brand} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={products}
          numColumns={2}
          keyExtractor={(item) => item.slug}
          contentContainerStyle={{ padding: 8 }}
          ListEmptyComponent={<Text style={styles.empty}>No results for “{query}”</Text>}
          renderItem={({ item }) => (
            <View style={{ width: '50%' }}>
              <ProductCard product={item} onPress={openProduct} />
            </View>
          )}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.canvas },
  empty: { color: COLORS.muted, textAlign: 'center', marginTop: 40 },
})
