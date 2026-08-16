import { useState } from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from '../components/Icon'
import { COLORS } from '../config'
import { postJson } from '../lib/api'

export default function LoginScreen({ navigation }) {
  const insets = useSafeAreaInsets()
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  const goBack = () => {
    if (navigation.canGoBack()) navigation.goBack()
    else navigation.navigate('Main')
  }

  const sendOtp = async () => {
    if (!/^\d{10}$/.test(phone)) {
      Alert.alert('Invalid number', 'Enter a valid 10-digit mobile number.')
      return
    }
    setLoading(true)
    try {
      const result = await postJson('/auth/send-otp', { phone })
      navigation.navigate('Otp', { phone, devOtp: result.devOtp || '' })
    } catch (error) {
      Alert.alert('Could not send OTP', error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Pressable style={styles.back} onPress={goBack} hitSlop={12}>
        <Icon name="chevron-back" size={22} color={COLORS.text} />
      </Pressable>

      <View style={styles.content}>
        <View style={styles.hero}>
          <View style={styles.avatar}>
            <Icon name="person" size={42} color={COLORS.white} />
          </View>
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>Enter your mobile number to continue</Text>
        </View>

        <View style={styles.phoneRow}>
          <Text style={styles.prefix}>+91</Text>
          <TextInput
            style={styles.input}
            placeholder="10-digit mobile number"
            placeholderTextColor={COLORS.muted}
            keyboardType="number-pad"
            inputMode="numeric"
            maxLength={10}
            value={phone}
            onChangeText={(value) => setPhone(value.replace(/\D/g, '').slice(0, 10))}
            autoComplete="tel"
            textContentType="telephoneNumber"
            autoFocus
          />
        </View>

        <Pressable
          style={[styles.continueBtn, loading && styles.buttonDisabled]}
          disabled={loading}
          onPress={sendOtp}
        >
          <Text style={styles.continueText}>{loading ? 'Please wait…' : 'Continue'}</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
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
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 8 },
  hero: { alignItems: 'center', paddingBottom: 24 },
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
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 22,
  },
  prefix: { color: COLORS.text, fontSize: 16, fontWeight: '700', marginRight: 10 },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
    paddingVertical: 14,
  },
  continueBtn: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: COLORS.brand,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.55 },
  continueText: { color: COLORS.brand, fontSize: 18, fontWeight: '800' },
})
