import { Platform } from 'react-native'
import { initialWindowMetrics, useSafeAreaInsets } from 'react-native-safe-area-context'

// 3-button nav is typically ~48px. Gesture / home-handle is 0–24px.
const ANDROID_BUTTON_NAV_MIN = 28

export function useSystemBottomInset() {
  const insets = useSafeAreaInsets()
  const bottom = insets.bottom || initialWindowMetrics?.insets?.bottom || 0
  if (Platform.OS !== 'android') return bottom
  if (bottom < ANDROID_BUTTON_NAV_MIN) return 0
  return bottom
}
