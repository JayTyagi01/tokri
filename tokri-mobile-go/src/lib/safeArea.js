import { initialWindowMetrics, useSafeAreaInsets } from 'react-native-safe-area-context'

// Some phones hide the 3-button bar and only show a thin gesture line.
const GESTURE_LINE = 16

export function useSystemBottomInset() {
  const insets = useSafeAreaInsets()
  const reported = Math.max(insets.bottom, initialWindowMetrics?.insets?.bottom || 0)
  return Math.max(reported, GESTURE_LINE)
}
