import { useState } from 'react'
import {
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from '../components/Icon'
import { COLORS } from '../config'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useAddress } from '../context/AddressContext'

const SUPPORT_EMAIL = 'support@tokriii.com'

function formatPhone(value) {
  const digits = String(value || '').replace(/\D/g, '')
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2)
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1)
  return digits
}

function maskDob(value) {
  const digits = String(value || '').replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
}

function toDobInput(value) {
  if (!value) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-')
    return `${day}/${month}/${year}`
  }
  return maskDob(value)
}

function fromDobInput(value) {
  const raw = maskDob(value)
  if (!raw) return null
  const dmy = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!dmy) return raw.length ? raw : null
  return `${dmy[3]}-${dmy[2]}-${dmy[1]}`
}

function parseDobDate(value) {
  const iso = fromDobInput(value)
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null
  const [year, month, day] = iso.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null
  return date
}

function formatDobFromDate(date) {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${day}/${month}/${date.getFullYear()}`
}

export default function AccountScreen({ navigation }) {
  const insets = useSafeAreaInsets()
  const { user, isLoggedIn, logout, updateProfile } = useAuth()
  const { setCart } = useCart()
  const { openPicker } = useAddress()
  const [nameOpen, setNameOpen] = useState(false)
  const [name, setName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [showDobPicker, setShowDobPicker] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const goBack = () => {
    if (navigation.canGoBack()) navigation.goBack()
    else navigation.navigate('Home')
  }

  const openHelp = () => {
    Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=Tokriii support`)
  }

  const shareApp = () => {
    Share.share({
      message: 'Order fresh fruits on Tokriii: https://tokriii.com',
      url: 'https://tokriii.com',
      title: 'Tokriii',
    }).catch(() => {})
  }

  const handleLogout = async () => {
    await logout()
    setCart(null)
  }

  const openNameSheet = () => {
    setError('')
    setName(user?.name || '')
    setDateOfBirth(toDobInput(user?.dateOfBirth))
    setShowDobPicker(false)
    setNameOpen(true)
  }

  const closeNameSheet = () => {
    setNameOpen(false)
    setShowDobPicker(false)
    setError('')
  }

  const onDobPicked = (event, selected) => {
    if (Platform.OS === 'android') setShowDobPicker(false)
    if (event.type === 'dismissed') return
    if (selected) setDateOfBirth(formatDobFromDate(selected))
  }

  const saveName = async () => {
    const nextName = name.trim()
    if (!nextName) {
      setError('Please enter your name.')
      return
    }
    if (nextName.length > 80) {
      setError('Name is too long.')
      return
    }
    const nextDob = fromDobInput(dateOfBirth)
    if (dateOfBirth && !/^\d{4}-\d{2}-\d{2}$/.test(nextDob || '')) {
      setError('Enter date of birth as DD/MM/YYYY.')
      return
    }
    setSaving(true)
    setError('')
    try {
      await updateProfile({ name: nextName, dateOfBirth: nextDob })
      setNameOpen(false)
    } catch (err) {
      setError(err.message || 'Could not save name.')
    } finally {
      setSaving(false)
    }
  }

  const phone = formatPhone(user?.phone)

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <Pressable style={styles.back} onPress={goBack} hitSlop={12}>
        <Icon name="chevron-back" size={22} color={COLORS.text} />
      </Pressable>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.avatar}>
            <Icon name="person" size={42} color={COLORS.white} />
          </View>
          <Text style={styles.title}>Your account</Text>
          {isLoggedIn ? (
            phone ? <Text style={styles.subtitle}>{phone}</Text> : null
          ) : (
            <>
              <Text style={styles.subtitle}>Log in to view your complete profile.</Text>
              <Pressable style={styles.loginBtn} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginText}>Login</Text>
              </Pressable>
            </>
          )}
        </View>

        <View style={styles.quickRow}>
          <QuickCard
            icon="basket-outline"
            label="Your orders"
            onPress={() => navigation.navigate('Orders')}
          />
          <QuickCard icon="location-outline" label="Address" onPress={openPicker} />
          <QuickCard icon="chatbubbles-outline" label="Need help?" onPress={openHelp} />
        </View>

        <View style={styles.block}>
          <Row icon="moon-outline" label="Appearance" trailing="DARK" />
        </View>

        {isLoggedIn ? (
          <>
            <Text style={styles.section}>Your information</Text>
            <View style={styles.block}>
              <Row
                icon="person-outline"
                label="Profile"
                trailing={user?.name || undefined}
                onPress={openNameSheet}
              />
            </View>
          </>
        ) : null}

        <Text style={styles.section}>Other information</Text>
        <View style={styles.block}>
          <Row icon="share-outline" label="Share the app" onPress={shareApp} />
          <Row
            icon="book-outline"
            label="About us"
            onPress={() => Linking.openURL('https://tokriii.com/about')}
          />
          {isLoggedIn ? (
            <Row icon="log-out-outline" label="Logout" danger onPress={handleLogout} />
          ) : null}
        </View>

        <Text style={styles.brandMark}>tokriii</Text>
      </ScrollView>

      <Modal visible={nameOpen} transparent animationType="slide" onRequestClose={closeNameSheet}>
        <KeyboardAvoidingView
          style={styles.sheetWrap}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Pressable style={styles.overlay} onPress={closeNameSheet} />
          <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
            <View style={styles.handle} />
            <View style={styles.formHead}>
              <Text style={styles.sheetTitle}>Profile</Text>
              <Pressable onPress={closeNameSheet} hitSlop={10}>
                <Icon name="close" size={20} color={COLORS.muted} />
              </Pressable>
            </View>
            <Text style={styles.fieldLabel}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Your name"
              placeholderTextColor={COLORS.muted}
              value={name}
              onChangeText={setName}
              autoFocus
              autoCapitalize="words"
              autoComplete="name"
              textContentType="name"
              maxLength={80}
              returnKeyType="next"
            />
            <Text style={styles.fieldLabel}>Date of birth</Text>
            <View style={styles.dobRow}>
              <TextInput
                style={styles.dobInput}
                placeholder="DD/MM/YYYY"
                placeholderTextColor={COLORS.muted}
                value={dateOfBirth}
                onChangeText={(value) => setDateOfBirth(maskDob(value))}
                keyboardType="number-pad"
                inputMode="numeric"
                maxLength={10}
                autoComplete="birthdate-full"
                returnKeyType="done"
                onSubmitEditing={saveName}
              />
              <Pressable style={styles.dobIcon} onPress={() => setShowDobPicker((open) => !open)} hitSlop={8}>
                <Icon name="calendar-outline" size={22} color={COLORS.brand} />
              </Pressable>
            </View>
            {showDobPicker ? (
              <DateTimePicker
                value={parseDobDate(dateOfBirth) || new Date(2000, 0, 1)}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                themeVariant="dark"
                maximumDate={new Date()}
                minimumDate={new Date(1920, 0, 1)}
                onChange={onDobPicked}
              />
            ) : null}
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Pressable
              style={[styles.saveBtn, saving && styles.buttonDisabled]}
              onPress={saveName}
              disabled={saving}
            >
              <Text style={styles.saveText}>{saving ? 'Please wait…' : 'Save'}</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  )
}

