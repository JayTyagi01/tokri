import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme, useThemedStyles } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import Icon from './Icon'

export default function ProfileDrawer({ visible, onClose, navigation }) {
  const { colors } = useTheme()
  const styles = useThemedStyles(createStyles)
  const insets = useSafeAreaInsets()
  const { user, isLoggedIn, logout } = useAuth()
  const { setCart } = useCart()

  const go = (screen) => {
    onClose()
    if (['Home', 'Categories', 'Cart', 'Account', 'Reorder'].includes(screen)) {
      navigation.navigate('Main', { screen })
    } else {
      navigation.navigate(screen)
    }
  }

  const handleLogout = async () => {
    await logout()
    setCart(null)
    onClose()
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.dim} onPress={onClose} />
        <View style={[styles.drawer, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.head}>
            <Text style={styles.title}>{isLoggedIn ? user?.name || 'My account' : 'Welcome'}</Text>
            <Pressable onPress={onClose} hitSlop={10}>
              <Icon name="close" size={24} color={colors.text} />
            </Pressable>
          </View>
          {isLoggedIn ? <Text style={styles.phone}>+91 {user?.phone}</Text> : null}

          {!isLoggedIn ? (
            <Pressable style={styles.primary} onPress={() => go('Login')}>
              <Text style={styles.primaryText}>Login / Sign up</Text>
            </Pressable>
          ) : null}

          <MenuItem icon="receipt-outline" label="My orders" onPress={() => go('Orders')} />
          <MenuItem icon="location-outline" label="Saved addresses" onPress={() => go('Account')} />
          <MenuItem icon="cart-outline" label="Cart" onPress={() => go('Cart')} />
          {isLoggedIn ? (
            <Pressable style={styles.logout} onPress={handleLogout}>
              <Icon name="log-out-outline" color={colors.danger} />
              <Text style={styles.logoutText}>Logout</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </Modal>
  )
}

function MenuItem({ icon, label, onPress }) {
  const { colors } = useTheme()
  const styles = useThemedStyles(createStyles)
  return (
    <Pressable style={styles.item} onPress={onPress}>
      <Icon name={icon} color={colors.mint} />
      <Text style={styles.itemText}>{label}</Text>
      <Icon name="chevron-forward" size={16} color={colors.muted} />
    </Pressable>
  )
}

const createStyles = (c) => ({
  overlay: { flex: 1, flexDirection: 'row' },
  dim: { flex: 1, backgroundColor: c.overlay },
  drawer: {
    width: 300,
    backgroundColor: c.panel,
    borderLeftWidth: 1,
    borderLeftColor: c.line,
    paddingHorizontal: 16,
  },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: c.text, fontSize: 20, fontWeight: '800' },
  phone: { color: c.mint, marginTop: 4, marginBottom: 16 },
  primary: {
    backgroundColor: c.brand,
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryText: { color: c.onBrand, fontWeight: '800' },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: c.line,
  },
  itemText: { flex: 1, color: c.text, fontSize: 15, fontWeight: '600' },
  logout: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 24 },
  logoutText: { color: c.danger, fontWeight: '700' },
})
