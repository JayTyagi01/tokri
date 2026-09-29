import { useMemo } from 'react'
import { Modal, Pressable, ScrollView, Text, View } from 'react-native'
import { Image } from 'expo-image'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme, useThemedStyles } from '../context/ThemeContext'
import { formatPrice } from '../lib/api'
import { upiAppById } from '../lib/upiApps'
import Icon from './Icon'

const OTHER_METHODS = {
  card: { label: 'Credit or debit card', hint: 'Visa, Mastercard, RuPay', icon: 'card-outline' },
  netbanking: { label: 'Netbanking', hint: 'All major banks', icon: 'business-outline' },
  wallet: { label: 'Wallets', hint: 'Amazon Pay, Mobikwik and more', icon: 'wallet-outline' },
  cod: { label: 'Pay on Delivery', hint: 'Cash or UPI when the order arrives', icon: 'cash-outline' },
}

export function paymentLabel(choice) {
  const app = upiAppById(choice)
  if (app) return `${app.label} UPI`
  return OTHER_METHODS[choice]?.label || 'Select'
}

export function PaymentMark({ choice, size = 36 }) {
  const styles = useThemedStyles(createStyles)
  const app = upiAppById(choice)
  if (app?.icon) {
    return (
      <Image
        source={app.icon}
        style={{ width: size, height: size, borderRadius: Math.round(size * 0.22) }}
        contentFit="cover"
      />
    )
  }
  if (app) {
    return (
      <View style={[styles.mark, { width: size, height: size, backgroundColor: app.color }]}>
        <Text style={[styles.markText, size < 30 && { fontSize: 9 }]}>{app.mark}</Text>
      </View>
    )
  }
  const method = OTHER_METHODS[choice]
  return (
    <View style={[styles.mark, styles.markPlain, { width: size, height: size }]}>
      <Icon name={method?.icon || 'wallet-outline'} size={Math.round(size * 0.55)} color="#334155" />
    </View>
  )
}

export default function PaymentSheet({
  visible,
  total,
  choice,
  onlineEnabled,
  codEnabled,
  installedUpiIds = [],
  onSelect,
  onClose,
}) {
  const { colors } = useTheme()
  const styles = useThemedStyles(createStyles)
  const insets = useSafeAreaInsets()

  const upiIds = useMemo(() => {
    if (installedUpiIds?.length) return installedUpiIds
    return ['gpay', 'phonepe', 'paytm', 'cred', 'amazon', 'bhim']
  }, [installedUpiIds])

  const sections = []
  if (onlineEnabled) {
    if (upiIds.length) sections.push({ title: 'UPI', items: upiIds })
    sections.push({ title: 'Cards', items: ['card'] })
    sections.push({ title: 'Netbanking', items: ['netbanking'] })
    sections.push({ title: 'Wallets', items: ['wallet'] })
  }
  if (codEnabled) sections.push({ title: 'Pay on Delivery', items: ['cod'] })

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Pressable onPress={onClose} hitSlop={12} style={styles.back}>
            <Icon name="arrow-back" size={22} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Bill total: {formatPrice(total)}</Text>
        </View>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 + insets.bottom, gap: 14 }}>
          {sections.length ? (
            sections.map((section) => (
              <View key={section.title} style={styles.card}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                {section.title === 'UPI' ? (
                  <Text style={styles.sectionHint}>Apps installed on this phone</Text>
                ) : null}
                {section.items.map((item, index) => {
                  const app = upiAppById(item)
                  const method = OTHER_METHODS[item]
                  const selected = choice === item
                  return (
                    <Pressable
                      key={item}
                      style={[styles.row, index > 0 && styles.rowLine]}
                      onPress={() => onSelect(item)}
                    >
                      <View style={styles.logoBox}>
                        <PaymentMark choice={item} size={32} />
                      </View>
                      <View style={styles.rowCopy}>
                        <Text style={styles.rowLabel}>{paymentLabel(item)}</Text>
                        {method?.hint ? (
                          <Text style={styles.rowHint} numberOfLines={1}>
                            {method.hint}
                          </Text>
                        ) : app ? (
                          <Text style={styles.rowHint} numberOfLines={1}>
                            Pay with {app.label}
                          </Text>
                        ) : null}
                      </View>
                      {selected ? (
                        <Icon name="checkmark-circle" size={22} color={colors.brand} />
                      ) : (
                        <Icon name="chevron-forward" size={18} color={colors.muted} />
                      )}
                    </Pressable>
                  )
                })}
              </View>
            ))
          ) : (
            <Text style={styles.empty}>No payment method is available right now.</Text>
          )}
        </ScrollView>
      </View>
    </Modal>
  )
}

const createStyles = (c) => ({
  screen: { flex: 1, backgroundColor: c.canvas },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: c.panel,
    borderBottomWidth: 1,
    borderColor: c.line,
  },
  back: { padding: 2 },
  headerTitle: { color: c.text, fontSize: 17, fontWeight: '700' },
  card: {
    backgroundColor: c.panel,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 4,
    borderWidth: 1,
    borderColor: c.line,
  },
  sectionTitle: { color: c.text, fontSize: 16, fontWeight: '800', marginBottom: 4 },
  sectionHint: { color: c.muted, fontSize: 12, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12 },
  rowLine: { borderTopWidth: 1, borderColor: c.line },
  logoBox: {
    width: 52,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: c.line,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowCopy: { flex: 1, minWidth: 0 },
  rowLabel: { color: c.text, fontSize: 15, fontWeight: '600' },
  rowHint: { color: c.muted, fontSize: 12, marginTop: 2 },
  mark: { borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  markPlain: { backgroundColor: 'transparent' },
  markText: { color: '#fff', fontWeight: '800', fontSize: 11 },
  empty: { color: c.muted, textAlign: 'center', marginTop: 40 },
})
