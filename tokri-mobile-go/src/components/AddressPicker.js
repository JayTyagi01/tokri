import { useMemo, useState } from 'react'
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTheme, useThemedStyles } from '../context/ThemeContext'
import { authPost } from '../lib/api'
import { useAddress } from '../context/AddressContext'
import { useAuth } from '../context/AuthContext'
import Icon from './Icon'

const LABELS = ['Home', 'Work', 'Other']

const emptyForm = (phone = '') => ({
  label: 'Home',
  name: '',
  phone,
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
  landmark: '',
})

export default function AddressPicker() {
  const { colors } = useTheme()
  const styles = useThemedStyles(createStyles)
  const navigation = useNavigation()
  const { isLoggedIn, user, token } = useAuth()
  const { addresses, selectedId, pickerOpen, closePicker, selectAddress, refresh } = useAddress()
  const [formOpen, setFormOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(emptyForm())
  const [error, setError] = useState('')

  const showForm = isLoggedIn && (formOpen || addresses.length === 0)

  const startForm = () => {
    setError('')
    setForm(emptyForm(user?.phone || ''))
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setError('')
    if (addresses.length === 0) closePicker()
  }

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  const saveAddress = async () => {
    setError('')
    setSaving(true)
    try {
      const data = await authPost('/account/addresses', token, form)
      await refresh()
      if (data.address?.id) await selectAddress(data.address.id)
      setFormOpen(false)
    } catch (err) {
      setError(err.message || 'Could not save address.')
    } finally {
      setSaving(false)
    }
  }

  const hint = useMemo(() => {
    if (!isLoggedIn) return 'Log in to save a delivery address and place your order.'
    return 'Choose where we should deliver your order.'
  }, [isLoggedIn])

  return (
    <Modal visible={pickerOpen} transparent animationType="slide" onRequestClose={showForm ? closeForm : closePicker}>
      <Pressable style={styles.overlay} onPress={showForm ? closeForm : closePicker}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.handle} />
      {showForm ? (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.formHead}>
            <Text style={styles.title}>Add new address</Text>
            <Pressable onPress={closeForm} hitSlop={10}>
              <Icon name="close" size={20} color={colors.muted} />
            </Pressable>
          </View>
          <Text style={styles.hint}>Where should we deliver your fresh fruits?</Text>
          <ScrollView style={styles.formScroll} keyboardShouldPersistTaps="handled">
            <Text style={styles.fieldLabel}>Save as</Text>
            <View style={styles.chips}>
              {LABELS.map((label) => (
                <Pressable
                  key={label}
                  style={[styles.chip, form.label === label && styles.chipActive]}
                  onPress={() => update('label', label)}
                >
                  <Text style={[styles.chipText, form.label === label && styles.chipTextActive]}>{label}</Text>
                </Pressable>
              ))}
            </View>
            <Field label="Full name" value={form.name} onChangeText={(value) => update('name', value)} placeholder="Receiver name" />
            <Field
              label="Mobile number"
              value={form.phone}
              onChangeText={(value) => update('phone', value.replace(/\D/g, '').slice(0, 10))}
              placeholder="10-digit mobile"
              keyboardType="number-pad"
              prefix="+91"
            />
            <Field
              label="House / flat / building"
              value={form.line1}
              onChangeText={(value) => update('line1', value)}
              placeholder="Flat 402, Green Valley Apartments"
            />
            <Field
              label="Street / area"
              value={form.line2}
              onChangeText={(value) => update('line2', value)}
              placeholder="Sector 18, Noida"
            />
            <View style={styles.twoCol}>
              <View style={{ flex: 1 }}>
                <Field label="City" value={form.city} onChangeText={(value) => update('city', value)} />
              </View>
              <View style={{ flex: 1 }}>
                <Field label="State" value={form.state} onChangeText={(value) => update('state', value)} />
              </View>
            </View>
            <View style={styles.twoCol}>
              <View style={{ flex: 1 }}>
                <Field
                  label="Pincode"
                  value={form.pincode}
                  onChangeText={(value) => update('pincode', value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="6-digit pincode"
                  keyboardType="number-pad"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Field
                  label="Landmark (optional)"
                  value={form.landmark}
                  onChangeText={(value) => update('landmark', value)}
                  placeholder="Near metro gate"
                />
              </View>
            </View>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Pressable style={[styles.save, saving && { opacity: 0.7 }]} onPress={saveAddress} disabled={saving}>
              <Text style={styles.saveText}>{saving ? 'Saving…' : 'Save address'}</Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      ) : (
        <>
          <Text style={styles.title}>Delivery address</Text>
          <Text style={styles.hint}>{hint}</Text>
          {!isLoggedIn ? (
            <Pressable
              style={styles.save}
              onPress={() => {
                closePicker()
                navigation.navigate('Login')
              }}
            >
              <Text style={styles.saveText}>Log in to continue</Text>
            </Pressable>
          ) : (
            <>
              <ScrollView style={styles.list}>
                {addresses.map((address) => (
                  <Pressable
                    key={address.id}
                    style={[styles.row, selectedId === address.id && styles.rowActive]}
                    onPress={() => selectAddress(address.id)}
                  >
                    <Icon name="location" size={18} color={colors.brand} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.label}>{address.label || 'Home'}</Text>
                      <Text style={styles.line}>{address.formatted}</Text>
                    </View>
                    {selectedId === address.id ? <Icon name="checkmark-circle" color={colors.brand} /> : null}
                  </Pressable>
                ))}
              </ScrollView>
              <Pressable style={styles.addBtn} onPress={startForm}>
                <Icon name="add" size={18} color={colors.brand} />
                <Text style={styles.addText}>Add new address</Text>
              </Pressable>
            </>
          )}
        </>
      )}
        </Pressable>
      </Pressable>
    </Modal>
  )
}

