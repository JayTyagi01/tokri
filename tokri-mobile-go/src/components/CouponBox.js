import { useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { useTheme, useThemedStyles } from '../context/ThemeContext'
import { useCart } from '../context/CartContext'

export default function CouponBox() {
  const { colors } = useTheme()
  const styles = useThemedStyles(createStyles)
  const { coupon, couponError, couponLoading, applyCoupon, removeCoupon } = useCart()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const handleApply = async () => {
    setError('')
    try {
      await applyCoupon(code)
      setCode('')
    } catch (err) {
      setError(err.message || 'Could not apply coupon')
    }
  }

  if (coupon?.code) {
    return (
      <View style={styles.applied}>
        <View style={{ flex: 1 }}>
          <Text style={styles.appliedLabel}>Coupon applied</Text>
          <Text style={styles.appliedCode}>{coupon.code}</Text>
          <Text style={styles.appliedMsg}>{coupon.message || `₹${coupon.discount} off`}</Text>
        </View>
        <Pressable onPress={removeCoupon}>
          <Text style={styles.remove}>Remove</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <View style={styles.box}>
      <Text style={styles.label}>Have a coupon?</Text>
      <View style={styles.row}>
        <TextInput
          value={code}
          onChangeText={(value) => setCode(String(value).toUpperCase())}
          placeholder="ENTER CODE"
          placeholderTextColor={colors.muted}
          autoCapitalize="characters"
          style={styles.input}
        />
        <Pressable style={styles.button} onPress={handleApply} disabled={couponLoading || !code.trim()}>
          <Text style={styles.buttonText}>{couponLoading ? '…' : 'Apply'}</Text>
        </Pressable>
      </View>
      {error || couponError ? <Text style={styles.error}>{error || couponError}</Text> : null}
    </View>
  )
}

const createStyles = (c) => ({
  box: {
    backgroundColor: c.panel2,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: c.line,
  },
  label: { color: c.text, fontWeight: '700', marginBottom: 8 },
  row: { flexDirection: 'row', gap: 8 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: c.line,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: c.text,
    fontWeight: '800',
    letterSpacing: 1,
  },
  button: {
    backgroundColor: c.brand,
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  buttonText: { color: c.onBrand, fontWeight: '800' },
  error: { color: '#f87171', marginTop: 8, fontSize: 12 },
  applied: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: c.successBg,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: c.brand,
  },
  appliedLabel: { color: c.mint, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  appliedCode: { color: c.text, fontSize: 16, fontWeight: '800', marginTop: 2 },
  appliedMsg: { color: c.mint, marginTop: 2, fontSize: 12 },
  remove: { color: c.brand, fontWeight: '800' },
})