function QuickCard({ icon, label, onPress }) {
  return (
    <Pressable style={styles.quick} onPress={onPress}>
      <Icon name={icon} size={26} color={COLORS.text} />
      <Text style={styles.quickLabel}>{label}</Text>
    </Pressable>
  )
}

function Row({ icon, label, trailing, onPress, danger }) {
  return (
    <Pressable style={styles.row} onPress={onPress} disabled={!onPress}>
      <Icon name={icon} size={20} color={danger ? COLORS.danger : COLORS.text} />
      <Text style={[styles.rowLabel, danger && { color: COLORS.danger }]}>{label}</Text>
      {trailing ? <Text style={styles.trailing}>{trailing}{onPress ? '' : '  ⌄'}</Text> : null}
      {onPress ? <Icon name="chevron-forward" size={16} color={COLORS.muted} /> : null}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.canvas },
  back: {
    marginLeft: 16,
    marginTop: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.panel2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { paddingHorizontal: 16 },
  hero: { alignItems: 'center', paddingTop: 8, paddingBottom: 20 },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#3a3a3a',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  title: { color: COLORS.text, fontSize: 26, fontWeight: '800' },
  subtitle: { color: COLORS.muted, fontSize: 14, marginTop: 6, textAlign: 'center' },
  loginBtn: {
    marginTop: 18,
    width: '100%',
    borderWidth: 1.5,
    borderColor: COLORS.brand,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  loginText: { color: COLORS.brand, fontSize: 18, fontWeight: '800' },
  quickRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  quick: {
    flex: 1,
    backgroundColor: COLORS.panel,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  quickLabel: { color: COLORS.text, fontSize: 12, fontWeight: '700', textAlign: 'center' },
  section: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
    marginTop: 8,
  },
  block: {
    backgroundColor: COLORS.panel,
    borderRadius: 14,
    marginBottom: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.line,
  },
  rowLabel: { flex: 1, color: COLORS.text, fontSize: 15, fontWeight: '600' },
  trailing: { color: COLORS.muted, fontSize: 12, fontWeight: '700', letterSpacing: 0.4 },
  brandMark: {
    textAlign: 'center',
    color: COLORS.line,
    fontSize: 28,
    fontWeight: '800',
    marginTop: 12,
    letterSpacing: -0.5,
  },
  sheetWrap: { flex: 1, justifyContent: 'flex-end' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  sheet: {
    backgroundColor: COLORS.panel,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  handle: {
    alignSelf: 'center',
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.line,
    marginBottom: 12,
  },
  formHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sheetTitle: { color: COLORS.text, fontSize: 18, fontWeight: '800' },
  fieldLabel: { color: COLORS.text, fontSize: 13, fontWeight: '700', marginBottom: 8 },
  input: {
    backgroundColor: COLORS.panel2,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: COLORS.text,
    fontSize: 16,
    marginBottom: 16,
  },
  dobRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.panel2,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 14,
    marginBottom: 16,
    paddingRight: 6,
  },
  dobInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  dobIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: { color: COLORS.danger, marginBottom: 12, fontSize: 13 },
  saveBtn: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: COLORS.brand,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonDisabled: { opacity: 0.55 },
  saveText: { color: COLORS.brand, fontSize: 18, fontWeight: '800' },
})
