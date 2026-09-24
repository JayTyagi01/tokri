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
import { useTheme, useThemedStyles } from '../context/ThemeContext'
import { postJson } from '../lib/api'
import { startOtpSmsListener } from '../lib/smsOtp'

export default function LoginScreen({ navigation, route }) {
  const { colors } = useTheme()
  const styles = useThemedStyles(createStyles)
  const insets = useSafeAreaInsets()
  const next = route.params?.next
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
      await startOtpSmsListener()
      const result = await postJson('/auth/send-otp', { phone })
      navigation.navigate('Otp', { phone, devOtp: result.devOtp || '', next })
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
        <Icon name="chevron-back" size={22} color={colors.text} />
      </Pressable>

      <View style={styles.content}>
        <View style={styles.hero}>
          <View style={styles.avatar}>
            <Icon name="person" size={42} color={colors.white} />
          </View>
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>Enter your mobile number to continue</Text>
        </View>

        <View style={styles.phoneRow}>
          <Text style={styles.prefix}>+91</Text>
          <TextInput
            style={styles.input}
            placeholder="10-digit mobile number"
            placeholderTextColor={colors.muted}
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

const createStyles = (c) => ({
  screen: { flex: 1, backgroundColor: c.canvas },
  back: {
    marginLeft: 16,
    marginTop: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: c.panel2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 8 },
  hero: { alignItems: 'center', paddingBottom: 24 },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: c.avatar,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  title: { color: c.text, fontSize: 26, fontWeight: '800' },
  subtitle: { color: c.muted, fontSize: 14, marginTop: 6, textAlign: 'center' },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: c.panel,
    borderWidth: 1,
    borderColor: c.line,
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 22,
  },
  prefix: { color: c.text, fontSize: 16, fontWeight: '700', marginRight: 10 },
  input: {
    flex: 1,
    color: c.text,
    fontSize: 16,
    paddingVertical: 14,
  },
  continueBtn: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: c.brand,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.55 },
  continueText: { color: c.brand, fontSize: 18, fontWeight: '800' },
})
