import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import { useTheme, useThemedStyles } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function ProfileScreen({ navigation }) {
  const { colors } = useTheme()
  const styles = useThemedStyles(createStyles)
  const { user, isLoggedIn, logout } = useAuth()
  const { setCart } = useCart()

  const handleLogout = async () => {
    await logout()
    setCart(null)
    Alert.alert('Logged out')
  }

  if (!isLoggedIn) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Welcome to Tokriii</Text>
        <Text style={styles.subtitle}>Login to sync cart and orders with the website.</Text>
        <Pressable style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Login with OTP</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{user.name || 'Not set'}</Text>
        <Text style={styles.label}>Phone</Text>
        <Text style={styles.value}>+91 {user.phone}</Text>
      </View>

      <Pressable style={styles.menuItem} onPress={() => navigation.navigate('Orders')}>
        <Text style={styles.menuText}>My orders</Text>
      </Pressable>

      <Pressable style={[styles.button, styles.logout]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </Pressable>
    </View>
  )
}

const createStyles = (c) => ({
  container: { flex: 1, backgroundColor: c.background, padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: '800', color: c.primary },
  subtitle: { color: c.muted, textAlign: 'center', marginTop: 8, marginBottom: 20, lineHeight: 22 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: c.border,
    marginBottom: 16,
  },
  label: { color: c.muted, fontSize: 12, marginTop: 8 },
  value: { color: c.text, fontSize: 16, fontWeight: '600' },
  menuItem: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: c.border,
    marginBottom: 12,
  },
  menuText: { fontSize: 16, fontWeight: '600', color: c.text },
  button: {
    backgroundColor: c.primaryLight,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logout: { marginTop: 'auto', backgroundColor: c.danger },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
})
