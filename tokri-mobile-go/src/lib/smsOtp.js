import { Platform } from 'react-native'
import { EventEmitter, requireOptionalNativeModule } from 'expo-modules-core'

const OTP_SENDER = /MHJNTD/i

let nativeModule
function getNativeModule() {
  if (nativeModule !== undefined) return nativeModule
  if (Platform.OS !== 'android') {
    nativeModule = null
    return nativeModule
  }
  try {
    nativeModule = requireOptionalNativeModule('ExpoOtpAutofillConsent')
  } catch {
    nativeModule = null
  }
  return nativeModule
}

export function extractOtpFromSms(message) {
  const text = String(message || '')
  const fromSender = OTP_SENDER.test(text)
  const afterOtp = text.match(/OTP\D{0,12}(\d{4})/i)
  if (afterOtp?.[1]) return afterOtp[1]
  const codes = text.match(/\b(\d{4})\b/g) || []
  if (!codes.length) return ''
  if (fromSender || codes.length === 1) return codes[0]
  return codes[0]
}

export async function startOtpSmsListener() {
  const native = getNativeModule()
  if (!native?.startSmsUserConsent) return false
  try {
    await native.startSmsUserConsent()
    return true
  } catch {
    return false
  }
}

export function subscribeOtpSms(onCode) {
  const native = getNativeModule()
  if (!native) return () => {}

  let subscription
  try {
    const emitter = new EventEmitter(native)
    subscription = emitter.addListener('onSmsReceived', (event) => {
      const code = extractOtpFromSms(event?.message)
      if (code) onCode(code)
    })
  } catch {
    return () => {}
  }

  return () => {
    try {
      subscription?.remove?.()
      native.removeSmsListener?.()
    } catch {
      // Missing native SMS reader should not block OTP entry.
    }
  }
}