function Field({ label, prefix, ...inputProps }) {
  const { colors } = useTheme()
  const styles = useThemedStyles(createStyles)
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.inputWrap}>
        {prefix ? <Text style={styles.prefix}>{prefix}</Text> : null}
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.muted}
          {...inputProps}
        />
      </View>
    </View>
  )
}

const createStyles = (c) => ({
  overlay: {
    flex: 1,
    backgroundColor: c.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: c.panel,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '88%',
    borderWidth: 1,
    borderColor: c.line,
  },
  handle: {
    alignSelf: 'center',
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: c.line,
    marginBottom: 12,
  },
  title: { color: c.text, fontSize: 18, fontWeight: '800' },
  hint: { color: c.muted, marginTop: 6, marginBottom: 12, fontSize: 13 },
  loginHint: { color: c.muted, paddingVertical: 12 },
  list: { maxHeight: 320 },
  row: {
    flexDirection: 'row',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: c.line,
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  rowActive: { borderColor: c.brand, backgroundColor: c.panel2 },
  label: { color: c.text, fontWeight: '700', marginBottom: 4 },
  line: { color: c.mint, fontSize: 12, lineHeight: 18 },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 14,
  },
  addText: { color: c.brand, fontWeight: '800' },
  formHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  formScroll: { maxHeight: 520 },
  field: { marginBottom: 12 },
  fieldLabel: { color: c.text, fontSize: 13, fontWeight: '700', marginBottom: 6 },
  chips: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  chip: {
    borderWidth: 1,
    borderColor: c.line,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: c.panel2,
  },
  chipActive: { backgroundColor: c.brand, borderColor: c.brand },
  chipText: { color: c.text, fontWeight: '700' },
  chipTextActive: { color: '#04140c' },
  twoCol: { flexDirection: 'row', gap: 10 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: c.line,
    backgroundColor: c.panel2,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  prefix: { color: c.muted, marginRight: 8, fontWeight: '700' },
  input: { flex: 1, color: c.text, paddingVertical: 11, fontSize: 14 },
  error: { color: c.danger, marginBottom: 10 },
  save: {
    backgroundColor: c.brand,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  saveText: { color: '#04140c', fontWeight: '800' },
})
